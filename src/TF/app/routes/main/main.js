// 

module.exports.default = (router) => {
    router.get("/", (req, res) => {
        const data = {
            title: "TF",
            countries: [
                {name: 'England', link: '/countries/England'},
                {name: 'Portugal', link: '/countries/Portugal'}]
        };
        const vueOptions = {
            head: {
                title: "TF"
            }
        };
        res.renderVue("main/main.vue", data, vueOptions);
    });
};