const http = require('http');
const querystring = require('querystring');
const cookie = require('cookie');
const uuid = require('node-uuid');
const hostname = '127.0.0.1';
const port = 8080;
var server = http.createServer();
server.on('request', doRequest);
// ファイルモジュールを読み込む
var fs = require('fs');
// リクエストの処理
function doRequest(req, res) {
    //calc
    //console.log("何が");
    //calc_all();
    //console.log("起こってるの？");
    // ファイルを読み込んだら、コールバック関数を実行する。
    fs.readFile('./melonpan5.html', 'utf-8' , doReard );

    // コンテンツを表示する。
    function doReard(err, data) {
        if(req.headers.cookie !== undefined) {
				  // 設定されているCookieをブラウザに表示する
          var cookies = cookie.parse(req.headers.cookie);
          if(cookies["user_id"] !== undefined){
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.write('<hr>');
            res.write("user_id =" + cookies["user_id"] + "<br>");
            var user_id = cookies["user_id"];
            console.log("ユーザ情報あり");
            console.log("user_id : " + user_id);
          }else{
            user_id = uuid.v1();
            res.setHeader("Set-Cookie", [
              cookie.serialize("user_id", user_id),
              cookie.serialize("hoge1", "111", { maxAge:60 }),
              cookie.serialize("hoge2", "あいうえお", { maxAge:60 }) ]
            );
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.write('<hr>');
            console.log("ユーザ情報なし");
            console.log("user_id : " + user_id);            
          }
        }else {
          user_id = uuid.v1();
          res.setHeader("Set-Cookie", [
            cookie.serialize("user_id", user_id),
            cookie.serialize("hoge1", "111", { maxAge:60 }),
            cookie.serialize("hoge2", "あいうえお", { maxAge:60 }) ]
          );
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(data);
          res.write('<hr>');
          console.log("ユーザ情報なし");
          console.log("user_id : " + user_id);
  			}
        res.end();
    }
}
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});









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
