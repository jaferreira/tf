var Nightmare = require('nightmare');
var vo = require('vo');


function Status() {
    var scraper = new Nightmare({
        show: false, webPreferences: {
            images: false
        }
    });
    console.log('start')
    scraper
        .goto('https://www.google.com')

        .evaluate(function () {
           return document.querySelectorAll('div')[0].innerText
        })

        .then(function(log){
            console.log(log)
        })

}

vo(Status)(function (err, titles) {


    console.log('hello');
});