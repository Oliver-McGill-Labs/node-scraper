var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

//All the web scraping magic will happen here
app.get('/scrape', function(req, res){
  // Let's scrape the TLO and get the status of SB6
  url = 'http://www.capitol.state.tx.us/BillLookup/BillStages.aspx?LegSess=85R&Bill=SB6';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var title, author, status;
      var json = { title : "", author : "", status : ""};

      $('#usrBillInfoTabs_lblBill').filter(function(){
        var data = $(this);
        title = data.text().trim();
        json.title = title;
        console.log('The bill\'s title was ' + title);
      
      })

      $('#usrBillInfoTabs_lblItem2Data').filter(function(){
        var data = $(this);
        author = data.text().trim();
        json.author = author;
        console.log('The bill\'s author was ' + author);
      
      })

      $('.stageText').filter(function(){
        var data = $(this);
        
        status = data.text().trim(); 
      

        console.log('The bill\'s most recent status was ' + status);        
        json.status = status;
        
      })
    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    })

    res.send('Check your console!')
  })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;