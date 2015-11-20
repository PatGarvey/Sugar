var Tree = (function() {
    function Tree() {
        this.data = null;
        this.siblings = null;
        this.siblingPrev = null;
        this.siblingNext = null;
        this.status = 'closed';
        this.origin = '';
        this.sitemapjs = null;
    }

    Tree.prototype.setData = function(tree) {
        this.data = tree;
        // this.data.href = '/';  // root must be /
    };
    Tree.prototype.getData = function() {
        return this.data;
    };
    Tree.prototype.getParent = function(str) {
        var parts = str.split('/');
        var s = parts.pop();
        return parts.join('/');
    };
    Tree.prototype.getSelf = function(str) {
        return str.split('/').pop();
    };
    Tree.prototype.init = function(location) {
        var href = "root";
        var search = this.getId(href);
        var root = document.querySelector('#tree-navigation-content .widget-body');
        root.innerHTML = "";
        var ul = document.createElement('ul');
        ul.setAttribute('id', search);
        ul.setAttribute('class', 'nav');
        ul.childNodes = [];

        this.addChildren(ul, location, this.data);
        root.appendChild(ul);
    };
    Tree.prototype.addChildren = function(el, location, obj) {
        if (el && typeof el.childNodes !== 'undefined' && el.childNodes.length == 0) {
            var children = obj.children || [];
            var clean = this.cleanLower(location);
            if (typeof obj.sort !== 'undefined') {
                if (obj.sort == 'a') {
                    // sort alpha
                    children.sort(function(a, b) {
                        if (a.href > b.href) return 1;
                        if (a.href < b.href) return -1;
                        return 0;
                    });
                }
                if (obj.sort == 'm') {
                    // sort order
                    children.sort(function(a, b) {
                        if (parseInt(a.order) > parseInt(b.order)) return 1;
                        if (parseInt(a.order) < parseInt(b.order)) return -1;
                        return 0;
                    });
                }
            }
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var found = this.find(child, clean);
                if (found) {
                    this.status = (found.children.length > 0) ? 'open' : 'closed';
                    if (this.match(child, clean)) {
                        child = this.bold(child);
                    }
                    if (this.isChild(child, clean)) {
                        var c = this.append(el, child);
                        var ul = c.childNodes[2];
                        this.addChildren(ul, location, child);
                    } else {
                        el = this.append(el, child);
                    }
                } else this.append(el, child);
            }
        }
    };
    Tree.prototype.bold = function(obj) {
        obj.name = "<b>" + obj.name + "</b>";
        return obj;
    };
    Tree.prototype.append = function(el, obj) {
        return el.appendChild(this.li(obj));
    };
    Tree.prototype.setHover = function() {
        $('#ul_root li a').hover(
            function(el) {
                $('.link-del-hover').remove();
                var it = $(this);
                var p = it.offset();
                var t = it.clone();
                t.css({
                    'top': p.top,
                    'left': p.left
                });
                t.addClass('link-del-hover');
                t.has('b').addClass('page');
                t.hover(
                    function() {},
                    function(e) {
                        $('.link-del-hover').remove();
                    }
                );
                $('body').append(t);
            },
            function() {}
        );
    };
    Tree.prototype.open = function(location) {
        var _id = "ul_" + this.cleanName(location);
        var ul = (_id.charAt(0) == '#') ? _id.substr(1, _id.length - 1) : _id;
        id = this.cleanLower(ul.substr(3, ul.length - 1)); // remove ul_
        id = (id.charAt(id.length - 1) == "_") ? id.substr(0, id.length - 1) : id;

        var found = this.find(this.data, id);
        if (found) {
            var ul = document.getElementById(ul);

            var chevron = ul.parentNode.firstChild;
            var down = "glyphicon-chevron-down";
            var right = "glyphicon-chevron-right";

            if (chevron.className.indexOf(down) >= 0) {
                chevron.className = chevron.className.replace(down, right);
            } else if (chevron.className.indexOf(right) >= 0) {
                chevron.className = chevron.className.replace(right, down);
            }
            this.addChildren(ul, location, found);
        } // else report error...

        //this.setHover();
    };
    Tree.prototype.getPath = function(obj) {
        var path = this.cleanLower(obj.href);
        if (path.charAt(path.length - 1) == "_") path = path.substr(0, path.length - 1);
        return path;
    };
    Tree.prototype.isChild = function(obj, location) {
        var path = this.getPath(obj);
        return location.indexOf(path) >= 0;
    };
    Tree.prototype.match = function(obj, location) {
        var path = this.getPath(obj);
        return location == path;
    };
    Tree.prototype.find = function(obj, location) {
        // if matched, return it
        if (this.match(obj, location)) {
            return obj;
        } else if (this.isChild(obj, location) && typeof obj.children !== 'undefined') {
            var children = obj.children;
            for (var i = 0; i < children.length; i++) {
                var found = this.find(children[i], location);
                if (found) {
                    return found;
                }
            }
        }

        return false;
    };
    Tree.prototype.ul = function(id, status) {
        status = (status == 'down' || this.status == 'open') ? "in active" : "";
        var ul = document.createElement('ul');
        ul.setAttribute('class', 'collapse ' + status);
        ul.setAttribute('id', this.getId(id));
        return ul;
    };
    Tree.prototype.li = function(item) {
        var href = this.cleanName(item.href);
        var li = document.createElement('li');
        li.setAttribute('id', href);
        if (typeof item.children !== 'undefined' && item.children.length > 0) {
            li.setAttribute('class', 'hasChildren');
            this.getTitleHtml(li, item);
        } else {
            var a = document.createElement('a');
            a.setAttribute('href', NavTree.origin + item.href);
            a.innerHTML = item.name;
            li.appendChild(a);
        }
        return li;
    };
    Tree.prototype.getId = function(id) {
        return "ul_" + this.cleanName(id);
    };
    Tree.prototype.cleanName = function(name) {
        return name.replace(/[^a-z0-9_]/g, function(s) {
            var c = s.charCodeAt(0);
            // number
            if (c > 47 && c < 58) return s.toLowerCase();
            // uppercase letter
            if (c > 64 && c < 91) return s.toLowerCase();
            // lowercase letter
            if (c > 96 && c < 123) return s;
            return '_';
        });
    };
    Tree.prototype.cleanLower = function(name) {
        return this.cleanName(name).toLowerCase();
    };
    Tree.prototype.getTitleHtml = function(li, item) {
        var status;
        var active = "";
        if (this.status == 'open') {
            status = 'down';
            this.status = 'closed';
            active = "active";
            $(li).addClass("active");
            $(li).addClass("activeRed");
        } else status = 'right';
        var root = this.cleanName(item.href);
        var ulid = this.getId(root);
        var span = document.createElement('span');
        span.setAttribute('class', 'glyphicon glyphicon-chevron-' + status + ' pointer');
        span.setAttribute('data-toggle', 'collapse');
        span.setAttribute('href', '#' + ulid);
        span.setAttribute('onclick', "javascript:NavTree.open('" + item.href + "');");

        var a = document.createElement('a');
        a.setAttribute('href', NavTree.origin + item.href);
        a.innerHTML = item.name;

        var ul = this.ul(root, status);
        li.appendChild(span);
        li.appendChild(a);
        li.appendChild(ul);
    };
    Tree.prototype.findKey = function(keyObj, data) {
        var p, key, val, tRet;
        for (p in keyObj) {
            if (keyObj.hasOwnProperty(p)) {
                key = p;
                val = keyObj[p];
            }
        }

        if (data[key] == val) {
            return data;
        } else if (Array.isArray(data)) {
            var children = data;
            for (var i = 0; i < children.length; i++) {
                var found = this.findKey(keyObj, children[i]);
                if (found) {
                    return found;
                }
            }
        } else if (data.hasOwnProperty("children")) {
            var children = data.children;
            for (var i = 0; i < children.length; i++) {
                var found = this.findKey(keyObj, children[i]);
                if (found) {
                    return found;
                }
            }
        }
    };
    Tree.prototype.addMainContent = function(data, path) {
        var pathArr = path.split("/");

        if (path.substr(0, 1) != "/")
            path = "/" + path;
        //TODO Sugar_Versions/x.x H2 only
        // if(pathArr[1] == "Documentation" && 
        //     ((pathArr[2] == "Sugar_Versions" && pathArr.length < 4)  || pathArr[2] == "Installable_Connectors" )){
        //     //H2 tags
        //     this.addToc(data, path, this.getHeaderTags());
        // }else{
        //     this.addToc(data, path, this.getLowestLevelLinks());
        // }   

        var mainContent;
        //Is Guide
        if (data.guide == 1) {
            mainContent = data.children;
            if (data.href != path || mainContent.length == 0)
                this.addToc(data, path, this.getHeaderTags());
            //this.getHeaderTags();
        } else {
            this.getLowestLevelLinks();
            this.addToc(data, path, mainContent);
        }
        // if(pathArr[0] == "Get_Started"){

        // }else if(pathArr[0] == "Documentation"){
        //     if(pathArr[1] == "Sugar_Versions"){
        //         if(pathArr.length > 4){
        //             mainContent = this.getHeaderTags();
        //         }
        //     }else if(pathArr[1] == "Installable_Connectors"){
        //         mainContent = this.getHeaderTags();
        //     }
        // }else if(pathArr[0] == "Knowledge_Base"){

        // }



    };
    Tree.prototype.addToc = function(data, path, tocChildren) {
        if (data["href"] == path) {
            data.children = tocChildren;
        } else if (data.hasOwnProperty("children")) {
            var children = data.children;
            for (var i = 0; i < children.length; i++) {
                this.addToc(children[i], path, tocChildren);
            }
        }
    };
    Tree.prototype.createSiblingList = function(children, title) {
        var div = document.createElement('div');
        var span = document.createElement('p');
        span.setAttribute('class', 'title');
        span.setAttribute('onClick', 'NavTree.showSiblings()');
        span.setAttribute('data-toggle', 'collapse');
        span.setAttribute('data-target', '#sibling');
        div.appendChild(span);
        var ul = document.createElement('ul');
        ul.setAttribute('class', 'collapse');
        div.appendChild(ul);
        ul.setAttribute('id', 'sibling');
        var lastSibling;
        var mainElement;

        for (var i = 0; i < children.length; i++) {
            var a = document.createElement('a');
            a.innerHTML = children[i].name;
            if (children[i].name == title) {
                //Main 
                a.setAttribute('class', 'title');
                span.appendChild(a);
                a.setAttribute('data-toggle', 'collapse');
                a.setAttribute('data-target', '#sibling');
                mainElement = children[i];
                //Add prev sibling
                if (lastSibling != null && lastSibling.paging == 1 && mainElement == null)
                    this.siblingPrev = lastSibling;
            } else {
                //Sibling
                var li = document.createElement('li');
                a.setAttribute('href', children[i].href);
                li.setAttribute('aria-expanded', false);
                li.appendChild(a);
                ul.appendChild(li);
                lastSibling = children[i];
                //Add next sibling
                if (mainElement != null && this.siblingNext == null && lastSibling.paging == 1) {
                    this.siblingNext = lastSibling;
                }
            }

        }
        this.siblings = children;

        return div;
    };
    Tree.prototype.showSiblings = function() {
        $('#tree-title p').toggleClass("open");
        $('#tree-title').toggleClass("open");
    };
    Tree.prototype.getPathUntilDepth = function(path, depth) {
        var result = "";
        var i = 0;
        while (path[i] != undefined && path[i].length > 0) {
            result += "/" + path[i];
            i++;
            if (i == depth)
                break;
        }
        return result;
    };
    Tree.prototype.getHeaderTags = function() {
        var order = 0;
        var tags = [];
        $('.content-body h2').each(function() {
            var node = {
                children: [],
                href: "#" + $(this).attr('id'),
                name: $(this).text(),
                order: order,
                sort: "m"
            };
            if (node.name == "" || $(this).attr('id') === undefined)
                return true;

            order++;
            tags.push(node);

            if (order > 30)
                return false;
        });
        return tags;
    };
    Tree.prototype.getLowestLevelLinks = function() {
        var order = 0;
        var tags = [];
        $('.content-body a').each(function() {
            var node = {
                children: [],
                href: $(this).attr('href'),
                name: $(this).text(),
                order: order,
                sort: "m"
            };
            order++;
            tags.push(node);
        });
        return tags;
    };

    Tree.prototype.addPrevNextPageLinks = function(branch) {
        var widgets_bottom = $(".content-footer");
        if (widgets_bottom && this.siblings) {
            // html container
            var prevnext = document.createElement('div');
            prevnext.setAttribute('id', 'prevnext');
            prevnext.setAttribute('class', 'row');

            var searchPathParent = branch.href.substring(0, branch.href.lastIndexOf("/"));
            var branchParent = NavTree.findKey({
                "href": searchPathParent
            }, this.sitemapjs);
            var index = branchParent.children.indexOf(branch);
            if (index > 0)
                var prev = branchParent.children[index - 1];
            if (index < branchParent.children.length - 1)
                var next = branchParent.children[index + 1];
            var pHTML = '<div class="col-xs-6 text-left"></div>',
                nHTML = '';
            var maxlen = 40;
            var showPaging = false;

            if (prev) {
                var pFull = prev.name;
                var pName = (pFull.length > maxlen) ? pFull.substring(0, maxlen).trim() + '...' : pFull;
                pHTML = '<div class="col-xs-6 text-left"><span id="prevnext_previous" data-toggle="tooltip" title="' + pFull + '"><a href="' + prev.href + '"> < Previous</a> | ' + pName + '</span></div>';
                showPaging = true;
            }
            if (next) {
                var nFull = next.name;
                var nName = (nFull.length > maxlen) ? nFull.substring(0, maxlen).trim() + '...' : nFull;
                nHTML = '<div class="col-xs-6 text-right"><span id="prevnext_next" data-toggle="tooltip" title="' + nFull + '">' + nName + ' | <a href="' + next.href + '">Next ></a></span></div>';
                showPaging = true;
            }
            if (showPaging) {
                prevnext.innerHTML = pHTML + nHTML;
                var fi = widgets_bottom.children().first();
                $(prevnext).insertBefore(widgets_bottom.children().first());
                // widgets_bottom.insertBefore(prevnext, widgets_bottom.first());
                $('[data-toggle="tooltip"]').tooltip({
                    placement: 'top'
                });
            }
        }
    };

    //Special function to get the guide level for Navbar - custom for each section
    Tree.prototype.getJunctionForPath = function(path, treeData) {
        var pathArr = path.substr(1).split("/");
        var path2 = path + "/";

        //New method to get the Guide = 1 level
        var branch;
        do {
            path2 = path2.substr(0, path2.lastIndexOf("/"));
            branch = NavTree.findKey({
                "href": path2
            }, treeData);
        } while (branch !== undefined && branch.guide == 0 && path2.length > 0);

        if (path2 == "")
            return path;
        return path2;

    };

    Tree.prototype.create = function(tree) {
        var url = NavTree.getUrl(window.location.href);
        var path = url.replace(/^https?:\/\/[^\/]+\//i, "").replace(/\/$/, "");
        if (path.indexOf("/") == 0)
            path = path.substring(1);
        var pathArr = path.split("/");

        var searchPath = "";
        // https://support.sugarcrm.com/Documentation/Sugar_Versions/7.6/Ent/Application_Guide/Getting_Started


        if (window.location.href.indexOf("http") > -1)
            searchPath = "/" + path;
        else
            url = path = searchPath = "/Documentation/Sugar_Versions/7.6/Pro/Application_Guide/Getting_Started";

        var treeData = tree;

        NavTree.sitemapjs = tree;

        searchPath = NavTree.getJunctionForPath(searchPath, treeData);
        var branch = NavTree.findKey({
            "href": searchPath
        }, treeData);

        //Get top-level sibling nodes
        var searchPathParent = searchPath.substring(0, searchPath.lastIndexOf("/"));

        if (branch) {

            //Don't render tree if configured by disable_nav = 1
            if (branch.disable_nav == 1 || this.tree != null) {
                $(".content-navbar-toogle").hide();
                return;
            }
            var widgets = document.getElementById('navmenu');
            if (widgets == null) {
                var widgetsParent = $("section.content");
                widgetsParent.append('<div class="navmenu navmenu-default navmenu-fixed-left" id="navmenu" data-spy="affix" data-offset-top="240"></div>');
                widgets = document.getElementById('navmenu');
            }
            var nav = document.createElement('div');
            nav.setAttribute('id', 'tree-navigation');
            nav.innerHTML = '' + '<div class="widget" id="tree-navigation-content">' +
                '    <div class="widget-body" id="toc-body">' +
                '        <p>Loading...</p>' +
                '    </div>' +
                '</div>';
            widgets.insertBefore(nav, widgets.firstChild);

            $('section.content').addClass("has-navmenu");
            var foot = $('footer > div');
            $('footer > div').addClass("has-navmenu");

            //Add page title widget
            var navTitle = document.createElement('div');
            navTitle.setAttribute('id', 'tree-title');
            // navTitle.setAttribute('class', 'strong');
            // navTitle.innerHTML = "Page title";
            widgets.insertBefore(navTitle, widgets.firstChild);

            // if(branch )
            NavTree.addMainContent(branch, path);
            // NavTree.addToc(branch, "/"+path, NavTree.getHeaderTags());
            // NavTree.setTreeTitle(branch.name);
            NavTree.setData(branch);
            var content = document.querySelector('#tree-navigation-content .widget-body');
            NavTree.init(url);
            NavTree.setHover();

            $('#tree-title').html("");
            var branchParent = NavTree.findKey({
                "href": searchPathParent
            }, treeData);
            if (branchParent) {
                var siblingList = NavTree.createSiblingList(branchParent.children, branch.name);
                if (siblingList) {
                    $('#tree-title').append(siblingList);

                    //Add prev & next paging links
                    var localBranch = NavTree.findKey({
                        "href": url
                    }, treeData);
                    if (localBranch.paging == 1)
                        NavTree.addPrevNextPageLinks(localBranch);
                }
            }
            if ($('#tree-title').html() == "") {
                $('#tree-title').addClass("hidden");
            }
            // $('#tree-title').append(siblingList);

            //iOs hack to fix double-tap
            $('#tree-navigation a').on('click touchend', function(e) {
                var el = $(this);
                var link = el.attr('href');
                if (Utils.isMobile()) {
                    $("#navmenu").offcanvas('hide');
                    window.location = link;
                }
            });

            //Scroll
            $('body').scrollspy({
                target: '#toc-body'
            });
            $('[data-spy="scroll"]').each(function() {
                var $spy = $(this).scrollspy('refresh');
            })


            if (Utils.isMobile()) { 
                //Swipe Gestures
                $(".content-body").on("swiperight", function (e) {
                   // console.log("swiperight");
                   $("#navmenu").offcanvas('toggle');
                });
            }

        }

    };

    Tree.prototype.getUrl = function(url) {
        var URL = url.replace("http://", "").replace("https://", "");
        URL = URL.substr(URL.search(/\//), 1000);
        // disregard hash
        URL = (URL.lastIndexOf("#") > 0) ? URL.substr(0, URL.lastIndexOf("#")) : URL;
        // remove index.html
        URL = URL.replace('index.html', '');
        // remove trailing slash
        URL = (URL.slice(-1) === "/") ? URL.substr(0, URL.length - 1) : URL;
        // remove leading /.*/cache/preview/, etc directories
        var reg = /^\/*(\S+)\/cache\/preview\/support\.sugarcrm\.com/g;
        var loc = reg.exec(URL);
        if (loc) {
            NavTree.origin = loc[0];
            return URL.replace(loc[0], '');
        }
        return URL;
    };

    Tree.prototype.setTreeTitle = function(title) {

    };
    return Tree;
})();

NavTree = new Tree();

(function() {
    $(document).ready(function() {
        // Add to widgets


        // var root = getUrl(window.location.href);
        // NavTree.setData(tree);
        // var content = document.querySelector('#tree-navigation-content .widget-body');
        // NavTree.init(root);
        //NavTree.setHover();

        // query sitemap.js
        $.ajax({
            // url: '/assets/js/scripts/sitemap.js',
            url: 'http://support.sugarcrm.com/assets/js/scripts/sitemap.js',
            dataType: "jsonp",
            jsonp: false,
            jsonpCallback: 'this.done'
        }).done(function(tree) {
            NavTree.create(data);
        })

    });
})();

//dummy function for sitemap.js
var sitemap = function(data) {

    NavTree.create(data);

};