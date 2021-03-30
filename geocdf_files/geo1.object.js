//<!--XXXXXXXXXXXXXXXXXXXXXXXXXX-->
//<!--Copyright 2016 Matt Bognar-->
//<!--XXXXXXXXXXXXXXXXXXXXXXXXXXX-->

//<!--Written by:-->
//<!--Matt Bognar-->
//<!--Department of Statistics and Actuarial Science-->
//<!--University of Iowa-->
//<!--Iowa City, IA 52242-->
//<!--This software may not be re-distributed without the authors consent.-->


function geometricDistribution (p) 
{
	this.p=eval(p);
	this.mean=mean;
	this.variance=variance;
	this.sd=sd;
	this.pmf=pmf;
	this.cdf=cdf;
	this.printMoments=printMoments;
	this.plotPmf=plotPmf;


	function mean() 
	{
		return (1-this.p)/this.p;
	}


	function variance() 
	{
		return (1-this.p)/Math.pow(this.p,2);
	}


	function sd()
	{
		return Math.sqrt(this.variance());
	}


	function pmf(x) 
	{
		return Math.pow(1-this.p,x) * this.p;
	}


	function cdf(x)
	{
		var i;
		var cdfval=0;

		for(i=0; i<=x; i++) {
			cdfval = cdfval + this.pmf(i);
		}

		return cdfval;
	}


	function printMoments() 
	{
		var txt="";

		txt += '$ \\mu = E(X) = ' + roundNumber(this.mean(),3) + '\\hspace{0.5cm}$';
		txt += '$ \\sigma = SD(X) = ' + roundNumber(this.sd(),3) + '\\hspace{0.5cm}$';
		txt += '$ \\sigma^2 = Var(X) = ' + roundNumber(this.variance(),3) + '$';

		document.getElementById("moments").innerHTML=txt; 
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,"moments"]); 
	}


	function plotPmf(x,type) 
	{
		x = eval(x);
		type = eval(type);

		var data = new google.visualization.DataTable();

		// Create the data table.
		data.addColumn('number', 'x');
		data.addColumn('number', 'P(X=x)');
		data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
		data.addColumn('number', 'P(X=x)');

		var lo = Math.max(0, this.mean() - 5*this.sd());
		var hi = Math.ceil(this.mean() + 5*this.sd());
		if(hi-lo < 4) hi = lo+4;

		var mywidth = 350;
		if(hi-lo>100) mywidth = 350 + 3*(hi-lo-100);

		data.addRows(Math.ceil(hi-lo+100));

		var i;
		for(i=0; i<=hi; i++)
		{
			data.setCell(i, 0, i);
			data.setCell(i, 1, roundNumber(this.pmf(i),5));
			data.setCell(i, 2, 'P(X=' + i + ') = ' + data.getValue(i, 1));

			if(type == 0) {
				if(i == x) {
					data.setCell(i, 1, 0);
					data.setCell(i, 3, roundNumber(this.pmf(i),5));
				}
			}
			if(type == 1) {
				if(i <= x) {
					data.setCell(i, 1, 0);
					data.setCell(i, 3, roundNumber(this.pmf(i),5));
				}
			}
			if(type == 2) {
				if(i >= x) {
					data.setCell(i, 1, 0);
					data.setCell(i, 3, roundNumber(this.pmf(i),5));
				}
			}
		}

		var dataView = new google.visualization.DataView(data);
		dataView.setColumns([{calc: function(data, row) { 
			return data.getFormattedValue(row, 0); }, type:'string'}, 1, 2, 3]);

		// Set chart options
		var options = {
			backgroundColor: 'transparent',
			hAxis: {title: 'x',  titleTextStyle: {color: '#000000'}, 
				gridlines: {color: '#FFF'}, 
				viewWindow: {min: lo, max: hi},
				viewWindowMode: 'explicit',
				gridlines: {color: 'transparent'},
				baseline: -0.5},
			vAxis: {title: 'P(X=x)',  titleTextStyle: {color: '#000000'}, 
				gridlines: {count: 5, color: 'transparent'},
				viewWindow: {min: 0},
				viewWindowMode: 'explicit'},
			legend: {position: 'none'},
			seriesType: "bars",
			isStacked: true,
			colors:['#6687e7','#ca8d8d'],
		};

		// Instantiate and draw our chart, passing in some options.
		var chart = new google.visualization.ComboChart(document.getElementById('pmfPlot'));
		chart.draw(dataView, options);

	}

}

