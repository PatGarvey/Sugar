
var path = window.location.href.replace(/^https?:\/\/[^\/]+\//i, "").replace(/\/$/, "");
var edition = "Ultimate";
var version = "7.6";

	
if( path == "Documentation"){
  $(".content-heading").append(editionVersions());
	var url = "/Documentation/Sugar_Versions/"+version+"/"+Utils.getAbbreviatedEdition(edition)+"/";
	// loadEditionVersion(url);




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
	$( ".content-children" ).load( url + " .content-body", function() {
  		// Utils.transformTableToDivs();
   	});
}

//Load Editions & Versions from API
var addVersions = function(parent){
  $.getJSON( "http://scarlett.sugarcrm.com/public/index.php/api/v1/versions", function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
      items.push( '<button type="button" class="btn btn-default active">' + val + "</button>" );
    });
   
    var div = $( "<div />", {
      "class": "btn-group btn-group-sm",
      "role":"groupEdition",
      "id":"groupVersion",
      html: items.join( "" )
    }).appendTo(parent);

    return div;
  });
}

var createButtons = function(data){
  var div = document.createElement('div');
  $.each(data, function( index, value ) {
    // alert( index + ": " +  );
    $(div).append('<button type="button" class="btn btn-default active">'+value+'</button>');
  });
  

}
var versions = $('<section class="active-filters"><div></div></section>');
$(".content-body").html("");
$(".content-body").append(versions);
addVersions(versions);


// var editionVersions = '<section class="active-filters">'+
//      '<div>'+
//       '   <label>Edition:</label>'+
//       '   <div class="btn-group btn-group-sm" role="groupEdition" id="groupEdition">'+
//       '     <button type="button" class="btn btn-default active">Ultimate</button>'+
//       '    	<button type="button" class="btn btn-default">Enterprise</button>'+
//       '     <button type="button" class="btn btn-default">Corporate</button>'+
//       '     <button type="button" class="btn btn-default">Professional</button>'+
//       '     <button type="button" class="btn btn-default">Community Edition</button>'+
//       '   </div>'+
//       '   &nbsp;'+
//       '   <label>Version:</label>'+
//       '   <div class="btn-group btn-group-sm" role="groupVersion" id="groupVersion">'+
//       '     <button type="button" class="btn btn-default active">7.6</button>'+
//       '     <button type="button" class="btn btn-default">7.5</button>'+
//       '     <button type="button" class="btn btn-default">6.7</button>'+
//       '     <button type="button" class="btn btn-default">6.5</button>'+
//       '   </div>'+
//      '</div>  '+
//    '</section>';
