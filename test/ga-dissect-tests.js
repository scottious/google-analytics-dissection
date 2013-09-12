var properties, originalEmpty;

function stubCookie(value) {
  GADissect.readCookie = function() {
    return value;
  }
}

QUnit.module("Dissect extracts", {
  setup: function() {
    stubCookie("__utmz=123456789.1234567890.1.1.utmccn=campaign|" +
         "utmcsr=referrer.example.com|" +
         "utmcct=/content|" + 
         "utmcmd=referral|" +
         "utmctr=keyword; " +
         "__utmv=87654321.segment; " +
         "__utma=111111111.2222222222.3333333333.4444444444.5555555555.12;");
    
    properties = GADissect.cookieProperties();
  }
});

test("the source property", function() {
  equal(properties.source, "referrer.example.com");
});

test("the medium property", function() {
  equal(properties.medium, "referral");
});

test("the term property", function() {
  equal(properties.term, "keyword");
});

test("the content property", function() {
  equal(properties.content, "/content");
});

test("the campaign property", function() {
  equal(properties.campaign, "campaign");
});

test("the numVisits property", function() {
  equal(properties.numVisits, 12);
});

test("the customSegment property", function() {
  equal(properties.customSegment, 'segment');
});

test("the uniqueVisitorID property", function() {
  equal(properties.uniqueVisitorID, '111111111.2222222222.3333333333.4444444444.5555555555');
});


QUnit.module("Custom segment");

test("ignores custom variables", function() {
  stubCookie("__utmv=1.|1=Visitor%20Class=user=1;");
  equal(GADissect.cookieProperties().customSegment, "");
});


QUnit.module("With AdWords present", {
  setup: function() {
    stubCookie("__utmz=123456789.1234567890.1.1.utmccn=campaign|" +
             "utmcsr=referrer.example.com|" +
             "utmcmd=referral|" +
             "utmgclid=AbCdEfGhIjKlMnOpQrStUvWxYz;");
  
    properties = GADissect.cookieProperties();
  }
});

test("source is set to 'google'", function() {
  equal(properties.source, "google");
})

test("medium is set to 'cpc'", function() {
  equal(properties.medium, "cpc");
});


QUnit.module("With missing properties", {
  setup: function() {
    stubCookie("__utmz=123456789.1234567890.1.1.utmccn=campaign|utmcsr=referrer.example.com|utmcmd=referral;");
  }
});

test("returns an empty string by default", function() {
  equal(GADissect.cookieProperties().content, "");
});

test("returns 0 for numVisits", function() {
  equal(GADissect.cookieProperties().numVisits, 0);
});


QUnit.module("With a custom empty value", {
  setup: function() {
    originalEmpty = GADissect.emptyValue;
    GADissect.emptyValue = "empty";
  },
  teardown: function() {
    GADissect.emptyValue = originalEmpty;
  }
})

test("returns the custom empty value", function() {
  stubCookie("__utmz=123456789.1234567890.1.1.utmccn=campaign|utmcsr=referrer.example.com|utmcmd=referral;");
  equal(GADissect.cookieProperties().customSegment, "empty");
});