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
/*
bot.dialog('/', function (session) {

    session.send("Hello World from " + botenv );
});
*/

bot.beginDialogAction('/help');

bot.dialog('/help', [
    function (session, args) {
        session.endDialog("Loading news from: " + args.data);
    }
]);