

module.exports.default = (router) => {
    var leagueController = require('../../Controllers/LeagueController');

    router.get("/", (req, res) => {

        leagueController.get_countries(req, res, function (info){
            console.log(info);
            const data = {
                title: "TF",
                countries: info.result
            };
            const vueOptions = {
                head: {
                    title: "TF"
                }
            };
            res.renderVue("main/main.vue", data, vueOptions);
        });
    });

    
};