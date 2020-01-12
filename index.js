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
var user_id = 1000;
var q_str = "";
var flag = false;


const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
}); 

/* SQL接続 -> 以降は、client.query(~)で呼び出せるように */
 client.connect(); 

server.on('request', doRequest);

// リクエストの処理
function doRequest(req, res) {
    // ファイルを読み込んだら、コールバック関数を実行する。
    fs.readFile('./melonpan10.html', 'utf-8' , doReard );

    // コンテンツを表示する。
    function doReard(err, data) {
      /* クッキーが登録されていたら、そのまま表示*/
        if(req.headers.cookie !== undefined) {
				  // 設定されているCookieをブラウザに表示する
          var cookies = cookie.parse(req.headers.cookie);
          if(cookies["user_id"] !== undefined){
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            user_id = cookies["user_id"];
            console.log("ユーザ情報あり");
            console.log("user_id : " + user_id);
          }
          else{
            /* クッキーが登録されていなかったら、クッキーに登録 + データベースに格納 */
            /* ID生成 -> クッキー登録 */
            user_id = uuid.v1();
            res.setHeader("Set-Cookie", [
              cookie.serialize("user_id", user_id),
              cookie.serialize("hoge1", "111", { maxAge:60 }) ]
            );
            /* データベースに格納 */
            q_str = '';
            q_str += "INSERT INTO users VALUES('";
            q_str += user_id;
            q_str += "','";
            q_str += user_id + '1';
            q_str += "');";
            client.query(q_str,(err, res) => {
                if (err) throw err;
                  for (let row of res.rows) {
                      console.log(JSON.stringify(row));
                  }});
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            console.log("ユーザ情報なし");
            console.log("user_id : " + user_id);            
          }
        }
        else {
          user_id = uuid.v1();
          res.setHeader("Set-Cookie", [
            cookie.serialize("user_id", user_id),
            cookie.serialize("hoge1", "111", { maxAge:60 }),
            cookie.serialize("hoge2", "あいうえお", { maxAge:60 }) ]
          );
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(data);
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
  /* 接続したら、'greeting'メッセージをやり取りする */
  socket.emit('greeting', {message: 'Connected'}, function (data) {
    console.log('result: ' + data);
  });
  
  /* HTML側から'info'メッセージが送られてくるのを待つ */
  socket.on('info',function(data){
    q_str = '';
    flag = false;
    datas = data.split(',');
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
    console.log(q_str + '\n');
    /* SQLへのqueryの送り方 : errはエラーメッセージ resはクエリー格納後の答え */
    client.query(q_str,(err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
  }});
    client.query('SELECT * FROM places', (err, res) => {
      if (err) throw err;
      for (let row of res.rows) {
      console.log(JSON.stringify(row));
//  client.end();
}
    });


});
  
socket.on('SQL_TODAY',function(data){
  console.log(data);
  var lats = '';
  var lngs = '';
  var dists = '';
  var distance = 0;
  var query_str = "";
  query_str += "SELECT lat,lng,distance FROM places WHERE date=" + "'" + data + "';";
  console.log(query_str);
  client.query(query_str,(err,res) => {
    if(err) throw err;
    for(let row of res.rows){
      console.log(JSON.stringify(row));
      lats += row['lat'] + ',';
      lngs += row['lng'] + ',';
      dists += row['distance'] + ',';
    }
    var send_msg_lat = lats.slice(0,-1);
    var send_msg_lng = lngs.slice(0,-1);
    var send_msg_dist = dists.slice(0,-1);

    socket.emit('SQL_TODAY_LAT',send_msg_lat);
    socket.emit('SQL_TODAY_LNG',send_msg_lng);
    socket.emit('SQL_TODAY_DIST',send_msg_dist);    
  });
  
    query_str = "SELECT SUM(distance) FROM places WHERE date=" + "'" + data + "';";
    client.query(query_str,(err,res) => {
    if(err) throw err;
    for(let row of res.rows){
      console.log(JSON.stringify(row));
      distance = row['sum'];
    }

    socket.emit('SQL_TODAY_SUM_DIST',distance);
  
    });
});
  
socket.on('SQL_USER',function(data){
  console.log(data);
  var lats = '';
  var lngs = '';
  var dists = '';
  var query_str = "";
  query_str += "SELECT lat,lng FROM places WHERE uid=" + "'" + user_id + "';";
  console.log(query_str);
  client.query(query_str,(err,res) => {
    if(err) throw err;
    for(let row of res.rows){
      console.log(JSON.stringify(row));
      lats += row['lat'] + ',';
      lngs += row['lng'] + ',';
    }
    var send_msg_lat = lats.slice(0,-1);
    var send_msg_lng = lngs.slice(0,-1);

    socket.emit('SQL_USER_LAT',send_msg_lat);
    socket.emit('SQL_USER_LNG',send_msg_lng);
    
  });
  
    query_str = "SELECT SUM(distance) FROM places WHERE uid=" + "'" + user_id + "';";
    client.query(query_str,(err,res) => {
    if(err) throw err;
    for(let row of res.rows){
      console.log(JSON.stringify(row));
      dists += row['sum'];
    }

    socket.emit('SQL_USER_DIST',dists);
    
  });
  
});
  
socket.on('SQL_WEEK',function(data){
  console.log(data);
  var dt = new Date();
  var query_str = "";
  var dists = '';
  
  for(var i=0;i<7;i++){
      query_str = "";
      var dtstr  = dt.toLocaleDateString();
      query_str += "SELECT sum(distance) FROM places WHERE date=" + "'" + dtstr + "';";
      client.query(query_str,(err,res) => {
        if(err) throw err;
        for(let row of res.rows){
          console.log(JSON.stringify(row));
          if(row['sum'] != null){
          dists += row['sum'] + ',';
          }
          else{
            dists += '0,';
          }
    }

  });
    
      dt.setDate(dt.getDate() - 1);
  }
  var send_msg_dist = dists.slice(0,-1);
  socket.emit('SQL_WEEK_DIST',send_msg_dist); 
  
});

/*
io.sockets.on('disconnection',function(){
  console.log('disconnection');
});*/

/*
client.query('SELECT * FROM users', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  } */
//  client.end();
});


/*
client.query("INSERT INTO places VALUES('" + 'abc' + "','" + datas[0] + "','" + datas[1] + "','" + datas[2] + "','" + '1000' + "');");

console.log("INSERT INTO places VALUES('" + 'abc' + "','" + datas[0] + "','" + datas[1] + "','" + datas[2] + "','" + '1000' + "');")
*/






/* ------------------------------------- */