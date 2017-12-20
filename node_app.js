// var redis = require("redis"), client = redis.createClient("port", "host", {
//     'auth_pass': 'password',
//     'return_buffers': true
//   });
var redis = require("redis"), client = redis.createClient();
var http = require('http');
var fs = require("fs");
var ip="127.0.0.1";
var port=1337;

var parseQueryString = function( queryString ) {
    var params = {}, queries, temp, i, l;
    queries = queryString.split("&");
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
};

http.createServer(function (req, res) {
  var filename;
  console.log(req.url);
  if (req.url.indexOf("index.html") >= 0) {
    filename = "index.html";
  } else if (req.url.indexOf("autocomplete.js") >= 0) {
    filename = "autocomplete.js";
  }
  if (filename) {
    console.log(filename);
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        res.writeHead(500, {"Content-Type": "text/plain"});
        res.write(err + "\n");
        res.end();
        return;
      }
      res.writeHead(200);
      res.write(file, "binary");
      res.end();
    });
  }
  var q = parseQueryString(req.url.substring(req.url.indexOf('?') + 1));
  if (typeof(q["q"]) != 'undefined'){
	  var query = decodeURIComponent(decodeURI(q["q"])).toLowerCase();
	  var autoicd = q["autoicd"]
	  var callback = q["callback"];
	  console.log("query: " + query); 
	  client.zrangebylex(autoicd, '[' + query, '[' + query + '\xff', 
		function(err, reply){
		if (err !== null){
		  console.log("error: " + err);
		} else {
		  res.writeHead(200, {'Content-Type': 'text/plain'});
		  var replies = [];
		  for(var i = 0; i< reply.length; i++)
			replies.push(reply[i].split("$")[1]);
		  replies = replies.sort();
		  var str = callback + '( ' + JSON.stringify(replies) + ')';
		  res.end(str);
		}
	  });
  }
}).listen(port, ip);

console.log('Server running at http://' + ip + ':' + port);
