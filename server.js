'use strict';

var express = require("express");
var path = require('path');
var compress = require('compression');
var bodyParser = require('body-parser');
var request = require("request");
var account = require('./account').account;
var unirest = require('unirest');
var fs = require('fs');
var util = require('util');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(compress());
app.set('port', (process.env.PORT || 5000));
//app.use(express.static(path.join(__dirname, 'public')));

var etfs = [{
        "name": "USMV",
        "description": "Index  of  low volatility US stocks with low varience. "
    },
    {
        "name": "IWF",
        "description": "Large and mid cap stocks with high growth and overall low volatility"
    },
    {
        "name": "VTV",
        "description": "Stocks from the top 85% of market cap with overall low volatility"
    },
    {
        "name": "XLP",
        "description": "Market cap weighted index of consumer staple stocks from the S&P 500"
    },
    {
        "name": "XLE",
        "description": " Market cap weighted index of energy stocks from the S&P 500"
    },
    {
        "name": "XLF",
        "description": " Market cap weighted index of financial stocks from the S&P 500"
    },
    {
        "name": "XLK",
        "description": " Market cap weighted index of technology stocks from the S&P 500"
    },
    {
        "name": "XLU",
        "description": " Market cap weighted index of utility stocks from the S&P 500"
    },
    {
        "name": "XBI",
        "description": " Basket of biotechnology stocks that perform similar to the sector as a whole"
    },
    {
        "name": "FDN",
        "description": "Basket of Technology stocks with a heavy emphasis on Facebook, Amazon, Google, and Netflix"
    },
    {
        "name": "SCHZ",
        "description": "Provides a diversified portfolio of taxable investment-grade bonds"
    },
    {
        "name": "QQQ",
        "description": "Weighted average of  the largest companies in the NASDAQ 100"
    },
    {
        "name": "DIA",
        "description": "Weighted average of 30 large market cap US stocks chosen by the Wall Street Journal"
    },
    {
        "name": "VTI",
        "description": "Weighted average of the US stock market as a whole"
    },
    {
        "name": "VEA",
        "description": "Weighted average of large stocks from foreign stocks"
    },
        { 
        "name" : "SDS", 
        "description" : "inverse leverage ETF for the S&P 500. -2 times the daily performance of the S&P 500 " 
    }, 
     { 
        "name" : "TQQQ", 
        "description" : "3X leveraged ETF comprised of weighted NASDAQ top 100 stocks" 
    }, 
    { 
        "name" : "DOG", 
        "description" : "Inverse exposure into the DOW Jones top 30 " 
    }, 
    { 
        "name" : "SH", 
        "description" : "Inverse exposure into the S&P 500" 
    }, 
    { 
        "name" : "STZ", 
        "description" : "Beer, Wine, and Spirits ETF" 
    }, 
    { 
        "name" : "UUP", 
        "description" : "Futures on the USD relative to world currencies" 
    }, 
    { 
        "name" : "COW", 
        "description" : "Futures based off of animal livestock" 
    }, 
    { 
        "name" : "GLD", 
        "description" : "Tracks gold prices by using gold bars hidden away in London vaults" 
    }, 
    { 
        "name" : "USO", 
        "description" : "Futures based on monthly WTI prices on oil" 
    },
    { 
        "name" : "RSX", 
        "description" : "weighted Russian companies based on market cap " 
    }, 
    { 
        "name" : "IEV", 
        "description" : "weighted 350 largest EU companies" 
    }, 
    { 
        "name" : "FXI", 
        "description" : "50 largest and most liquid Chinese stocks" 
    }, 
    { 
        "name" : "XLRE", 
        "description" : "market cap weighted index of real estate based stocks from the S&P 500" 
    }, 
    { 
        "name" : "XLB", 
        "description" : " market cap weighted index of materials based stocks from the S&P 500" 
    }, 
    { 
        "name" : "XLI", 
        "description" : " market cap weighted index of industrial based stocks from the S&P 500" 
    }, 
    { 
        "name" : "XLV", 
        "description" : " market cap weighted index of healthcare based stocks from the S&P 500" 
    }, 
    { 
        "name" : "XLY", 
        "description" : " market cap weighted index of consumer discretionary stocks like appliances and auto and apparel based stocks from the S&P 500" 
    }, 

]    



//console.log(sentiment("Great food. But it is way too expensive to eat there. I know we are far from the ocean and food cost is at a premium. but the reason I infrequently go back is the cost. it is nice to have that option in our neighborhood. College Park Maryland is that much more diverse and palate exciting the presence of fishnet."));
app.get('/', function(req, res) {
    res.sendFile('/public/FINRAHackathonHTMLComponent.html', {
  root: __dirname
  });
}) 

app.get('/myETFs', function(req, res) {
    res.sendFile('/public/MyETFs.html', {
  root: __dirname
  });
}) 

app.post('/saveAccount', function(req, res) {
    console.log(req.body)
    fs.writeFile('accountData.json', JSON.stringify(req.body), function (err) {
        if (err) return console.log(err);
        console.log('account > accountData.json');
    });
    res.send("Money received.")

})

app.get('/loadAccount', function(req, res) {

    fs.readFile('accountData.json', 'utf8', function (err,data) {
     if (err) {
        return console.log(err);
    }
    console.log(data);
    res.send(data);
    });
    

})

app.get('/getAllEtfs', function(req, res) {
    res.send(etfs);
})

app.get('/loadBalance', function(req, res) {
    
    var beers = 268.11/3;
    beers = beers.toString()
    res.send(beers);
});

app.get('/getEtf/:etf', function(req, res) {
    console.log(req.params.etf)
    var etf = req.params.etf
    
    unirest.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(" ' + etf + '")&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=')
    .end(function (response) {
        var price = response.body["query"]["results"]["quote"]["Bid"]
        console.log(price);
        res.send(price);
    })  
})

app.post('/addEtfToAccount/:etf', function(req, res) {
    fs.writeFile('accountData.json', JSON.stringify(req.body), function (err) {
        if (err) return console.log(err);
        console.log('account > accountData.json');
    });
    res.send("Money received.")
})



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


