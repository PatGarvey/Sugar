var path = window.location.href.replace(/^https?:\/\/[^\/]+\//i, "").replace(/\/$/, "");
var edition = "";
var version = "";

//Button Bar CLICK - ALL
$(".btn-group > .btn").click(function() {
  if ($(this).hasClass("disabled"))
    return;
  $(this).addClass("active").siblings().removeClass("active");
  $("#okButton").addClass("btn-primary");

  //Only for demo
  $("#sugar-on-ultimate .row").toggleClass("hidden");

});

function loadEditionVersion(version, edition) {

  // $(".content-section").html("");
  // $(".content-section").addClass('faded');

  $.getJSON("http://scarlett.sugarcrm.com/public/index.php/api/v1/documentation?version=" + version + "&edition=" + Utils.getAbbreviatedEdition(edition), function(data) {
    var cols = [];
    var index = 0;
    $.each(data, function(key, val) {
      var items = [];
      $.each(val, function(key, val) {
        if (val.lastIndexOf("/") == val.length - 1)
          val = val.substring(0, val.length - 1);
        items.push("<li><a href=" + val + ">" + key + "</a></li>");
      });
      var ul = $("<ul />", {
        "class": "plain-list",
        html: items.join("")
      });

      var holder = $('<div>').append(ul);
      switch(key){
        case 'User Guides'           : index = 0; break;
        case 'Administrator Guides'  : index = 1; break;
        case 'Developer Guides'      : index = 2; break;
        case 'Release Notes'         : index = 3; break;
        case 'Other'                 : index = 4; break;
      }
      // cols.push('<div class="col-sm-6 col-md-3 content-col"><h2>' + key + '</h2>' + holder.html() + '</div>');
      cols[index]= '<div class="col-sm-6 col-md-3 content-col"><h2>' + key + '</h2>' + holder.html() + '</div>';
    });

    $(".content-section").html("");
    // $(".content-section").removeClass('faded');
    var div = $("<div />", {
      "class": "row",
      "id": "columns",
      html: cols.join("")
    }).appendTo($(".content-section"));
    // <div class="col-sm-6 col-md-3 content-col">
    //                       <h2>User Guides</h2>
    //                       <ul class="plain-list">
    //                         <li><a href="">Application</a></li>
    //                         <li><a href="">SugarCRM Mobile</a></li>
    //                       </ul>
    //                     </div>
  });
}

//Load Editions & Versions from API
var addVersions = function(parent) {
  $.getJSON("http://scarlett.sugarcrm.com/public/index.php/api/v1/versions", function(data) {
    var items = [];
    $.each(data, function(key, val) {
      items.push('<button type="button" class="btn btn-default">' + val + "</button>");
    });

    var div = $("<div />", {
      "class": "btn-group btn-group-sm",
      "role": "groupVersion",
      "id": "groupVersion",
      html: items.join("")
    }).appendTo(parent);

    //Version Button Bar CLICK
    $("#groupVersion > .btn").click(function() {
      if ($(this).hasClass("disabled"))
        return;
      $(this).addClass("active").siblings().removeClass("active");
      version = $(this).html();
      edition = "";
      $("#editionTitle").html(version + " " + edition);
      getEditions(parent, version);
    });


    if(window.localStorage){
        version = window.localStorage.getItem("version");      
        edition = window.localStorage.getItem("edition");      
    }

    //Auto Select first
    if (version == "") {
      $("#groupVersion > .btn:nth-child(1)").click();
    }else{
       $("#groupVersion > .btn").each(function () {
          if(version.toLowerCase() == this.innerHTML.toLowerCase()){
            this.click();
          }
        });
    }

    return div;
  });
}

var getEditions = function(parent, version) {
  $.getJSON("http://scarlett.sugarcrm.com/public/index.php/api/v1/editions/" + version, function(data) {
    var items = [];
    $.each(data, function(key, val) {
      items.push('<button type="button" class="btn btn-default">' + val + "</button>");
    });

    var div = $("#groupEdition");
    if (div.length == 0) {
      var div = $("<div class='col-xs-12 col-md-8'></div>").appendTo(parent.parent());
      var label = $("<span class='m-r-xs'>Edition:</span>").appendTo(div);

      div = $("<div />", {
        "class": "btn-group btn-group-sm",
        "role": "groupEdition",
        "id": "groupEdition",
        html: items.join("")
      }).appendTo(div);
    } else {
      //replace buttons
      $("#groupEdition > button").remove();
      $("#groupEdition").append(items.join(""));

    }

    //Edition Button Bar CLICK
    $("#groupEdition > .btn").click(function() {
      $(this).addClass("active").siblings().removeClass("active");
      edition = $(this).html();
      $("#editionTitle").html(version + " " + edition);
      loadEditionVersion(version, edition);
    });

    //Auto Select first
    if (edition == "") {
      $("#groupEdition > .btn:nth-child(1)").click();
    }else{
       $("#groupEdition > .btn").each(function () {
          if(edition.toLowerCase() == this.innerHTML.toLowerCase()){
            this.click();
          }
       });
    }
  });
}



$(document).ready(function() {

  if (path == "Documentation" || path.indexOf("file:") > -1) {
    // $(".content-heading").append(editionVersions());
    var url = "/Documentation/Sugar_Versions/" + version + "/" + Utils.getAbbreviatedEdition(edition) + "/";
    var versions = $('<section class="active-filters"><div class="row"><div class="col-xs-12 col-md-3 m-b-sm"><span class="m-r-xs">Version:</span></div></div><h1 class="m-t-md red" id="editionTitle"></h1></section><div class="content-section"></div>');
    $(".content-body").html("");
    $(".content-body").append(versions);
    addVersions($(".active-filters > div > div"));

  }


  // if (path.split("/").length == 4)
    // Utils.transformTableToDivs();
});



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