const http = require('http');
const querystring = require('querystring');
const cookie = require('cookie');
const uuid = require('node-uuid');
const { Client } = require('pg');
const port = process.env.PORT || 8000;
var fs = require('fs');
var server = http.createServer();
var temp;
var datas;
var user_id = 0;
var q_str = "";

/*
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
}); 
*/
/* SQL接続 -> 以降は、client.query(~)で呼び出せるように */
/* client.connect(); */

server.on('request', doRequest);

// リクエストの処理
function doRequest(req, res) {
    // ファイルを読み込んだら、コールバック関数を実行する。
    fs.readFile('./melonpan10.html', 'utf-8' , doReard );

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
            user_id = cookies["user_id"];
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
var io = require('socket.io').listen(server);
console.log(`Server running at ${port}/`);
server.listen(port);

io.sockets.on('connection', function(socket) {
  socket.emit('greeting', {message: 'Connected'}, function (data) {
    console.log('result: ' + data);
  });
  socket.on('info',function(data){
    console.log('info : ' + data);
    console.log(data.split(',')[0]);
    datas = data.split(',');
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });
    client.connect();
    
    client.query("INSERT INTO users VALUES('100','melon')");

    q_str += "INSERT INTO places VALUES('";
    q_str += user_id;
    q_str += "','";
    q_str += datas[0];
    q_str += "','";
    q_str  += datas[1];
    q_str += "','";
    q_str  += datas[2];
    q_str += "','";
    q_str  += datas[3];
    q_str += "');";
    console.log(q_str);
    client.query(q_str);

//    client.end();
  });
});

/*
io.sockets.on('disconnection',function(){
  console.log('disconnection');
});*/


client.query('SELECT * FROM users', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
//  client.end();
});


/*
client.query("INSERT INTO places VALUES('" + 'abc' + "','" + datas[0] + "','" + datas[1] + "','" + datas[2] + "','" + '1000' + "');");

console.log("INSERT INTO places VALUES('" + 'abc' + "','" + datas[0] + "','" + datas[1] + "','" + datas[2] + "','" + '1000' + "');")
*/






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
