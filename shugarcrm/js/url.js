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
	if(path.indexOf("Documentation") > -1){
		//SUGAR VERSIONS controller 
		loadScript(BASE_URL+"js/sugar-versions-controller.js");
	}else if(path.indexOf("Get_Started") > -1){
		//INDEX PAGE - load external script
		loadScript(BASE_URL+"js/index-controller.js");
	}
});

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

