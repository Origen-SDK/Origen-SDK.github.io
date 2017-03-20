var search_json;

if (window.origen_search_id) {
  search_json = "search_" + window.origen_search_id + ".json";
} else {
  search_json = "search.json";
}

$.getJSON("/memory_image/" + "/" + search_json, function(json) {
  window.index = lunr(function() {
    this.field("title", {boost: 10});
    this.field("subtitle", {boost: 5});
    this.field("body");
    this.ref("id");
  });
  window.articles = json;
  $.each(json, function(id, content) {
    window.index.add({
      id: id,
      title: content.title,
      subtitle: content.subtitle,
      body: content.body
    });
  });
});

$(function() {
  $("#search button").click(function(e) {
    search(true);
    return false;
  });
  $("#search input").keypress(function(e) {
    if(e.which === 13) {
      e.preventDefault();
      search(false);
      return false;
    }
  });
})

function search(go) {
  // If the search index has populated
  if (window.index) {
    var term = $("#search input").val();
    var results = window.index.search(term);

    if(results && results.length === 1) {
      window.location = "/memory_image/" + results[0].ref + "?highlight=" + escape(term);
    } else if(results && results.length > 1) {
      if (go) {
        window.location = "/memory_image/" + results[0].ref + "?highlight=" + escape(term);
      } else {
        displayResults(results, term);
      }
    } else {
      alert("Found nothing");
    }
  } else {
  // Otherwise try again in 200ms
    setTimeout(search(go), 200);
  }
}

function displayResults(results, term) {
  var resultTemplate = $("search-view-template");
  var container = $(".search-results");  
  if (!container[0]) {
    // Fall back to original behavior
    container = $("article");  
  }

  container.empty();
  container.append("<h2>Search Results</h2>");

  $.each(results, function(i, result) {
    var article = window.articles[result.ref];
    var text = article.title;
    if (article.subtitle) {
      if (text) {
        text = text + " - " + article.subtitle;
      } else {
        text = article.subtitle;
      }
    }
 
    container.append("<p><a href=\"/memory_image/" + result.ref + "?highlight=" + escape(term) + "\">" + text + "</a></p>");
  });
}

function getParams() {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
  return query_string;
}

$(document).ready(function() {
  var params = getParams();
  $("#search input").focus();

  if (params.highlight) {
    var term = unescape(params.highlight);
    var articles = $('article');
    articles.highlight(term);
    if (articles[0]) {
      var top = $($("span.highlight:contains(" + params.highlight + ")")[0]).offset().top;

      $('html,body').animate({scrollTop: top - 350}, 500);
    }
  }
});
