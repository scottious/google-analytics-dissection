# Google Analytics Cookie Reader

The cookie Google Analytics creates for a visitor on your site contains lots of interesting information, such as the number of visits the visitor has made in the past and the search term used to reach the site.

This lightweight JavaScript library has been designed to help you parse the values of the cookie for your own use elsewhere.

For instance, you might want to change the page to emphasize pork goods based on the fact that the user reached you by searching for the term “bacon”:

```javascript
var analyticsInfo = GADissect.cookieProperties();

if(analyticsInfo.term.match("bacon")) {
  alert('We have some great bacon deals for you!');
}
```

Or perhaps you want to report to another service the number of visits this user has made:

```javascript
var analyticsInfo = GADissect.cookieProperties();

reportingAgent.send("Visitor " + analyticsInfo.crossDomainVisitorID +
                    " is browsing on the site for the " +
                    analyticsInfo.numVisits + " time");
```

It's also very simple to send along these values in a form (see below).

This was originally adaptated from the example created by Justin Cutroni in his blog post [Integrating Google Analytics with a CRM](http://cutroni.com/blog/2009/03/18/updated-integrating-google-analytics-with-a-crm/).

## Google Analytics Support

GADissect works by reading the page's cookie and extracting the values.  Only `ga.js` (Classic Analytics) provides this information in the cookie. The newer Universal Analytics (`analytics.js`) doesn't provide the information we need within the cookie.

Both Universal Analytics and Classic Analytics can be used at the same time on a website, although they would have to report to different Website Properties.

## Usage

Download [lib/ga-dissect.min.js](lib/ga-dissect.min.js?raw=true) and add it to your page:

```html
<script src="ga-dissect.min.js" type="text/javascript"></script>
```

Use `GADissect.cookieProperties()` to read the cookie. Make sure to call this after `ga.js` has loaded, as `ga.js` will make changes to the cookie.

```javascript
var properties = GADissect.cookieProperties();
alert(properties.source); // Will alert the "source" Google Analytics tracks
```

The `properties` object will return a set of properties tracked by Google Analytics:

* `source` -- Referral source (e.g. `(direct)`, `google`, `referrer.example.com`)
* `medium` -- Referral medium (e.g. `cpc`, `(not set)`)
* `term` -- The search term (e.g. `new shoes`)
* `content` -- Used for A/B testing and content-targeted ads (e.g. `linktext`)
* `campaign` -- Name of the campaign (e.g. `spring_sale`)
* `customSegment` -- Segment information, if available (e.g. `shoes_ad_customers`)
* `numVisits` -- The number of visits to this site (e.g. `5`)
* `uniqueVisitorID` -- A unique visitor identifier, tracked across multiple sessions, scoped to a domain (e.g. `111111111.2222222222.3333333333`)
* `crossDomainVisitorID` -- The unqiue visitor identifier tracked across multiple domains and sessions (e.g. `3203602615`)

## Passing values into a form

If you want to inject the values into a form, start by adding the fields:

```html
<input type="hidden" name="source" id="ga-source">
<input type="hidden" name="medium" id="ga-medium">
<input type="hidden" name="term" id="ga-term">
...etc..
```

Using jQuery, you could add the values like this:

```javascript
$(document).ready(function() {
  var gaTracking = GADissect.cookieProperties();
  $('#ga-source').val(gaTracking.source);
  $('#ga-medium').val(gaTracking.medium);
  $('#ga-term').val(gaTracking.term);
  // ...etc..
});
```

Or, using plain JavaScript:

```javascript
// Add this once GA has loaded
var gaTracking = GADissect.cookieProperties();
document.getElementByID('ga-source').value = gaTracking.source;
document.getElementByID('ga-medium').value = gaTracking.source;
document.getElementByID('ga-term').value   = gaTracking.term;
// ...etc...
```

## Development

Install [Node.js](http://nodejs.org/), `cd` into the cloned repository and run:

    $ npm install

Run tests by opening `test/runner.html`, or from the command line:

    $ npm test

Minify JavaScript with:

    $ uglifyjs ./lib/ga-dissect.js > ./lib/ga-dissect.min.js
