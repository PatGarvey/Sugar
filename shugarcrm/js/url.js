var BASE_URL = "http://scarlett.sugarcrm.com/Sugar/shugarcrm/";

$(document).ready(function () {

	//Change SEARCH FORM ACTION - HEADER
	$("section.filters form").change(function() {
	  var action = $(this).val();
	});
	$("section.filters form").attr("action", "/search/");

	//Select ULTIMATE RIGHT AWAY - HEADER
	$("#searchForm select[name='tag1']").selectpicker('val', 'Ultimate');

	var url = window.location.href.replace("http://", "").replace("https://", "");
	var path = window.location.href.replace(/^https?:\/\/[^\/]+\//i, "").replace(/\/$/, "");

	//Documentation PAGES
	if(path.indexOf("Documentation/Sugar_Versions") > -1){
		//SUGAR VERSIONS controller 
		loadScript(BASE_URL+"js/sugar-versions-controller.js");
	}else{
		//INDEX PAGE - load external script
		loadScript(BASE_URL+"js/index-controller.js");
	}
});

function loadEditionVersion(url){
	$( ".content-body" ).load( url + " .content-body", function() {
  		Utils.transformTableToDivs();
   	});
}

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

var editionVersions = '<section class="active-filters">'+
     '<div>'+
      '   <label>Edition:</label>'+
      '   <div class="btn-group btn-group-sm" role="groupEdition" id="groupEdition">'+
      '     <button type="button" class="btn btn-default active">Ultimate</button>'+
      '    	<button type="button" class="btn btn-default">Enterprise</button>'+
      '     <button type="button" class="btn btn-default">Corporate</button>'+
      '     <button type="button" class="btn btn-default">Professional</button>'+
      '     <button type="button" class="btn btn-default">Community Edition</button>'+
      '   </div>'+
      '   &nbsp;'+
      '   <label>Version:</label>'+
      '   <div class="btn-group btn-group-sm" role="groupVersion" id="groupVersion">'+
      '     <button type="button" class="btn btn-default active">7.6</button>'+
      '     <button type="button" class="btn btn-default">7.5</button>'+
      '     <button type="button" class="btn btn-default">6.7</button>'+
      '     <button type="button" class="btn btn-default">6.5</button>'+
      '   </div>'+
     '</div>  '+
   '</section>';

var indexTemplate ='<div class="tabs" id="indexTabs"><h1></h1><ul class="nav nav-tabs"> '+            
'</ul>         </div><div class="tab-content"></div> ';

