var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var agent = function(cmd) {
  // what is this used for?
}

var SkipNum = 0, FinishedNum = 0, ErrorNum = 0;
var args = [];

function sleep(milliSeconds) { 
  var startTime = new Date().getTime(); 
  while (new Date().getTime() < startTime + milliSeconds);
};

function getCodeVS(url, ID) {
  console.log('starts : ' + url + ' ' + ID);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // panel-heading
      // console.log(body);
      // console.log(typeof body);
      body = body.replace(/\<br\>/g, 'THISISANEWLINE');
      body = body.replace(/\<\/p\>/g, 'THISISANEWLINE');
      // console.log(body);
      // console.log(ss);
      var $ = cheerio.load(body);
      if ($('title').text() == '出错了！ | CODEVS 一个神奇的编程网站, Online Judge, 算法社区, 程序员求职与招聘平台') {
        console.log('Skipped url: %s', url);
        ++SkipNum;
      }
      console.log($('h3').children('b').text());
      // console.log($('h3').hasClass('m-t'));
      // var Content = $('.col-lg-9').children('.panel-heading').text();
      // console.log($('.col-lg-9').children('.panel').children('.panel-heading').text());
      /*console.log($('.col-lg-9').children('.panel').text());*/
      var contentList = ''
      $('.col-lg-9').children('.panel').each(function(i, elem) {
        contentList += '## ' + $(this).children('.panel-heading').children('span').
        children('small').text() +'\n' +
         $(this).children('.panel-body').children('p').text() + '\n';
      });
      // console.log(contentList);
      // console.log(typeof contentList);
      contentList = contentList.replace(/THISISANEWLINE/g, '<br>');
      // console.log(contentList);
      var fileName = process.cwd() + '/problems/' + String(ID) + '.md';
      console.log(fileName);
      fs.writeFile(fileName, contentList, 'utf8', function (err) {
        if (err) throw err;
        console.log('Saved: ', fileName);
      })
      /*$('.col-lg-9').children().each(function (i, elem) {
        console.log($(this).text());
        console.log('wtf');
      })*/
      // $('.col-lg-9').children('panel').children('.panel-heading').text();
      // console.log(Content.children().text());
      // console.log(Content.children('.panel-body').text());
      // console.log('Finished url: %s', url);
      ++FinishedNum;
    } else {
      if (response) console.error('got error on url: ', url, ' ', String(response.statusCode));
      else console.log('no response on url: ', url);
      if (error) console.log('err: ', error);
      ++ErrorNum;
    }
  })
}

function getContent(name) {
  var basUrl = 'http://www.24oi.cf', problemMAXID = 1024;
  SkipNum = 0, FinishedNum = 0, ErrorNum = 0;
  if (name == 'codevs') {
    basUrl = 'http://codevs.cn/problem/';
    problemMAXID = 4558;
  }
  var stNum = 1000;
  var mkdir = process.cwd() + '/problems/';
  if (!fs.existsSync(mkdir)) fs.mkdirSync(mkdir);
  // var url = 'http://codevs.cn/problem/4558/'
  for (var curNum = stNum; curNum <= problemMAXID; ++curNum) {
    var url = basUrl + String(curNum);
    // console.log(url);
    // continue;
    args[curNum - stNum] = {name:url, id:curNum};
    sleep(500);
    getCodeVS(url, curNum);
  }
  console.log('Finished successfully.');
  // console.log(SkipNum, FinishedNum, ErrorNum);
  process.exit(0);
  // async.eachLimit(args, 20, function(item, callback) {
  //   getCodeVS(item.name, item.id);
  // }, function(err) {
  //   console.log('err: ' + err);
  // });

// console.log(args);
}

agent.get = function(name) {
  console.log('got name as %s', name);
  if (name == 'poj') {
    console.error('not supported yet');
    process.exit(0);
  }
  getContent(name);
}
module.exports = agent;