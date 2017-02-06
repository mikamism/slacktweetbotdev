/*
 処理概要：TwitterとYahooのトレンドワードを定期的に呟くBot用
 作成日：2017/2/6
 作成者：mikamism
*/

var restify = require('restify');
var builder = require('botbuilder');

// コネクションの作成
var Connection = require('tedious').Connection;

// 排他処理
var async = require('async');

// 同時実行を1に制限
var q = async.queue(function (task, done) {
  done();
},1);

//=========================================================
// DB接続情報の設定
//=========================================================
var config = {
  userName: 'socialadmin',
  password: 'ufeuQ7sPu2',
  server: 'socialtestdb.database.windows.net',
  // Azure上のDBの場合は必須
  options: { encrypt: true, database: 'socialtestdb' }
};

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
var botenv = process.env.BOT_ENV;
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s (%s)', server.name, server.url, botenv);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

// 処理の振り分け
bot.dialog('/', new builder.IntentDialog()
  .matches(/^Reminder: yahoo/, '/yahoo')
  .matches(/^Reminder: 1 hour yahoo/, '/yahoo1hour')
  .matches(/^Reminder: twitter/, '/twittertrend')
  .matches(/^Reminder: 1 hour twitter/, '/twittertrend1hour')
  .matches(/^help/i,'/help')
  //.onDefault(builder.DialogAction.send("Hello Default World!"))
  .onDefault(function (session) {
    // 何もせずに処理を終了する
    session.endDialog();
  })
);

bot.dialog('/help', [
    function (session) {
        session.send('◆日時とそこからn時間分のサマリーを指定する場合\n\n'
              + 'Reminder: dat,指定日(yyyymmddhh24),n,yahoo or twitter\n\n'
              + '例：Yahooトレンドワードの2016年8月20日15時から8時間分のサマリーを取得する場合\n\n'
              + 'Reminder: dat,2016082015,8,yahoo'
              );
        session.endDialog();
    }
]);

bot.dialog('/yahoo', [
    function (session) {
        session.send('Hello.Yahoo World!!');
    }
]);