# Dissect Google Analytics

The aim of this project is simply to provide a simple javascript file to enable you to pass Google Analytics values from the first party cookie to a form, which can in turn pass through to your CRM for true marketing ROI. This is an adaptation of the script http://cutroni.com/blog/2009/03/18/updated-integrating-google-analytics-with-a-crm/ created by Justin Cutroni.

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
