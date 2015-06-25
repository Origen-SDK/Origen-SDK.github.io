$.getJSON("/search.json", function(json) {
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
  $("#search button").click(function() {
    search(true);
  });
  $("#search input").keypress(function(e) {
    if(e.which == 13) {
      e.preventDefault();
      search(false);
    }
  });
})

function search(go) {
  var term = $("#search input").val();
  // Wait for search index to populate
  while (!window.index) {};
  var results = window.index.search(term);

  if(results && results.length == 1) {
    window.location.replace("/" + results[0].ref + "?highlight=" + escape(term));
  } else if(results && results.length > 1) {
    if (go) {
      window.location.replace("/" + results[0].ref + "?highlight=" + escape(term));
    } else {
      displayResults(results, term);
    }
  } else {
    alert("Found nothing");
  }
}

function displayResults(results, term) {
  var resultTemplate = $("search-view-template");
  var container = $("article");  

  container.empty();
  container.append("<h2>Results</h2>");

  $.each(results, function(i, result) {
    var article = window.articles[result.ref];
    container.append("<p><a href=\"/" + result.ref + "?highlight=" + escape(term) + "\">" + article.title + " - " + article.subtitle + "</a></p>");
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
    $('article').highlight(term);
  }
});
