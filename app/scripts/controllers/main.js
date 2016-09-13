'use strict';

angular.module('D3GraphsApp').controller('MainCtrl', function ($scope) {
  $scope.trainingChannel = '1:1 Coaching';
  $scope.comparativeOption = 'Districts in my region';
  $scope.therapeuticOrSkill = 'All';
  $scope.CSV_Data;
  $scope.trainingChannelChange = function(value) {
  	console.log('trainingChannelChange value:', value);
  	ActivityCompletionComplianceChart ($scope.CSV_Data);
  	CoachingActivityCompletion ($scope.CSV_Data);
  };

  $scope.comparativeOptionChange = function(value) {
  	console.log('comparativeOptionChange value:', value);
  	ActivityCompletionComplianceChart ($scope.CSV_Data);
  	CoachingActivityCompletion ($scope.CSV_Data);
  };

  $scope.therapeuticOrSkillChange = function(value) {
  	console.log('therapeuticOrSkillChange value:', value);
  	ActivityCompletionComplianceChart ($scope.CSV_Data);
  	CoachingActivityCompletion ($scope.CSV_Data);
  }

// Chart dimensions
var margin = {
    top: 20,
    right: 120,
    bottom: 60,
    left: 40
  },
  width = $('.execution-graph2').width() - margin.right - margin.left,
  height = 280 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .5);

var y = d3.scale.linear()
  .rangeRound([height, 0]);

var color = d3.scale.ordinal()
  .range([ "rgb(154,186,88)", "rgb(126,126,126)", "rgb(255,230,0)",    "rgb(192,80,77)"]);

var xAxis = d3.svg.axis()
	.scale(x)
	.tickSize(0)
	.tickPadding(9)
  .tickSize(-height)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.tickSize(-width)
	.tickPadding(9)
	.ticks(5)
	.tickFormat(d3.format("%"));

function ActivityCompletionComplianceChart (oData) {
	$('#stackedBarChart').html('');
	var svg = d3.select("svg#stackedBarChart")
  	.attr("width", width + margin.left + margin.right)
  	.attr("height", height + margin.top + margin.bottom)
  	.append("g")
  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var data = [];
  var csvData = angular.copy(oData);
  data['columns'] = Object.keys(oData[0]);
  for (var i = 0; i < csvData.length; i++) {
    if(csvData[i]['Graph Selection'].trim() === $scope.comparativeOption && csvData[i]['Therapy Area'].trim() === $scope.therapeuticOrSkill && csvData[i]['Type'].trim() === $scope.trainingChannel ) {
        delete csvData[i]['Graph Selection'], delete csvData[i]['Type'], delete csvData[i]['Therapy Area'], delete csvData[i]['Completed'], delete csvData[i]['In Progress'], delete csvData[i]['Submitted'], delete csvData[i]['Target'], delete csvData[i]['Actual'];
        //csvData[i]['total'] = 1;
        //var y0 = 0;
      //csvData[i].activities = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
        data.push(csvData[i]);
    }
  }
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Role"; }));
  // Will remove this loop
	data.forEach(function(d) {
	    var y0 = 0;
	    d.activities = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
	    d.total = 1 ;
	});

	console.log('ActivityCompletionComplianceChart data: ', data);

	x.domain(data.map(function(d) { return d.Role; }));
	y.domain([0, d3.max(data, function(d) { return d.total; })]);

	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + (height + 20) + ")")
	  .style("fill", "#666")
	  .style("font-size", "12px")
	  .call(xAxis);

	svg.append("g")
	  .attr("class", "y axis")
	  .style("fill", "#666")
	  .style("font-size", "12px")
	  .call(yAxis)
	  .append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", -60)
	  .attr("x", 0 - (height / 2))
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("Dollars(k)");

	var Role = svg.selectAll(".Role")
	  .data(data)
	  .enter().append("g")
	  .attr("class", "g")
	  .attr("transform", function(d) { return "translate(" + x(d.Role) + ",0)"; });

	Role.selectAll("rect")
	  .data(function(d) { return d.activities; })
	  .enter().append("rect")
	  .attr("width", x.rangeBand())
	  .attr("y", function(d) { return y(d.y1); })
	  .attr("height", function(d) { return y(d.y0) - y(d.y1); })
	  .style("fill", function(d) { return color(d.name); });

	var legend = svg.selectAll(".legend")
	  .data(color.domain().slice().reverse())
		.enter().append("g")
	  .attr("class", "legend")
	  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
	  .attr("x", width + 75)
	  .attr("y", 80)
	  .attr("width", 18)
	  .attr("height", 18)
	  .style("fill", color);

	legend.append("text")
	  .attr("x", width + 65)
	  .attr("y", 95)
	  .attr("dy", ".35em")
	  .style("fill", "#fff")
	  .style("font-size", "10px")
	  .style("text-anchor", "end")
	  .text(function(d) { return d; });
  };

// Coaching Activity Completion graph
function CoachingActivityCompletion (oData) {
	$('#linearBarChart').html('');
    var data = [];
    var tempObj;
    var csvData = angular.copy(oData);
    for (var i = 0; i < csvData.length; i++) {
      if(csvData[i]['Graph Selection'].trim() === $scope.comparativeOption && csvData[i]['Therapy Area'].trim() === $scope.therapeuticOrSkill && csvData[i]['Type'].trim() === $scope.trainingChannel ) {
            tempObj = {
              Actual: csvData[i]['Actual'],
              Target: csvData[i]['Target'],
              Role: csvData[i]['Role']
            };
          data.push(tempObj);
      }
    }

    console.log('CoachingActivityCompletion data: ', data);

  var formatPercent = d3.format("");
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-50);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5, "d")
    .innerTickSize(-width)
    .tickFormat(formatPercent);
    
   var coachingActivityChart = d3.select("svg#linearBarChart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) {
      return d.Role;
    }));
    y.domain([0, d3.max(data, function(d) {
      if(parseInt(d.Actual) > parseInt(d.Target)){
        return parseInt(d.Actual);
      } else {
        return parseInt(d.Target);
      }
      
    })]);

    coachingActivityChart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height + 20) + ")")
      .call(xAxis);

    coachingActivityChart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    var eSel = coachingActivityChart.selectAll(".bar")
      .data(data)
      .enter();
      
    eSel.append("rect")
    .attr("class", "bar")
    .style("fill", "yellow")
    .attr("x", function(d) {
      return x(d.Role);
    })
    .attr("width", x.rangeBand())
    .attr("y", function(d) {
      return y(d.Actual);
    })
    .attr("height", function(d) {
      return height - y(d.Actual);
    });

    d3.selectAll(".tick > text")
    .style("font-size", 8)
    .style("fill", "#fff");

    eSel.append("path")
      .style("stroke", "blue")
      .style("stroke-width", 1)
      .attr("width", 12)
      .attr("d", function(d){
        var rv = "M" + x(d.Role) + "," + y(d.Target);
        rv += "L" + (x(d.Role) + x.rangeBand()) + "," + y(d.Target);
        return rv;
      }); 

  var legend = coachingActivityChart.selectAll(".legend")
	  .data(['Target', 'Actual'])
		.enter().append("g")
	  .attr("class", "legend")
	  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
	  .attr("x", width + 75)
	  .attr("y", 90)
	  .attr("width", 18)
	  .attr("height", 18)
	  .style("fill", function(d, i) { return ['blue', 'yellow'][i]; });

	legend.append("text")
	  .attr("x", width + 65)
	  .attr("y", 105)
	  .attr("dy", ".35em")
	  .style("fill", "#fff")
	  .style("font-size", "10px")
	  .style("text-anchor", "end")
	  .text(function(d) { return d; });
	};


	d3.csv("../data/execution.csv", type, function(error, data) {
		if (error) throw error;
		$scope.CSV_Data = angular.copy(data);
		ActivityCompletionComplianceChart(data);
		CoachingActivityCompletion(data);
	});

	function type(d) {
	  return d;
	}
});
