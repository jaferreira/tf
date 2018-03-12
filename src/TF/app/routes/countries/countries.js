module.exports.default = (router) => {

    var leagueController = require('../../Controllers/LeagueController');

    router.get("/countries/:country", (req, res) => {

        leagueController.get_country_leagues(req, res, function (info) {
            
            

            const data = {
                title: req.params.country,
                
                leagues: info.result.docs
            };

            data.leagues.forEach(element => {
                element.link = '/league/' + element.permalink;
            });


            req.vueOptions = {
                head: {
                    title: req.params.country
                }
            };
            res.renderVue("countries/country.vue", data, req.vueOptions);
        });
    });
};