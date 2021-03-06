var height = 350;
var width = 1000;
var padding = 40;
window.dataBlobs = {
  selectedCountriesIndex: []
};
var rhpiData = window.rhpi;
var hpiData = window.hpi;
var pdiData = window.pdi;
var rpdiData = window.rpdi;

function getDate(date) {

  //1975:Q1
  var dateSegments = date.split(':');
  var year = dateSegments[0];
  var quarter = dateSegments[1];
  if (quarter === 'Q1') {
    return new Date(year, 2, 31);
  } else if (quarter === 'Q2') {
    return new Date(year, 5, 30);
  } else if (quarter === 'Q3') {
    return new Date(year, 8, 30);
  } else if (quarter === 'Q4') {
    return new Date(year, 11, 30);
  }
  return null;
}

//create our SVG
var svg = d3.select("#svg").append("svg").attr({width: width, height: height});

var minDate = getDate(rhpiData.data[0].data[0].date);
var maxDate = getDate(rhpiData.data[0].data[rhpiData.data[0].data.length - 1].date);

var xScale = d3.time.scale()
  .domain([minDate, maxDate])
  .range([padding + 5, width - padding])
  .nice();


var yScale = d3.scale.linear()
  .domain([0, 220])
  .range([height - padding, 10])
  .nice();

var xAxisGen = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.time.format("%Y"));
var yAxisGen = d3.svg.axis().scale(yScale).orient("left").ticks(4);

var yAxis = svg.append("g").call(yAxisGen)
  .attr("class", "y-axis")
  .attr("transform", "translate(" + padding + ", 0)");

var xAxis = svg.append("g").call(xAxisGen)
  .attr("class", "x-axis")
  .attr("transform", "translate(0," + (height - padding) + ")");

//build the path
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

function pathGenerator(selectedCountryData, selectedCountriesIndex, color, opacity) {
  var path = svg.append("path")
    .attr({
      d: generatePathData(selectedCountryData.data),
      "stroke": color,
      "opacity": opacity,
      "stroke-width": 2,
      "fill": "none",
      "fill-opacity": 0,
      "class": "country-path-" + selectedCountriesIndex,
    });
  var pathLength = path.node().getTotalLength();

  path.attr("stroke-dasharray", pathLength + " " + pathLength)
    .attr("stroke-dashoffset", pathLength)
    .transition()
    .duration(1250)
    .attr("stroke-dashoffset", 0);

  var lastDataItem = selectedCountryData.data[selectedCountryData.data.length - 1];
  var label = svg.append("text")
    .text(function(d){ return selectedCountryData.name; })
    .attr({
      x: function(d){ return xScale(getDate("2016:Q4")); },
      y: function(d){ return yScale(lastDataItem.value); },
      "class": "country-text-" + selectedCountriesIndex,
      "font-size": "12px",
      "font-family": "sans-serif",
      "fill": "#666666",
      "text-anchor": "start",
      "dy": ".35em",
    });
}

$(".country-list-drop-down").select2({
  placeholder: "Select a country"
});

$(".country-list-drop-down").change(function () {
  var selectedCountriesIndex = $(".country-list-drop-down").val() || [];
  _.difference(window.dataBlobs.selectedCountriesIndex, selectedCountriesIndex).map(function (countryIndex) {
    svg.selectAll(".country-path-" + countryIndex).remove();
    svg.selectAll(".country-text-" + countryIndex).remove();
  });
  _.difference(selectedCountriesIndex, window.dataBlobs.selectedCountriesIndex).map(function (countryIndex) {
    var activeChartTypes = [];
    $('.btn.btn-default.active').each(function (index) {
      activeChartTypes.push($(this).val());
    });
    _.map(activeChartTypes, function (activeChartType) {
      if (activeChartType === 'HPI') {
        pathGenerator(hpiData.data[countryIndex], countryIndex, window.colours[countryIndex].color, 1);
      } else if (activeChartType === 'RHPI') {
        pathGenerator(rhpiData.data[countryIndex], countryIndex, "#3EFF2D");
      } else if (activeChartType === 'PDI') {
        pathGenerator(pdiData.data[countryIndex], countryIndex, window.colours[countryIndex].color, 0.5);
      } else if (activeChartType === 'RPDI') {
        pathGenerator(rpdiData.data[countryIndex], countryIndex, "#FF009E");
      }
    });
  });
  window.dataBlobs.selectedCountriesIndex = selectedCountriesIndex;
});

$('.btn.btn-default').click(function (event) {
  $(this).toggleClass('active');
  $(".country-list-drop-down").val('');
  var selectedItems = $(".select2-selection__choice__remove");
  for(var i = selectedItems.length - 1; i >= 0; i--) {
    $(selectedItems[i]).click();
  }
});
