/*
const csv = require('csv');
var newData = [];
const parser = csv.parse((error, data) => {

    //内容出力
    console.log('初期データ');
    console.log(data);

    //変換後の配列を格納
    //let newData = [];

    //ループしながら１行ずつ処理
    data.forEach((element, index, array) => {
        let row = [];
        row.push(element[0]);
        row.push(element[1]); //2カラム目を大文字へ
        //新たに1行分の配列(row)を作成し、新配列(newData)に追加。
        newData.push(row);
        newData.push(1);
    })

    console.log('処理データ');
    console.log(newData);

})
*/

const http = require('http');
const hostname = '127.0.0.1';
const port = 8080;
var server = http.createServer();
server.on('request', doRequest);
// ファイルモジュールを読み込む
var fs = require('fs');
// リクエストの処理
function doRequest(req, res) {
    //calc
    console.log("何が");
    calc_all();
    console.log("起こってるの？");
    // ファイルを読み込んだら、コールバック関数を実行する。
    fs.readFile('./melonpan2.html', 'utf-8' , doReard );

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



function Calc(){
  var me = this;
  this.calory = 0;
  this.body = 58;
  this.v = 0;
  this.calorycalc = function(){
    time = 0.5;
    this.calory = mets(this.v) * this.body * time * 1.05;
  };
  me.vcalc = function(d){
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
  //console.log(res);
  /*
  reader.onload = function(ev){
    text = reader.result;
    console.log(text)
  }
  */

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
    var c = Calc();
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
