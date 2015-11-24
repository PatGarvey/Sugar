//TEMP - DOCUMENT PAGE
$(document).ready(function() {

	var edition;
	var sitemap;
	var firstRun = true;

	var indexTemplate = '<div class="tabs" id="indexTabs"><h1></h1><ul class="nav nav-tabs"> ' +
		'</ul>         </div><div class="tab-content"></div> ';

	//Load SITEMAP.JS
	$.ajax({
		// url: '/assets/js/scripts/sitemap.js',
		// url: 'http://support.sugarcrm.com/assets/js/scripts/sitemap.js',
		url: 'http://support-sugarcrm-com.s3-website-us-west-2.amazonaws.com/assets/js/scripts/sitemap.js',
		dataType: "jsonp",
		jsonp: false,
		jsonpCallback: 'sitemap'
	}).done(function(tree) {
		// var branch = Utils.findKey({href:"/Get_Started/End_Users/Community_Edition"}, data);
		sitemap = tree;

		if (window.localStorage && window.localStorage.getItem("usertype")) {
			//Select Local Storage user type
			usertype = window.localStorage.getItem("usertype");
			if (usertype != null) {
				$("#groupUserType > .btn").each(function() {
					if (usertype.toLowerCase() == this.innerHTML.toLowerCase()) {
						this.click();
					}
				});
			}
		} else {
			//Auto select End Users
			$("#groupUserType > .btn:nth-child(1)").click();
		}

	});

	$(".content-body .content").html("");
	$(".content-body").append("<div class='section-holder'></div>");


	//All Button Bar Click
	$(".btn-group > .btn").click(function() {
		$(this).addClass("active").siblings().removeClass("active");
	});

	//User Type Button Bar Click
	$("#groupUserType > .btn").click(function() {
		usertype = $(this).html();
		$(".section-holder").empty();
		if (usertype == "Developers") {
			$('#editionHolder').addClass("hidden");
			edition = "";
			showTabs(edition);
		} else {
			$('#editionHolder').removeClass("hidden");
			$("#groupEdition > .btn").removeClass("active");

			// if (firstRun) {

			if (window.localStorage) {
				edition = window.localStorage.getItem("edition");
				$("#groupEdition > .btn").each(function() {
					if (edition.toLowerCase() == this.innerHTML.toLowerCase()) {
						this.click();
					}
				});
			} else {
				$("#groupEdition > .btn:nth-child(1)").click();
			}
			firstRun = false;
		}
		getVideo(usertype);
	});

	//Edition type Button bar Click
	$("#groupEdition > .btn").click(function() {
		edition = $(this).html();
		$(".section-holder").empty();
		showTabs(edition);
	});

	//Show the tabs from the Button Bar Selection
	function showTabs(tabs) {
		$(".content-section .accordion a").addClass("collapsed");
		$(".content-section .accordion div").removeClass("in");

		var url = "/Get_Started/" + Utils.replaceSpaceToUnderScore(usertype);
		if (edition != "")
			url += "/" + Utils.replaceSpaceToUnderScore(edition);
		var branch = Utils.findKey({
			href: url
		}, sitemap);
		if (branch) {
			$(".section-holder").append(indexTemplate);
			for (var i = 0; i < branch.children.length; i++) {
				$("#indexTabs ul").append('<li role="presentation"><a href="#">' + branch.children[i].name + '</a></li>');
			}
			$("#indexTabs ul li:nth-child(1)").addClass("active");
			$("#indexTabs h1").text("Getting Started with Sugar " + edition + " for " + usertype);


			loadSection($("#indexTabs ul li:nth-child(1) a").html());
		}

		$(".nav-tabs a").click(function() {
			var section = $(this).html();
			if (section != "Plug-Ins")
				section = section.split("-").join("_").split(" ").join("_");
			loadSection(section);
			$(this).parent().addClass("active").siblings().removeClass("active");
		});
	}

	//Load the selected Section into the Tab
	function loadSection(section) {
		var url = "/Get_Started/" + Utils.replaceSpaceToUnderScore(usertype);
		if (edition != "")
			url += "/" + Utils.replaceSpaceToUnderScore(edition);
		url += "/" + section;
		$(".tab-content").load(url + " .content-body", function() {

		});
	}

	function getVideo(usertype){
		$.getJSON('http://scarlett.sugarcrm.com/sugar/rest/v10/documentation/videos/Get_Started/'+usertype, function(json, textStatus) {
			var holder = $("section.video-content");
			$.each(json, function (key, value) {
				var videoDiv = $('<div class="col-sm-6 col-md-3 video-item">
	                  <a href="#" class="thumbnail video-thumbnail video-trigger " data-video="'+value.link+'" data-toggle="modal" data-target="#videoPlayerModal"><img src="http://scarlett.sugarcrm.com/Sugar/shugarcrm/pictures/video.jpg"></a>
	                  <a href="#" class="video-trigger" data-toggle="modal" data-video="'+value.link+'" data-target="#videoPlayerModal">'+value.name+'</a>
	                </div>');
				holder.append(videoDiv);
			});

		});
	}


});