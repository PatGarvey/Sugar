
var path = window.location.href.replace(/^https?:\/\/[^\/]+\//i, "").replace(/\/$/, "");
var edition = "Ultimate";
var version = "7.6";


$(document).ready(function () {
  // body...


  if( path == "Documentation"){
    // $(".content-heading").append(editionVersions());
    var url = "/Documentation/Sugar_Versions/"+version+"/"+Utils.getAbbreviatedEdition(edition)+"/";
	// loadEditionVersion(url);

  }
  if(path.split("/").length == 4)
    Utils.transformTableToDivs();   
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

function loadEditionVersion(version, edition){
	// $( ".content-children" ).load( url + " .content-body", function() {
  		// Utils.transformTableToDivs();
    // });

$(".content-children").html("");


  $.getJSON("http://scarlett.sugarcrm.com/public/index.php/api/v1/documentation?version="+version+"&edition="+edition, function(data){
    var cols = [];
    $.each( data, function( key, val ) {
      var items = [];
      $.each(val, function( key, val){
        items.push("<li><a href="+val+">"+key+"</a></li>");
      });
      var ul = $("<ul />", {
        "class":"plain-list",
        html : items.join("")
      });
      cols.push( '<div class="col-sm-6 col-md-3 content-col"><h2>'+key+'</h2>'+ul.html()+'</div>' );
    });

    var div = $( "<div />", {
      "class": "row",
      "id":"columns",
      html: cols.join( "" )
    }).appendTo($(".content-children"));
    // <div class="col-sm-6 col-md-3 content-col">
    //                       <h2>User Guides</h2>
    //                       <ul class="plain-list">
    //                         <li><a href="">Application</a></li>
    //                         <li><a href="">Application Guide Portal</a></li>
    //                         <li><a href="">Portal User Guide Plug-ins</a></li>
    //                         <li><a href="">Plug-ins Documentation Mobile</a></li>
    //                         <li><a href="">SugarCRM Mobile</a></li>
    //                       </ul>
    //                     </div>
  });
}

//Load Editions & Versions from API
var addVersions = function(parent){
  $.getJSON( "http://scarlett.sugarcrm.com/public/index.php/api/v1/versions", function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
      items.push( '<button type="button" class="btn btn-default">' + val + "</button>" );
    });

    var div = $( "<div />", {
      "class": "btn-group btn-group-sm",
      "role":"groupVersion",
      "id":"groupVersion",
      html: items.join( "" )
    }).appendTo(parent);

    // if(window.location.href.indexOf("Documentation/Sugar_Versions/")>-1){
    //Version Button Bar CLICK
    $("#groupVersion > .btn").click(function(){
      if($(this).hasClass("disabled"))
        return;
      version = $(this).html();
      $("#editionTitle").html(version+" "+edition);
        getEditions(parent, version);
    });

    return div;
  });
}

var getEditions = function(parent, version){
   $.getJSON( "http://scarlett.sugarcrm.com/public/index.php/api/v1/editions/"+version, function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
          items.push( '<button type="button" class="btn btn-default">' + val + "</button>" );
        });

        var div = $( "<div />", {
          "class": "btn-group btn-group-sm",
          "role":"groupEdition",
          "id":"groupEdition",
          html: items.join( "" )
        }).appendTo(parent);

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
           var url = "/Documentation/Sugar_Versions/"+version+"/"+Utils.getAbbreviatedEdition(edition)+"/";
           loadEditionVersion(version, edition);
        });

      });
}


var versions = $('<section class="active-filters"><div><label>Edition:</label></div></section><div class="content-children"></div>');
$(".content-body").html("");
$(".content-body").append(versions);
addVersions($(".active-filters > div"));


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
