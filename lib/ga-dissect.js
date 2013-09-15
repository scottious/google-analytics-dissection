GADissect = {
  // Value to return when a property is empty
  emptyValue: "",
  
  // You can read more about how the GA cookie works at
  // https://developers.google.com/analytics/resources/concepts/gaConceptsCookies
  readCookie: function() {
    return document.cookie;
  },
  
  cookieProperties: function() {
    var cookie = this.readCookie();
    var properties = {};
    
    // Get the __utmz cookie value. This stores all campaign information.
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
    
    // Separate the campaign-tracking cookie into each piece of campaign info.
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
    if (gclid !== this.emptyValue) {
      source = 'google';
      medium = 'cpc';
    }
    
    // Custom segmentation.
    var customVarCookie = this.parseCookieFragment(cookie, '__utmv=', ';');
    var customSegment   = this.emptyValue;
    
    if (customVarCookie !== this.emptyValue) {
      // Match the segment format (e.g. "1234.segment"), while ignoring custom
      // vars (e.g. "1.|1=Visitor Class=user=1").
      var match = customVarCookie.match(/[1-9]*?\.([^|]*)/);
      
      // If we have a non-empty match...
      if(match && match[1] && match[1] !== "") {
        // Set the custom segment to the match
        customSegment = match[1];
      }
    }
    
    // Extract the number of visits
    var uniqueVisitorCookie = this.parseCookieFragment(cookie, '__utma=', ';');
    var uniqueCookieChunks  = uniqueVisitorCookie.split('.');
    var numVisits = parseInt(uniqueCookieChunks[5], 10) || 0;
    
    // Set the properties
    properties.source    = source;
    properties.medium    = medium;
    properties.term      = term;
    properties.content   = content;
    properties.campaign  = campaign;
    properties.customSegment = customSegment;
    properties.numVisits = numVisits;
    properties.uniqueVisitorID = uniqueCookieChunks.slice(0, 3).join('.');
    properties.crossDomainVisitorID = uniqueCookieChunks[1];
    
    return properties;
  },
  
  // Given a cookie fragment, it extracts the string marked by the
  // startString and endString. If no match was found, returns the
  // emptyValue. This function was adapted from urchin.js.
  parseCookieFragment: function(fragment, startString, endString) {
    // Check all parameters are set and not empty strings
    if (!fragment || fragment === "" || !startString || startString === "" || !endString || endString === "") {
      return this.emptyValue;
    }
    
    var substring = this.emptyValue;
    var startIndex = fragment.indexOf(startString);
    var assignmentIndex = startString.indexOf("=") + 1;
    
    // If the startString has been found...
    if (startIndex > -1) {
      var endIndex = fragment.indexOf(endString, startIndex);
      // ...and the endString has been found
      if (endIndex < 0) {
        endIndex = fragment.length; 
      }
      
      substring = decodeURIComponent(fragment.substring((startIndex + assignmentIndex), endIndex));
    }
    
    return substring;
  }
};