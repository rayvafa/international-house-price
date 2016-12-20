var height = 350;
var width = 1000;
var padding = 40;

var rhpiData = window.rhpi;

function getDate(date){

    //1975:Q1
    var dateSegments = date.split(':');
    var year = dateSegments[0];
    var quarter = dateSegments[1];
    if(quarter === 'Q1') {
        return new Date(year, 2, 31);
    } else if(quarter === 'Q2') {
        return new Date(year, 5, 30);
    } else if(quarter === 'Q3') {
        return new Date(year, 8, 30);
    } else if(quarter === 'Q4') {
        return new Date(year, 11, 30);
    }
    return null;
}

//create our SVG
var svg = d3.select("#svg").append("svg").attr({ width:width, height: height});

var minDate = getDate(rhpiData.data[0].data[0].date);
var maxDate = getDate(rhpiData.data[0].data[rhpiData.data[0].data.length - 1].date);

var xScale = d3.time.scale()
    .domain([minDate, maxDate])
    .range([padding+5, width - padding])
    .nice();


var yScale = d3.scale.linear()
    .domain([0, 250])
    .range([height - padding , 10])
    .nice();

var xAxisGen = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.time.format("%Y"));
var yAxisGen = d3.svg.axis().scale(yScale).orient("left").ticks(4);

var yAxis = svg.append("g").call(yAxisGen)
    .attr("class", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)");

var xAxis = svg.append("g").call(xAxisGen)
    .attr("class","x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")");

//build the viz
//Function to generate line "path"
function generatePathData(data) {
    var lineFun = d3.svg.line()
        .x(function (d) {
            return xScale(getDate(d.date));
        })
        .y(function (d) {
            return yScale(d.value);
        })
        .interpolate("linear");
    return lineFun(data);
}

function pathGenerator(data, color) {
    var viz = svg.append("path")
        .attr({
            d: generatePathData(data),
            "stroke": color,
            "stroke-width": 2,
            "fill": "none"
        });
}

$(".country-list-drop-down").select2({
    placeholder: "Select a country"
});
$(".country-list-drop-down").change(function() {
    var selectedCountries = $(".country-list-drop-down").val();
    // svg.selectAll("path").remove();
    for(var i = 0; i<selectedCountries.length; i++) {
        pathGenerator(rhpiData.data[selectedCountries[i]].data, "black");
    }
});
