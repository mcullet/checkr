var fs = require('fs');
var util = require('util');

function account (jsonObj) {

	this.name = jsonObj.name;
	this.balance = jsonObj.balance;
	this.etf = jsonObj.etf;
}

//Saves object to JSON file
account.prototype.save = function() {

	var str = JSON.stringify(this);

	fs.writeFile('accountData.txt', str, function (err) {
  		if (err) return console.log(err);
  		console.log('account > accountData.txt');
	});

	return str;

}


account.load = function() {

	fs.readFile('accountData.txt', 'utf8', function (err,data) {
 	 if (err) {
    	return console.log(err);
  	}
  	console.log(data);
  	return data;
	});

}

exports.account = account;