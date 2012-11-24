function _uGC(l,n,s) {
	if (!l || l=="" || !n || n=="" || !s || s=="") return "-";
		var i,i2,i3,c="-";
		i=l.indexOf(n);
		i3=n.indexOf("=")+1;
	if (i > -1) {
		i2=l.indexOf(s,i); if (i2 < 0) { i2=l.length; }
		c=l.substring((i+i3),i2);
	}
	return c;
}

function populateHiddenFields() {

	var analyticsData = getAnalyticsData();
	
	$('#wsource').val(analyticsData['source']);
	$('#wmedium').val(analyticsData['medium']);
	$('#wterm').val(analyticsData['term']);
	$('#wcontent').val(analyticsData['content']);
	$('#wcampaign').val(analyticsData['campaign']);
	$('#wsegment').val(analyticsData['csegment']);
	$('#wnumvisits').val(analyticsData['numvisits']);
	return true;
}

function getAnalyticsData() {
	// Get the __utmz cookie value. This is the cookies that
	// stores all campaign information.
	//
	var z = _uGC(document.cookie, '__utmz=', ';');
	//
	// The cookie has a number of name-value pairs.
	// Each identifies an aspect of the campaign.
	//
	// utmcsr  = campaign source
	// utmcmd  = campaign medium
	// utmctr  = campaign term (keyword)
	// utmcct  = campaign content (used for A/B testing)
	// utmccn  = campaign name
	// utmgclid = unique identifier used when AdWords auto tagging is enabled
	//
	// This is very basic code. It separates the campaign-tracking cookie
	// and populates a variable with each piece of campaign info.
	//
	var source  = _uGC(z, 'utmcsr=', '|');
	var medium  = _uGC(z, 'utmcmd=', '|');
	var term    = _uGC(z, 'utmctr=', '|');
	var content = _uGC(z, 'utmcct=', '|');
	var campaign = _uGC(z, 'utmccn=', '|');
	var gclid   = _uGC(z, 'utmgclid=', '|');
	//
	// The gclid is ONLY present when auto tagging has been enabled.
	// All other variables, except the term variable, will be '(not set)'.
	// Because the gclid is only present for Google AdWords we can
	// populate some other variables that would normally
	// be left blank.
	//
	if (gclid !="-") {
		source = 'google';
		medium = 'cpc';
	}
	// Data from the custom segmentation cookie can also be passed
	// back to your server via a hidden form field
	var csegment = _uGC(document.cookie, '__utmv=', ';');
	if (csegment != '-') {
		var csegmentex = /[1-9]*?\.(.*)/;
		csegment    = csegment.match(csegmentex);
		csegment    = csegment[1];
	} else {
		csegment = '';
	}
	
	//
	// One more bonus piece of information.  
	// We're going to extract the number of visits that the visitor
	// has generated.  It's also stored in a cookie, the __utma cookis
	// 
	var a = _uGC(document.cookie, '__utma=', ';');
	var aParts = a.split(".");
	var numvisits = aParts[5];
	
	
	
	var analyticsData = new Object();
	analyticsData['source'] = source;
	analyticsData['medium'] = medium;
	analyticsData['term'] = term;
	analyticsData['content'] = content;
	analyticsData['campaign'] = campaign;
	analyticsData['csegment'] = csegment;
	analyticsData['numvisits'] = numvisits;
	
	return analyticsData;
}