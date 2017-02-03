/*
 処理概要：Slackに一時間ごとのトレンドワードの集計を返す（Develop）
 作成日：2017/2/2
 作成者：mikamism
*/


var restify = require('restify');
var builder = require('botbuilder');
// コネクションの作成
var Connection = require('tedious').Connection;

// Setup Restify Server
var server = restify.createServer();
var botenv = "MYPC";
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s (%s)', server.name, server.url, botenv);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: '101418b0-5bed-492b-9f55-25b768f91e62',
    appPassword: 'ETdDasxDr9aEBdHwkhmfM4t'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

/*

// 排他処理
var async = require('async');

// 同時実行を1に制限
var q = async.queue(function (task, done) {
  done();
},1);

// Azure上のbotを設定
var bot = new builder.BotConnectorBot({
  appId: 'sample-tweet-bot',
  appSecret: '642d202a2f6540958e913cacd739da3d'
});
*/

// DB接続情報の設定
var config = {
  userName: 'socialadmin',
  password: 'ufeuQ7sPu2',
  server: 'socialtestdb.database.windows.net',
  // Azure上のDBの場合は必須
  options: { encrypt: true, database: 'socialtestdb' }
};

bot.dialog('/', function (session) {

    session.send("Hello World from " + botenv );
});

/*

// 処理の振り分け
bot.add('/', new builder.CommandDialog()
  // 大文字小文字でも正規表現でひとまとめとする
  .matches('^(Reminder: exile|Reminder: EXILE|Reminder: エグザイル|Reminder: えぐざいる)', builder.DialogAction.beginDialog('/exile'))
  .matches('^(Reminder: aaa|Reminder: AAA|Reminder: とりえ|Reminder: トリエ|Reminder: トリプルエー)', builder.DialogAction.beginDialog('/aaa'))
  .matches('^(Reminder: ヤフー|Reminder: Yahoo|Reminder: yahoo|Reminder: やふー|Reminder: やほー|Reminder: ヤホー)', builder.DialogAction.beginDialog('/yahoo'))
  .matches('^(Reminder: 1 hour yahoo)', builder.DialogAction.beginDialog('/yahoo1hour'))
  .matches('^(Reminder: twitter)', builder.DialogAction.beginDialog('/twittertrend'))
  .matches('^(Reminder: 1 hour twitter)', builder.DialogAction.beginDialog('/twittertrend1hour'))
  .matches('^(Reminder: dat)', builder.DialogAction.beginDialog('/dat'))
  .matches('^help', showHelp)
  .onDefault(function (session) {
    // 何もせずに処理を終了する
    session.endDialog();
  })
);
*/

// ヘルプが呼ばれた場合
function showHelp(session) {
  session.send('◆日時とそこからn時間分のサマリーを指定する場合\n\n'
              + 'Reminder: dat,指定日(yyyymmddhh24),n,yahoo or twitter\n\n'
              + '例：Yahooトレンドワードの2016年8月20日15時から8時間分のサマリーを取得する場合\n\n'
              + 'Reminder: dat,2016082015,8,yahoo'
              );
  session.endDialog();
}


function makeJpDate() {
  // 現在の時刻を取得
  var dt = new Date();

  // 日本時間に修正
  dt.setTime(dt.getTime() + 32400000);

  // 日付を数字として取り出す
  var year = dt.getFullYear();
  var month = dt.getMonth()+1;
  var day = dt.getDate();
  var hour = dt.getHours();

  return year + '/' + month + '/' + day + ' ' + hour + ':00';
}

