var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var mongoose = require ('mongoose');

mongoose.connect('mongodb://localhost/DATA');
var dataSchema = mongoose.Schema({
    TasaRM: String,
    Picoyplaca: String
});
var Data = mongoose.model('Data',dataSchema);


// set some defaults
req = request.defaults({
	jar: true,                 // save cookies to jar
	rejectUnauthorized: false, 
	followAllRedirects: true   // allow redirections
});

// scrape the page
req.get({
    url: "https://www.superfinanciera.gov.co",
    headers: {
        'User-Agent': 'Super Cool Browser' // optional headers
     }
  }, function(err, resp, body) {
	
	// load the html into cheerio
    var $ = cheerio.load(body);
    var TRM = $('.cont_Indicador table tbody tr:nth-child(2) td:nth-child(2)').first().text();

    console.log('Tasa de Recambio : ' + TRM);
    var DATOS =  Data({
                TasaRM:  TRM
            });
                DATOS.save(function (error){
                    if (error){
                console.log(error);
                }
});  

});

req.get({
    url: "http://www.calendariodecolombia.com/pico-y-placa/bogota",
    headers:{
        'User-Agent':'cOOL'
    }
},function(err, resp, body){
    var $ = cheerio.load(body);
    var PPC = $('.revolution-ch2 span').text();
    console.log('Pico y placa Bogota: ' + PPC);    
    var DATOS =  Data({
                Picoyplaca:  PPC
            });
     DATOS.save(function (error){
    if (error){
        console.log(error);
    }
});  
});
        


