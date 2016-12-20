var h = 350;
var w = 1000;

var rhpiData = window.rhpi;

monthlySales = [
    {"month":10, "sales":100},
    {"month":20, "sales":130},
    {"month":30, "sales":250},
    {"month":40, "sales":300},
    {"month":50, "sales":265},
    {"month":60, "sales":225},
    {"month":70, "sales":180},
    {"month":80, "sales":120},
    {"month":90, "sales":145},
    {"month":100, "sales":130}
];

//Function to generate line "path"
function generatePathData(data) {
    var counter = 1;
    var lineFun = d3.svg.line()
        .x(function (d) {
            counter = counter + 5;
            return counter;
        })
        .y(function (d) {
            return h-d.value;
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

//create our SVG
var svg = d3.select("#svg").append("svg").attr({ width:w, height: h});

//build the viz
$(".country-list-drop-down").select2({
    placeholder: "Select a country"
});
$(".country-list-drop-down").change(function() {
    var selectedCountries = $(".country-list-drop-down").val();
    svg.selectAll("path").remove();
    for(var i = 0; i<selectedCountries.length; i++) {
        pathGenerator(rhpiData.data[selectedCountries[i]].data, "black");
    }
});