var GADissect = {
  // You can read more about how the GA cookie works at
  // https://developers.google.com/analytics/resources/concepts/gaConceptsCookies
  readCookie: function() {
    return document.cookie;
  },
  
  cookieProperties: function() {
    var cookie = this.readCookie();
    var properties = {};
    
    // Get the __utmz cookie value. This is the cookies that
    // stores all campaign information.
    var referralCookie = this.parseCookieFragment(cookie, '__utmz=', ';');
    
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
    var source   = this.parseCookieFragment(referralCookie, 'utmcsr=', '|');
    var medium   = this.parseCookieFragment(referralCookie, 'utmcmd=', '|');
    var term     = this.parseCookieFragment(referralCookie, 'utmctr=', '|');
    var content  = this.parseCookieFragment(referralCookie, 'utmcct=', '|');
    var campaign = this.parseCookieFragment(referralCookie, 'utmccn=', '|');
    var gclid    = this.parseCookieFragment(referralCookie, 'utmgclid=', '|');
    
    // The gclid is ONLY present when auto tagging has been enabled.
    // All other variables, except the term variable, will be '(not set)'.
    // Because the gclid is only present for Google AdWords we can
    // populate some other variables that would normally
    // be left blank.
    if (gclid !="-") {
      source = 'google';
      medium = 'cpc';
    }
    
    // Data from the custom segmentation cookie can also be passed
    // back to your server via a hidden form field
    var csegment = this.parseCookieFragment(cookie, '__utmv=', ';');
    if (csegment != "-") {
      var csegmentex = /[1-9]*?\.([^|]*)/;
      csegment = csegment.match(csegmentex);
      csegment = csegment[1];
    } else {
      csegment = "";
    }
    
    // One more bonus piece of information.  
    // We're going to extract the number of visits that the visitor
    // has generated.  It's also stored in a cookie, the __utma cookis
    var a = this.parseCookieFragment(cookie, '__utma=', ';');
    var aParts = a.split(".");
    var numVisits = parseInt(aParts[5], 10);
    
    properties.source    = source;
    properties.medium    = medium;
    properties.term      = term;
    properties.content   = content;
    properties.campaign  = campaign;
    properties.customSegment  = csegment;
    properties.numVisits = numVisits;
    
    return properties;
  },
  
  // This function parses the cookie fragment -- it was borrowed from urchin.js
  // TODO: humanize
  parseCookieFragment: function(l, n, s) {
    if (!l || l === "" || !n || n === "" || !s || s === "") return "-";
      var i,i2,i3,c="-";
      i=l.indexOf(n);
      i3=n.indexOf("=")+1;
    if (i > -1) {
      i2=l.indexOf(s,i); if (i2 < 0) { i2=l.length; }
      c=l.substring((i+i3),i2);
    }
    return decodeURIComponent(c);
  }
};