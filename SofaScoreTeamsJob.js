var nightmare = require('nightmare');

module.exports = {
    scrapTeams: function* run(linksToScrap) {
         nbot = nightmare({
            show: true
        });
        
        
         z = 0;
         results = yield* running(linksToScrap);
        return nbot;
    }


}

function* running(links) {
   
    
    var results = [];
    for (i = 0; i < links.length; i++) {
        console.log('teste')
        results.push(yield* scrapTeamInfo(links[i]));
    }
    console.log(JSON.stringify(results));
    //return results;

}

function* scrapTeamInfo(link) {
  
   
     var value = yield nbot
     .useragent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36')
    .goto(link)
  
    .evaluate(function () {
       


        return $('h2.page-title')[0].innerText.trim();
         
    })
   
    
   
    return value;

}
