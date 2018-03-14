module.exports.default = (router) => {

    var leagueController = require('../../Controllers/LeagueController');

    router.get("/league/:permalink", (req, res) => {

        leagueController.get_league_info(req, res, function (info) {
            
            console.log(info.result.standings[0].teamName);

            const data = {
                message: "POST",
                csrfToken: req.csrfToken(),
                
                title: info.result.name,
                subtitle: info.result.country,
                
                data: info.result,
                standings: info.result.standings
            };
            req.vueOptions = {
                head: {
                    title: info.result.name
                }
            };
            res.renderVue("leagues/league.vue", data, req.vueOptions);
        });
    });

    // router.post("/league", (req, res) => {
    //     const data = {
    //         message: "POST",
    //         body: req.body
    //     };
    //     res.json(data);
    // });
};