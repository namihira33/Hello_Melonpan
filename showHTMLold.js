
const http = require('http');
const url = require('url');
const path = require('path');
const querystring = require('querystring');
var fs = require('fs');

const hostname = '127.0.0.1';
const port = 8080;
var server = http.createServer(requestServer).listen(port);
//server.on('request', doRequest);


// リクエストの処理
/*
function doRequest(req, res) {
    //calc
    //console.log("何が");
    //calc_all();
    //console.log("起こってるの？");
    // ファイルを読み込んだら、コールバック関数を実行する。
    fs.readFile('./melonpan7.html', 'utf-8' , doReard );

    // コンテンツを表示する。
    function doReard(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    }
}
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/


/* ------------------------------------- */
// 接続されたときに呼ばれる関数
function requestServer(req, res) {
	var uri = url.parse(req.url, true);

	console.log(uri.pathname);

	switch(uri.pathname) {
		case "/set":
			res.setHeader("Content-Type", "text/plain");
			// Cookieに"hoge1=111"と"hoge2=あいうえお"を設定する。
			res.setHeader("Set-Cookie", [ "hoge1=111", "hoge2=" +
				querystring.escape("あいうえお") ]);
			res.writeHead(200);
			res.write("test");
			res.end();
			break;
		case "/get":
			res.writeHead(200, { "Content-Type" : "text/plain" });
			if(req.headers.cookie !== undefined) {
				// 設定されているCookieをブラウザに表示する
				res.write(req.headers.cookie);
			} else {
				res.write("Unset Cookie");
			}
			res.end();
			break;
		default:
			//res.writeHead(404, {"Content-Type" : "text/plain"});
			//res.write("404 Not found.");
      fs.readFile('./melonpan7.html', 'utf-8' , doReard );
      function doReard(err, data) {
          res.writeHead(200, {'Content-Type': 'text/html'});
          console.log(data)
          res.write(data);
          res.end();
      }
			res.end();
	}
}




/* ------------------------------------- */

/*

function Calc(){
  this.calory = 0;
  this.body = 58;
  this.v = 0;
  this.calorycalc = function(){
    time = 0.5;
    this.calory = mets(this.v) * this.body * time * 1.05;
  };
  this.vcalc = function(d){
    time = 0.5;
    this.v = d/time;
  };
}


var newData = []
var item = []

// 計算機構
function calc_all(){
  const fs = require('fs');
  const csvSync = require('csv-parse/lib/sync'); // requiring sync module
  let text = fs.readFileSync("test.csv", 'utf-8');
  newData = csvSync(text);

  console.log('newDataはありますか？');
  console.log(newData);
  for(var i = 0; i < newData.length-1;i++){
    var r = 6378.137 * 1000;
    var x1 = newData[i][0];
    var x2 = newData[i+1][0];
    var y1 = newData[i][1];
    var y2 = newData[i+1][1];
    var d = r * Math.acos(Math.sin(y1)*Math.sin(y2)+Math.cos(y1)*Math.cos(y2)*Math.cos(x2-x1));
    var time = 0.5;
    var c = new Calc();
    c.vcalc(d);
    c.calorycalc();
    console.log(c.v);
    console.log(c.calory);
  }
}
function mets(v){
  if (v < 8900/60){return 3.5;}
  if (v < 15100/60){return 5.8;}
  if (v < 16100/60){return 6.3;}
  if (v < 19200/60){return 6.8;}
  if (v < 22400/60){return 8.0;}
  return 10.0;
}
*/
