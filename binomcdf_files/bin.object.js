//<!--XXXXXXXXXXXXXXXXXXXXXXXXXX-->
//<!--Copyright 2016 Matt Bognar-->
//<!--XXXXXXXXXXXXXXXXXXXXXXXXXXX-->

//<!--Written by:-->
//<!--Matt Bognar-->
//<!--Department of Statistics and Actuarial Science-->
//<!--University of Iowa-->
//<!--Iowa City, IA 52242-->
//<!--This software may not be re-distributed without the authors consent.-->


function binomialDistribution (n, p) 
{
	this.n=eval(n);
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
		return this.n*this.p;
	}


	function variance() 
	{
		return this.n*this.p*(1-this.p);
	}


	function sd() 
	{
		return Math.sqrt(this.variance());
	}


	function pmf(x) 
	{
		this.x = eval(x);
		return combination(this.n, this.x) * Math.pow(this.p, this.x) * Math.pow(1-this.p, this.n-this.x);
	}


	function cdf(x)
	{
		var i;
		var cdfval=0;

		for(i=0; i<=x; i++) {
			cdfval = cdfval + this.pmf(i);
		}

		if(x == this.n) {
			cdfval = 1;
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


	function plotPmf(x, type) 
	{
		x = eval(x);
		type = eval(type);

		var data = new google.visualization.DataTable();
		// Create the data table.
		data.addColumn('number', 'x');
		data.addColumn('number', 'P(X=x)');
		data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
		data.addColumn('number', 'P(X=x)');

		var xlo = 0;
		var xhi = this.n+1;
		if(this.n > 10) 
		{
			var xlo = Math.max(0, this.mean()-6*this.sd());
			var xhi = Math.min(this.n+1, this.mean()+6*this.sd());
		}

		data.addRows(this.n + 1);

		var i;
		for(i=0; i<(this.n+1); i++)
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
		var options =
		{
			backgroundColor:'transparent',
			hAxis: {title: 'x',  titleTextStyle: {color: '#000000'}, 
				gridlines: {color: 'transparent'},
				viewWindow: {min: xlo, max: xhi}},
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
		var chart = new google.visualization.ComboChart(document.getElementById('pdfPlot'));
		chart.draw(dataView, options);

	}
	

}


function wald_inference(n,x,alpha,p0,type) {

 	var i, mle = 0;

 	mle = x/n;
 	var wald_lo = mle-jStat.normal.inv(1-eval(alpha)/2,0,1)*Math.sqrt(mle*(1-mle)/n);
 	var wald_hi = mle+jStat.normal.inv(1-eval(alpha)/2,0,1)*Math.sqrt(mle*(1-mle)/n);
	if(wald_lo < 0) wald_lo = 0;
	if(wald_hi > 1) wald_hi = 1;

	txt = '(' + wald_lo.toFixed(5) + ', ' + 
		wald_hi.toFixed(5) + ')';
	document.getElementById("ci_output").innerHTML=txt;

	if(p0 != '') {
		var wald_z = (mle-p0)/Math.sqrt(mle*(1-mle)/n);
		txt = 'test statistic = ' + wald_z.toFixed(5);
		document.getElementById("test_stat").innerHTML=txt;

		norm = new normalDistribution(0,1);
	
		var wald_pvalue;
		if(type == 'neq') {
			wald_pvalue = jStat.normal.cdf(-Math.abs(wald_z),0,1)*2;
			norm.printPdf(wald_z,'twotail'); 
		}
		if(type == 'gt') {
			wald_pvalue = 1-jStat.normal.cdf(wald_z,0,1);
			norm.printPdf(wald_z,'greater'); 
		}
		if(type == 'lt') {
			wald_pvalue = jStat.normal.cdf(wald_z,0,1);
			norm.printPdf(wald_z,'less'); 
		}
		txt = 'p-value = ' + wald_pvalue.toFixed(5);
		document.getElementById("p_value").innerHTML=txt;
	}
	else {
		document.getElementById("test_stat").innerHTML='';
		document.getElementById("p_value").innerHTML='';	
	}

}


function score_inference(n,x,alpha,p0,type) {

	var phat = eval(x)/eval(n);
	var z1 = jStat.normal.inv(1-eval(alpha)/2,0,1);
	var z2 = Math.pow(jStat.normal.inv(eval(alpha)/2,0,1),2);
	var score_lo = (phat + z2/(2*eval(n)) - 
		z1 * Math.sqrt(((phat*(1-phat) + z2/(4*eval(n)))/eval(n)))) /
		(1+z2/eval(n));
	var score_hi = (phat + z2/(2*eval(n)) + 
		z1 * Math.sqrt(((phat*(1-phat) + z2/(4*eval(n)))/eval(n)))) /
		(1+z2/eval(n));
	if(score_lo < 0) score_lo = 0;
	if(score_hi > 1) score_hi = 1;

	txt = '(' + score_lo.toFixed(5) + ', ' + 
		score_hi.toFixed(5) + ')';
	document.getElementById("ci_output").innerHTML=txt;

	if(p0 != '') {
		var score_ts = (phat-p0)/Math.sqrt(p0*(1-p0)/n);
		txt = 'test statistic = ' + score_ts.toFixed(5);
		document.getElementById("test_stat").innerHTML=txt;

		norm = new normalDistribution(0,1);
	
		var score_pvalue;
		if(type == 'neq') {
			score_pvalue = jStat.normal.cdf(-Math.abs(score_ts),0,1)*2;
			norm.printPdf(score_ts,'twotail'); 
		}
		if(type == 'gt') {
			score_pvalue = 1-jStat.normal.cdf(score_ts,0,1);
			norm.printPdf(score_ts,'greater'); 
		}
		if(type == 'lt') {
			score_pvalue = jStat.normal.cdf(score_ts,0,1);
			norm.printPdf(score_ts,'less'); 
		}
		txt = 'p-value = ' + score_pvalue.toFixed(5);
		document.getElementById("p_value").innerHTML=txt;
	}
	else {
		document.getElementById("test_stat").innerHTML='';
		document.getElementById("p_value").innerHTML='';	
	}

}


function ac_inference(n,x,alpha,p0,type) {

	var n_tilde = eval(n) + Math.pow(jStat.normal.inv(1-eval(alpha)/2,0,1),2);
	var p_tilde = (eval(x) + Math.pow(jStat.normal.inv(1-eval(alpha)/2,0,1),2)/2) / n_tilde;

	var ac_lo = p_tilde - jStat.normal.inv(1-eval(alpha)/2,0,1) * 
		Math.sqrt(p_tilde * (1-p_tilde) / n_tilde);
	var ac_hi = p_tilde + jStat.normal.inv(1-eval(alpha)/2,0,1) * 
		Math.sqrt(p_tilde * (1-p_tilde) / n_tilde);
	if(ac_lo < 0) ac_lo = 0;
	if(ac_hi > 1) ac_hi = 1;

	txt = '(' + ac_lo.toFixed(5) + ', ' + 
		ac_hi.toFixed(5) + ')';
	document.getElementById("ci_output").innerHTML=txt;

	var ac_n = eval(n)+4;
	var ac_x = eval(x)+2;

	if(p0 != '') {
		var ac_ts = (p_tilde-p0)/Math.sqrt(p_tilde*(1-p_tilde)/n_tilde);
		txt = 'test statistic = ' + ac_ts.toFixed(5);
		document.getElementById("test_stat").innerHTML=txt;

		norm = new normalDistribution(0,1);
	
		var ac_pvalue;
		if(type == 'neq') {
			ac_pvalue = jStat.normal.cdf(-Math.abs(ac_ts),0,1)*2;
			norm.printPdf(ac_ts,'twotail'); 
		}
		if(type == 'gt') {
			ac_pvalue = 1-jStat.normal.cdf(ac_ts,0,1);
			norm.printPdf(ac_ts,'greater'); 
		}
		if(type == 'lt') {
			ac_pvalue = jStat.normal.cdf(ac_ts,0,1);
			norm.printPdf(ac_ts,'less'); 
		}
		txt = 'p-value = ' + ac_pvalue.toFixed(5);
		document.getElementById("p_value").innerHTML=txt;
	}
	else {
		document.getElementById("test_stat").innerHTML='';
		document.getElementById("p_value").innerHTML='';	
	}

}


function cp_inference(n,x,alpha,p0,type) {

	var cp_lo, cp_hi;
	
	if(eval(x) > 0) cp_lo = jStat.beta.inv(eval(alpha)/2,eval(x),eval(n-x)+1);
	else cp_lo = 0;
	
	if(eval(n-x) > 0) cp_hi = jStat.beta.inv(1-eval(alpha)/2,eval(x)+1,eval(n-x));
	else cp_hi = 1;
	
	txt = '(' + cp_lo.toFixed(5) + ', ' + 
		cp_hi.toFixed(5) + ')';
	document.getElementById("ci_output").innerHTML=txt;

	if(p0 != '') {
		document.getElementById("test_stat").innerHTML='';

		binom = new binomialDistribution(eval(n),eval(p0));
	
		var cp_pvalue;

		if(type == 'neq') {
			cp_pvalue = 2*Math.min(binom.cdf(eval(x)), 1-binom.cdf(eval(x-1)));
			binom.plotPmf(eval(x)); 
		}
		if(type == 'gt') {
			cp_pvalue = 1-binom.cdf(eval(x-1));
			binom.plotPmf(eval(x),2); 
		}
		if(type == 'lt') {
			cp_pvalue = binom.cdf(eval(x));
			binom.plotPmf(eval(x),1); 
		}

		txt = 'p-value = ' + cp_pvalue.toFixed(5);
		document.getElementById("p_value").innerHTML=txt;
	}
	else {
		document.getElementById("test_stat").innerHTML='';
		document.getElementById("p_value").innerHTML='';	
	}

}


function bl_lower(n,x,alpha,p0,type) {

	var tol = 1e-7;
	var maxiter = 100;
	var lower, upper, mid;
	var p1;
	var q1_cp;
	
    if (eval(x) <= 0) {
		return(0)
    }
	if (eval(x) > 0) {
		lower = jStat.beta.inv(eval(alpha)/2,eval(x),eval(n-x)+1);
		binom = new binomialDistribution(eval(n),lower);
        p1 = 1 - binom.cdf(x - 1);
        
        q1_cp = 0;
        while(binom.cdf(q1_cp) < p1) {
        	q1_cp = q1_cp + 1;
        }
		q1_cp = q1_cp - 1;
//         if(q1_cp > 0) q1_cp = q1_cp -1;
        
        txt = lower + "\n";
        txt += p1 + "\n";
        txt += q1_cp + "\n";
		
		upper = eval(x)/eval(n);

// 	 	document.getElementById("debug").innerHTML="matt";
		
		iter = 0;
		
		while(upper - lower >= tol) {
			iter = iter + 1;
			if(iter > maxiter) {
				// show warning
				break;
			}
			mid = (lower+upper)/2;
			binom = new binomialDistribution(eval(n),mid);
	        p1 = 1 - binom.cdf(x - 1);
			if (p1 >= binom.cdf(q1_cp + 1) || p1 + binom.cdf(q1_cp) > alpha) {
                upper = mid;
			}
			else {
				lower = mid;
			}
		}
		
		return(lower);
		
	}

//  	txt = lower + "\n";

}


function bl_inference(n,x,alpha,p0,type) {

// 	var tol = 1e-10;
// 	var maxiter = 100;
// 	var lower, upper, mid;
// 	var p1;
// 	var q1_cp;
// 	
//     if (eval(x) <= 0) {
// //         return(0)
//     }
// 
// 	if (eval(x) > 0) {
// 		lower = jStat.beta.inv(eval(alpha)/2,eval(x),eval(n-x)+1);
// 		binom = new binomialDistribution(eval(n),lower);
//         p1 = 1 - binom.cdf(x - 1);
//         
//         q1_cp = 0;
//         while(binom.cdf(q1_cp) <= p1) {
//         	q1_cp = q1_cp + 1;
//         }
//         if(q1_cp > 0) q1_cp = q1_cp -1;
//         
//         txt = lower + "\n";
//         txt += p1 + "\n";
//         txt += q1_cp + "\n";
// 		
// 		upper = eval(x)/eval(n);
// 		
// 		iter = 0;
// 		
// 		while(upper - lower >= tol) {
// 			iter = iter + 1;
// 			if(iter > maxiter) {
// 				// show warning
// 				break;
// 			}
// 			mid = (lower+upper)/2;
// 			binom = new binomialDistribution(eval(n),mid);
// 	        p1 = 1 - binom.cdf(x - 1);
// 			if (p1 >= binom.cdf(q1_cp + 1) || p1 + binom.cdf(q1_cp) > alpha) {
//                 upper = mid;
// 			}
// 			else {
// 				lower = mid;
// 			}
// 		}
// 		
// 		// return lower
// 		
// 	}

	var lower, upper;
	lower = bl_lower(n,x,alpha,p0,type);
	upper = 1-bl_lower(n,n-x,alpha,p0,type);
	txt = '(' + lower.toFixed(5) + ', ' + 
		upper.toFixed(5) + ')';
	document.getElementById("ci_output").innerHTML=txt;


// 	var cp_lo = jStat.beta.inv(eval(alpha)/2,eval(x),eval(n-x)+1);
// 	var cp_hi = jStat.beta.inv(1-eval(alpha)/2,eval(x)+1,eval(n-x));
// 	if(cp_lo < 0) cp_lo = 0;
// 	if(cp_hi > 1) cp_hi = 1;
// 
// 	txt = '(' + cp_lo.toFixed(5) + ', ' + 
// 		cp_hi.toFixed(5) + ')';
// 	document.getElementById("ci_output").innerHTML=txt;
// 
// 	if(p0 != '') {
//  		document.getElementById("test_stat").innerHTML='';
// 
// 		binom = new binomialDistribution(eval(n),eval(p0));
// 	
// 		var cp_pvalue;
// 
// 		if(type == 'neq') {
// 			cp_pvalue = 2*Math.min(binom.cdf(eval(x)), 1-binom.cdf(eval(x-1)));
// 			binom.plotPmf(eval(x)); 
// 		}
// 		if(type == 'gt') {
// 			cp_pvalue = 1-binom.cdf(eval(x-1));
// 			binom.plotPmf(eval(x),2); 
// 		}
// 		if(type == 'lt') {
// 			cp_pvalue = binom.cdf(eval(x));
// 			binom.plotPmf(eval(x),1); 
// 		}
// 
// 		txt = 'p-value = ' + cp_pvalue.toFixed(5);
// 		document.getElementById("p_value").innerHTML=txt;
// 	}
// 	else {
// 		document.getElementById("test_stat").innerHTML='';
// 		document.getElementById("p_value").innerHTML='';	
// 	}

}

