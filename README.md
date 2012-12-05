# Dissect Google Analytics

The aim of this project is simply to provide a simple javascript file to enable you to pass Google Analytics values from the first party cookie to a form, which can in turn pass through to your CRM for true marketing ROI. This is an adaptation of the http://cutroni.com/blog/2009/03/18/updated-integrating-google-analytics-with-a-crm/ created by Justin Cutroni

## Usage

The script uses the ID of the field to set the value.
So, add the following fields to your form:

    <input type="hidden" name="source" id="wsource">
    <input type="hidden" name="medium" id="wmedium">
    <input type="hidden" name="term" id="wterm">
    <input type="hidden" name="content" id="wcontent">
    <input type="hidden" name="campaign" id="wcampaign">
    <input type="hidden" name="segment" id="wsegment">
    <input type="hidden" name="numvisits" id="wnumvisits">

Include the dissectsfdcga.js javascript file.

    <script src="dissectsfdcga.js"></script>
		
Call the populateHiddenFields(); function after the DOM has settled.

jQuery version:

    <script>
    $(document).ready(function() {
      populateHiddenFields();
    });
    </script>
    
or regular javascript:

    <script>
    window.onload=populateHiddenFields();
    </script>

# Plans - TODO

- Rewrite the javascript to abstract functions into a class to reduce the possibility of conflicts
- Use Juicer as a javascript minimizer/compressor

