var Search = (function() {
  'use strict';

  function Search(form, container) {
    var _this = this;

    this.data = {};
    this.apiUrl = 'http://scarlett.sugarcrm.com/public/api/v1/search';
    // this.apiUrl = '/public/api/v1/search';
    this.queryString = '';
    this.$searchForm = $(form);
    this.$resultsBlock = $(container);
    this.$results = this.$resultsBlock.find('.results');
    this.$pagination = this.$resultsBlock.find('.pagination');
    this.from = 0;

    if (window.location.search) {
      this.searchCriteriaToQuery();
      this.updateForm();
      this.doSearch();
    }
  };

  /**
   * Render results
   */
  Search.prototype.render = function() {
    if (typeof tmpl === 'undefined') {
      throw new Error('JS template engine doesn\'t found');
    }

    var instance = this;

    this.$results.html(tmpl('search_results', {
      data: this.data,
      params: {
        query: this.query,
        criteria: this.criteria,
        count: this.data.data.length || 0,
        total: this.data.total
      }
    }));

    this.$resultsBlock.removeClass('loading');

    //Add amazon style selected category
    var pills = $("<div class='pull-right'></div>");
    $.each(this.tags, function(index, element) {
      element = element.split("+").join(" ");
      pills.append('<div class="tag label btn-default sm"><span>' + element + '</span><a style="opacity: 1;" id="removeTag_' + index + '""><i class="glyphicon glyphicon-remove-sign"></i></a></div>')
    });
    $("#search-box h1").append(pills);

    //Remove a TAG
    $("#search-box .tag a").click(function() {
      var index = this.id.split("_")[1];

      var tag = $(this).prev();
      instance.removeTag(tag[0].innerHTML);     

    });

    //Add Pagination control at bottom
    if (this.data.data.length > 9) {
      var search = window.location.search;
      if (search.indexOf("from") > -1) {
        search = search.substring(0, search.indexOf("&from"));
      }
      search += "&from=" + (this.from + 10);

      this.$pagination.html("<a href='" + search + "'>Next page >></a>");
    }

  };

  //Removes a query Tag from the Search Query URL and does a new search
  Search.prototype.removeTag = function(tag){
    var search = window.location.search;
    var criteria = window.location.search.substr(1).split('&');

    if(search.indexOf(tag) > -1){
      search = search.substring(0, search.indexOf(tag)-6) + search.substring(search.indexOf(tag)+tag.length);
    }
    window.location.search = search;
  };

  /**
   * Convert search criteria from URL to API query
   */
  Search.prototype.searchCriteriaToQuery = function() {
    var query,
      tags = [],
      criteria = window.location.search.substr(1).split('&');

    for (var i = 0; i < criteria.length; i++) {
      if (criteria[i].indexOf('tag') > -1) {
        if (criteria[i].indexOf('All+edition') == -1) {
          var tag = criteria[i].substr(5);
          if (tag != "")
            tags.push(tag);
        }
      } else if (criteria[i].indexOf('from') > -1) {
        this.from = Math.floor(criteria[i].substr(5));
      } else {
        query = criteria[i].substr(2);
      }
    }

    // Store criteria
    this.criteria = criteria;

    this.tags = tags;
    // Store query
    this.query = query;

    // Generate query string
    this.queryString = 'q=' + (query ? query + (tags.length ? ' AND ' : '') : '') + (tags.length ? 'tags:' + tags.join(',') : '');
  };

  /**
   * Update search form
   */
  Search.prototype.updateForm = function() {
    var criteria, $input, $filter, value;

    for (var i = 0; i < this.criteria.length; i++) {
      criteria = this.criteria[i].split('=');
      $input = $('[name=' + criteria[0] + ']');
      $filter = $('[name=filter_' + criteria[0] + ']');

      value = Utils.stripTags(criteria[1]);

      $input.val(value);
      $filter.val(value);

      if ($.fn.selectpicker) {
        $input.selectpicker('val', value);
      }
    }
  };

  /**
   * Run search
   */
  Search.prototype.doSearch = function() {
    this.$resultsBlock.addClass('loading');

    return this.fetch()
      .done(this.render.bind(this));
  };

  /**
   * Fetch data from remote API
   */
  Search.prototype.fetch = function() {
    var _this = this;

    return $.ajax({
        url: this.apiUrl,
        data: this.queryString
      })
      .done(function(res) {
        _this.data = res;
      });
  };

  return Search;
})();

$(function() {
  'use strict';

  var search = new Search('#searchForm', '#search-box');
});