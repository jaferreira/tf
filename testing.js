var Nightmare = require('nightmare');
var vo = require('vo');
function testingNext(scraper, data, pageLeft, resolve) {

    console.log('Faltam ' + pageLeft)

    var exist = true;
    if (pageLeft <= 0) {
        console.log('finish')
        scraper.end()
        return resolve(data)

    } 
    else {
        scraper.visible('li.pager-next')
            .then(function (item) {
                if (item) {
                    scraper
                        .click('li.pager-next > a')
                        .wait('.offer-item-details')
                        .evaluate(function () {
                            var items = [];
                            var rows = document.querySelectorAll('article.offer-item');
                            for (var i = 0, row; row = rows[i]; i++) {
                                var generalInfo = row.querySelectorAll('div.offer-item-details')[0];

                                var header = generalInfo.querySelectorAll('header.offer-item-header')[0],
                                    offerParams = generalInfo.querySelectorAll('ul.params')[0],
                                    price = offerParams.querySelectorAll('li.offer-item-price')[0].innerText.trim().replace(' ', ''),
                                    tipologia = offerParams.querySelectorAll('li.offer-item-rooms')[0].innerText,
                                    area = offerParams.querySelectorAll('li.offer-item-area')[0].innerText;

                                data = {
                                    text: header.innerText,
                                    tagline: header.querySelectorAll('p.text-nowrap')[0].innerHTML,
                                    link: generalInfo.querySelectorAll("h3 > a")[0].getAttribute('href'),
                                    imageLink: row.querySelectorAll('figure.offer-item-image > a > span.img-cover')[0].style.backgroundImage.replace("url(", "").replace(")", "").replace(/\"/g, ""),
                                    price: price,
                                    priceInt: parseInt(price),
                                    tipologia: tipologia,
                                    area: area,
                                    areaInt: parseInt(area),
                                    description: '',
                                    location: '',
                                    labels: ["imovirtual"]
                                };
                                data.id = data.link.split('/').reverse()[1];
                                data.labels.push("euro" + data.priceInt);
                                data.labels.push(data.tipologia.toLowerCase());
                                data.labels.sort();


                                items.push(data);
                            }

                            return items;
                        })

                        .then(function (item) {

                            data.push(item)
                            pageLeft--;
                            testingNext(scraper, data, pageLeft, resolve)
                        }

                        )
                }
                else {
                    console.log('finish')
                    scraper.end()
                    return resolve(data)
                }
            })

    }




}

var maxPage = 30;

function stats(file) {
    console.log(file);
    console.log('stats')
    return new Promise(function (resolve, reject) {
        console.log('testing promise')
        var data = [];
        var scraper = new Nightmare({
            show: false, webPreferences: {
                images: false
            }
        });
        scraper
            .goto(file)

            .evaluate(function () {
                var items = [];
                var rows = document.querySelectorAll('article.offer-item');
                for (var i = 0, row; row = rows[i]; i++) {
                    var generalInfo = row.querySelectorAll('div.offer-item-details')[0];

                    var header = generalInfo.querySelectorAll('header.offer-item-header')[0],
                        offerParams = generalInfo.querySelectorAll('ul.params')[0],
                        price = offerParams.querySelectorAll('li.offer-item-price')[0].innerText.trim().replace(' ', ''),
                        tipologia = offerParams.querySelectorAll('li.offer-item-rooms')[0].innerText,
                        area = offerParams.querySelectorAll('li.offer-item-area')[0].innerText;

                    data = {
                        text: header.innerText,
                        tagline: header.querySelectorAll('p.text-nowrap')[0].innerHTML,
                        link: generalInfo.querySelectorAll("h3 > a")[0].getAttribute('href'),
                        imageLink: row.querySelectorAll('figure.offer-item-image > a > span.img-cover')[0].style.backgroundImage.replace("url(", "").replace(")", "").replace(/\"/g, ""),
                        price: price,
                        priceInt: parseInt(price),
                        tipologia: tipologia,
                        area: area,
                        areaInt: parseInt(area),
                        description: '',
                        location: '',
                        labels: ["imovirtual"]
                    };
                    data.id = data.link.split('/').reverse()[1];
                    data.labels.push("euro" + data.priceInt);
                    data.labels.push(data.tipologia.toLowerCase());
                    data.labels.sort();


                    items.push(data);
                }

                return items;
            })

            .then(function (item) {
                console.log('then')
                data.push(item)
                testingNext(scraper, data,1, resolve)
            })



    })
}
function testing() {
    console.log('start')
    startDate = new Date();
    var url = [];
    




//     var defaultUrl = 'https://www.imovirtual.com/comprar/apartamento/?page=';
//     for (var index = 1; index <= 500; index += 50) {

//         url.push(stats(defaultUrl + index))

//     }
    Promise.all([stats("https://www.onlinebettingacademy.com/stats/basketball/match/detroit-pistons-vs-boston-celtics/244802/stats")])
   .catch((err) => console.log(err))
        .then((data) => {
            var end = new Date() - startDate;
            console.info("Total: %dms", end);

            console.log(JSON.stringify(data))

        })
        
}

var startDate;



vo(testing)(function (err, titles) {

     console.log('hello');
 });