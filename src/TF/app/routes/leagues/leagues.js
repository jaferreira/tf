module.exports.default = (router) => {

    var leagueController = require('../../Controllers/LeagueController');

    router.get("/league/:permalink", (req, res) => {

        leagueController.get_league_info(req, res, function (info) {
            
            
            const data = {
                message: "POST",
                csrfToken: req.csrfToken(),
                
                title: info.result.docs[0].name,
                subtitle: info.result.docs[0].country,
                
                data: info.result.docs[0],
                standings: info.result.docs[0].standings
            };
            req.vueOptions = {
                head: {
                    title: info.result.docs[0].name
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