
var path = window.location.href.replace(/^https?:\/\/[^\/]+\//i, "").replace(/\/$/, "");
var edition = "Ultimate";
var version = "7.6";

if( path == "Documentation/Sugar_Versions"){
	$(".content-heading").append(editionVersions);
	var url = "/Documentation/Sugar_Versions/"+version+"/"+Utils.getAbbreviatedEdition(edition)+"/";
	loadEditionVersion(url);

}
if(path.split("/").length == 4)
	Utils.transformTableToDivs();		


//Edition Button Bar CLICK
$("#groupEdition > .btn").click(function(){
    edition = $(this).html();
    if(edition == "Community Edition"){
    	version = "6.5";
    	$("#groupVersion > .btn").removeClass("active");
    	$("#groupVersion button:nth-child(4)").addClass("active").siblings().addClass("disabled");
    }else{
    	$("#groupVersion > .btn").removeClass("disabled");
    }

    $("#editionTitle").html(version+" "+edition);
});


// if(window.location.href.indexOf("Documentation/Sugar_Versions/")>-1){
//Version Button Bar CLICK
$("#groupVersion > .btn").click(function(){
	if($(this).hasClass("disabled"))
		return;
    version = $(this).html();
    $("#editionTitle").html(version+" "+edition);
});
//Button Bar CLICK - ALL
$(".btn-group > .btn").click(function(){
	if($(this).hasClass("disabled"))
		return;
    $(this).addClass("active").siblings().removeClass("active");
    $("#okButton").addClass("btn-primary");

    //Only for demo
    $("#sugar-on-ultimate .row").toggleClass("hidden");

    //AJAX call to get site
    var url = "/Documentation/Sugar_Versions/"+version+"/"+Utils.getAbbreviatedEdition(edition)+"/";
    loadEditionVersion(url);
});

function loadEditionVersion(url){
	$( ".content-body" ).load( url + " .content-body", function() {
  		Utils.transformTableToDivs();
   	});
}
