// 

module.exports.default = (router) => {
    router.get("/", (req, res) => {
        const data = {
            title: "TF is Online!",
            leagues: [{
                name: 'Premier League',
                permalink: '/league/PremierLeague'
            },
            {
                name: 'La Liga',
                permalink: '/league/LaLiga'
            }]
        };
        const vueOptions = {
            head: {
                title: "TF"
            }
        };
        res.renderVue("main/main.vue", data, vueOptions);
    });
};