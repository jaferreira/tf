const BaseController = require('../Controllers/baseController')
var logger = require('../Logger.js'),
    mongoose = require('mongoose'),

    TeamInfo = mongoose.model('Teams'),
    TeamsToScrap = mongoose.model('TeamsToScrap'),

    async = require('async'),
    responseModel = require('./Response.js');

class TeamsController extends BaseController {

    constructor() {
        super();
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    get_teams(req, res) {

        var filter = {

        };

        var options = {
            page: 1,
            limit: 100,
            sort: {
                createdAt: -1
            }
        };

        TeamInfo
            .paginate(filter, options)
            .then(result => {
                return res.json(responseModel.successResponse(result));
            })
            .catch(error => {
                logger.error(error);
                return res.json(responseModel.errorResponse(error));
            });
    }

    /**
     * 
     * @param {*} req Request
     * @param {*} res Response
     */
    get_team(req, res) {

        var filter = {
            permalink: req.params.permalink
        };

        var options = {
            page: 1,
            limit: 100,
            sort: {
                createdAt: -1
            }
        };

        TeamInfo
            .paginate(filter, options)
            .then(result => {
                if (result.total == 0)
                    return res.json(responseModel.successResponse(null));
                else {
                    var doc = responseModel.successResponse(result.docs[0]);

                    var newDoc = {
                        success: true,
                        result: {
                            teamInfo: doc.result.teamInfo,
                            squad: doc.result.squad,
                            topScores: doc.result.topScores,
                            createdAt: doc.result.createdAt,
                            country: doc.result.country,
                            name: doc.result.name,
                            permalink: doc.result.permalink,
                            nextGame: {
                                awayLineup: [
                                    {
                                        left: "",
                                        name: "Pickford",
                                        right: "30.3636px",
                                        top: "174.5px"
                                    },
                                    {
                                        left: "",
                                        name: "Baines",
                                        right: "91.0909px",
                                        top: "275.136px"
                                    },
                                    {
                                        left: "",
                                        name: "Jagielka",
                                        right: "91.0909px",
                                        top: "208.045px"
                                    },
                                    {
                                        left: "",
                                        name: "Keane",
                                        right: "91.0909px",
                                        top: "140.955px"
                                    },
                                    {
                                        left: "",
                                        name: "Coleman",
                                        right: "91.0909px",
                                        top: "73.8636px"
                                    },
                                    {
                                        left: "",
                                        name: "Davies",
                                        right: "151.818px",
                                        top: "208.045px"
                                    },
                                    {
                                        left: "",
                                        name: "Gueye",
                                        right: "151.818px",
                                        top: "140.955px"
                                    },
                                    {
                                        left: "",
                                        name: "Bolasie",
                                        right: "212.545px",
                                        top: "241.591px"
                                    },
                                    {
                                        left: "",
                                        name: "Rooney",
                                        right: "212.545px",
                                        top: "174.5px"
                                    },
                                    {
                                        left: "",
                                        name: "Walcott",
                                        right: "212.545px",
                                        top: "107.409px"
                                    },
                                    {
                                        left: "",
                                        name: "Tosun",
                                        right: "273.273px",
                                        top: "174.5px"
                                    }
                                ],
                                awayNews: [
                                    {
                                        text: "Gylfi Sigurdsson is sidelined for up to eight weeks, joining Eliaquim Mangala, Maarten Stekelenburg and James McCarthy on the sidelines for Everton this weekend."
                                    },
                                    {
                                        text: "Theo Walcott picked up a calf injury last weekend and remains a doubt for the away side, though Sam Allardyce will hope to have his January arrival available here."
                                    },
                                    {
                                        text: "Ashley Williams serves the second of a three-match suspension against Stoke, meaning Michael Keane and Phil Jagielka should continue at centre back."
                                    },
                                    {
                                        text: "Leighton Baines made his first appearance since the end of November last weekend and was named the WhoScored Man of the Match. He should continue here."
                                    },
                                    {
                                        text: "Wayne Rooney will hope to move further forward to cover for Sigurdsson's absence, which should pave the way for Idrissa Gueye to return."
                                    },
                                    {
                                        text: "Morgan Schneiderlin and Idrissa Gueye missed the 2-0 win over Brighton last weekend because of illness and they remains doubts for the Toffees."
                                    }
                                ],
                                homeLineup: [
                                    {
                                        left: "30.3636px",
                                        name: "Butland",
                                        right: "",
                                        top: "174.5px"
                                    },
                                    {
                                        left: "91.0909px",
                                        name: "Stafylidis",
                                        right: "",
                                        top: "73.8636px"
                                    },
                                    {
                                        left: "91.0909px",
                                        name: "Zouma",
                                        right: "",
                                        top: "140.955px"
                                    },
                                    {
                                        left: "91.0909px",
                                        name: "Shawcross",
                                        right: "",
                                        top: "208.045px"
                                    },
                                    {
                                        left: "91.0909px",
                                        name: "Bauer",
                                        right: "",
                                        top: "275.136px"
                                    },
                                    {
                                        left: "151.818px",
                                        name: "Ndiaye",
                                        right: "",
                                        top: "140.955px"
                                    },
                                    {
                                        left: "151.818px",
                                        name: "Cameron",
                                        right: "",
                                        top: "208.045px"
                                    },
                                    {
                                        left: "212.545px",
                                        name: "Choupo-Moting",
                                        right: "",
                                        top: "107.409px"
                                    },
                                    {
                                        left: "212.545px",
                                        name: "Allen",
                                        right: "",
                                        top: "174.5px"
                                    },
                                    {
                                        left: "212.545px",
                                        name: "Shaqiri",
                                        right: "",
                                        top: "241.591px"
                                    },
                                    {
                                        left: "273.273px",
                                        name: "Crouch",
                                        right: "",
                                        top: "174.5px"
                                    }
                                ],
                                homeNews: [
                                    {
                                        text: "Jese made his first start since October in Stoke's 2-0 defeat at home to Manchester City on Monday but is expected to return to the bench here."
                                    },
                                    {
                                        text: "Ryan Shawcross will hope to be fit enough to start this match after only making the bench in Stoke's last two matches. Kevin Wimmer is also a doubt for the home side."
                                    },
                                    {
                                        text: "Mame Biram Diouf, Lee Grant and Stephen Ireland are ruled out for the Potters when they welcome Everton on Saturday."
                                    }
                                ],
                                missingAwayPlayers: [
                                    {
                                        name: "James McCarthy",
                                        reason: "injured",
                                        status: "Out"
                                    },
                                    {
                                        name: "Maarten Stekelenburg",
                                        reason: "injured",
                                        status: "Out"
                                    },
                                    {
                                        name: "Eliaquim Mangala",
                                        reason: "injured",
                                        status: "Out"
                                    },
                                    {
                                        name: "Gylfi Sigurdsson",
                                        reason: "injured",
                                        status: "Out"
                                    },
                                    {
                                        name: "Ashley Williams",
                                        reason: "suspended",
                                        status: "Out"
                                    },
                                    {
                                        name: "Idrissa Gueye",
                                        reason: "unfit",
                                        status: "Doubtful"
                                    },
                                    {
                                        name: "Morgan Schneiderlin",
                                        reason: "unfit",
                                        status: "Doubtful"
                                    },
                                    {
                                        name: "Theo Walcott",
                                        reason: "injured doubtful",
                                        status: "Doubtful"
                                    }
                                ],
                                missingHomePlayers: [
                                    {
                                        name: "Stephen Ireland",
                                        reason: "injured",
                                        status: "Out"
                                    },
                                    {
                                        name: "Lee Grant",
                                        reason: "injured",
                                        status: "Out"
                                    },
                                    {
                                        name: "Mame Biram Diouf",
                                        reason: "injured",
                                        status: "Out"
                                    },
                                    {
                                        name: "Kevin Wimmer",
                                        reason: "unfit",
                                        status: "Doubtful"
                                    },
                                    {
                                        name: "Ryan Shawcross",
                                        reason: "injured doubtful",
                                        status: "Doubtful"
                                    }
                                ]
                            }
                        }
                    }

                    return res.json(newDoc);
                }
            })
            .catch(error => {
                logger.error(error);
                return res.json(responseModel.errorResponse(error));
            });
    }


    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    get_pending_teams_to_scrap(req, res) {

        var requestBody = req.body;

        var now = new Date();
        var filter = {
            nextScrapAt: { "$lte": now }
        };

        var options = {
            page: 1,
            limit: 10,
            sort: {
                createdAt: -1
            }
        };

        if (requestBody) {
            logger.debug('Aplying custom parameters');
            //
            // page:
            // pageSize:
            // 
            //
            if (requestBody.page) {
                options.page = requestBody.page;
                logger.debug('Aplying custom page: ' + requestBody.page);
            }
            if (requestBody.pageSize) {
                options.limit = requestBody.pageSize;
                logger.debug('Aplying custom pageSize: ' + requestBody.pageSize);
            }
        }

        TeamsToScrap.paginate(
            filter,
            options,
            function (err, data) {
                if (err) {
                    logger.error(err);
                    return res.status(500).json(responseModel.errorResponse(err));
                }
                return res.json(responseModel.successResponse(data));
            });
    }


    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    get_pending_team_games_to_scrap(req, res) {
        var requestBody = req.body;

        var now = new Date();
        var filter = {
            nextGameScrapAt: { "$lte": now }
        };

        var options = {
            page: 1,
            limit: 10,
            sort: {
                createdAt: -1
            },
            select: {
                permalink: 1,
                name: 1,
                nextGame: 1
            }
        };

        if (requestBody) {
            //
            // page:
            // pageSize:
            // 
            //
            if (requestBody.page) {
                options.page = requestBody.page;
                logger.debug('Aplying custom page: ' + requestBody.page);
            }
            if (requestBody.pageSize) {
                options.limit = requestBody.pageSize;
                logger.debug('Aplying custom pageSize: ' + requestBody.pageSize);
            }
        }

        TeamsToScrap.paginate(
            filter,
            options,
            function (err, data) {
                if (err) {
                    logger.error(err);
                    return res.status(500).json(responseModel.errorResponse(err));
                }
                return res.json(responseModel.successResponse(data));
            });
    }


    /**
    * 
    * @param {*} req 
    * @param {*} res 
    */
    reset_teams_to_scrap(req, res) {

        var now = new Date();
        TeamsToScrap.update({}, { nextScrapAt: now }, { multi: true },
            function (err, num) {
                if (err) {
                    logger.error(err);
                    return res.json(responseModel.errorResponse(err));
                }
                logger.info('Reset Next Scrap Date for ' + num + ' teams.');
                return res.json(responseModel.successResponse());
            });
    }



    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    save_team_scrap_info(req, res) {

        var dicionario = [{
            sofaProviderName: 'SofaScore',
            sofaTeamId: '17',
            sofaTeamName: 'Manchester City',
            sofaTeamLink: 'https://www.sofascore.com/team/football/manchester-city/17',

            whoScoredProviderName: 'WhoScored',
            whoTeamId: '167',
            whoTeamName: 'Manchester City',
            whoTeamLink: 'https://www.whoscored.com/Teams/167/Show/England-Manchester-City',
        },
        {
            sofaProviderName: 'SofaScore',
            sofaTeamId: '48',
            sofaTeamName: 'Everton',
            sofaTeamLink: 'https://www.sofascore.com/team/football/everton/48',

            whoScoredProviderName: 'WhoScored',
            whoTeamId: '34',
            whoTeamName: 'Everton',
            whoTeamLink: 'https://www.whoscored.com/Teams/31/Show/England-Everton',
        },
        {
            sofaProviderName: 'SofaScore',
            sofaTeamId: '29',
            sofaTeamName: 'Stoke City',
            sofaTeamLink: 'https://www.sofascore.com/team/football/stoke-city/29',

            whoScoredProviderName: 'WhoScored',
            whoTeamId: '96',
            whoTeamName: 'Stoke',
            whoTeamLink: 'https://www.whoscored.com/Teams/96/Show/England-Stoke',
        },
        {
            sofaProviderName: 'SofaScore',
            sofaTeamId: '84',
            sofaTeamName: 'Doncaster Rovers',
            sofaTeamLink: 'https://www.sofascore.com/team/football/doncaster-rovers/84',
        
            whoScoredProviderName: 'WhoScored',
            whoTeamId: '910',
            whoTeamName: 'Doncaster',
            whoTeamLink: 'https://www.whoscored.com/Teams/910/Show/England-Doncaster',
        },
        {
            sofaProviderName: 'SofaScore',
            sofaTeamId: '84',
            sofaTeamName: 'Bradford City',
            sofaTeamLink: 'https://www.sofascore.com/team/football/bradford-city/22',
        
            whoScoredProviderName: 'WhoScored',
            whoTeamId: '22',
            whoTeamName: 'Bradford',
            whoTeamLink: 'https://www.whoscored.com/Teams/22/Show/England-Bradford',
        }];

        var teamsData = req.body;

        var ids = [];
        logger.info('Saving ' + teamsData.length + ' teams:');
        var nextGames = [];
        teamsData.forEach(team => {
            if (!team.name || !team.country) {
                logger.info(' » A team has no required data! (skip item)');
            } else {
                ids.push(team.permalink);
                logger.info(' » (' + team.country + ') ' + team.name + ' » ' + team.permalink);
            }
            // var n = 'nextGame';
            // team[n] = {
            //     awayLineup: [
            //         {
            //             left: "",
            //             name: "Pickford",
            //             right: "30.3636px",
            //             top: "174.5px"
            //         },
            //         {
            //             left: "",
            //             name: "Baines",
            //             right: "91.0909px",
            //             top: "275.136px"
            //         },
            //         {
            //             left: "",
            //             name: "Jagielka",
            //             right: "91.0909px",
            //             top: "208.045px"
            //         },
            //         {
            //             left: "",
            //             name: "Keane",
            //             right: "91.0909px",
            //             top: "140.955px"
            //         },
            //         {
            //             left: "",
            //             name: "Coleman",
            //             right: "91.0909px",
            //             top: "73.8636px"
            //         },
            //         {
            //             left: "",
            //             name: "Davies",
            //             right: "151.818px",
            //             top: "208.045px"
            //         },
            //         {
            //             left: "",
            //             name: "Gueye",
            //             right: "151.818px",
            //             top: "140.955px"
            //         },
            //         {
            //             left: "",
            //             name: "Bolasie",
            //             right: "212.545px",
            //             top: "241.591px"
            //         },
            //         {
            //             left: "",
            //             name: "Rooney",
            //             right: "212.545px",
            //             top: "174.5px"
            //         },
            //         {
            //             left: "",
            //             name: "Walcott",
            //             right: "212.545px",
            //             top: "107.409px"
            //         },
            //         {
            //             left: "",
            //             name: "Tosun",
            //             right: "273.273px",
            //             top: "174.5px"
            //         }
            //     ],
            //     awayNews: [
            //         {
            //             text: "Gylfi Sigurdsson is sidelined for up to eight weeks, joining Eliaquim Mangala, Maarten Stekelenburg and James McCarthy on the sidelines for Everton this weekend."
            //         },
            //         {
            //             text: "Theo Walcott picked up a calf injury last weekend and remains a doubt for the away side, though Sam Allardyce will hope to have his January arrival available here."
            //         },
            //         {
            //             text: "Ashley Williams serves the second of a three-match suspension against Stoke, meaning Michael Keane and Phil Jagielka should continue at centre back."
            //         },
            //         {
            //             text: "Leighton Baines made his first appearance since the end of November last weekend and was named the WhoScored Man of the Match. He should continue here."
            //         },
            //         {
            //             text: "Wayne Rooney will hope to move further forward to cover for Sigurdsson's absence, which should pave the way for Idrissa Gueye to return."
            //         },
            //         {
            //             text: "Morgan Schneiderlin and Idrissa Gueye missed the 2-0 win over Brighton last weekend because of illness and they remains doubts for the Toffees."
            //         }
            //     ],
            //     homeLineup: [
            //         {
            //             left: "30.3636px",
            //             name: "Butland",
            //             right: "",
            //             top: "174.5px"
            //         },
            //         {
            //             left: "91.0909px",
            //             name: "Stafylidis",
            //             right: "",
            //             top: "73.8636px"
            //         },
            //         {
            //             left: "91.0909px",
            //             name: "Zouma",
            //             right: "",
            //             top: "140.955px"
            //         },
            //         {
            //             left: "91.0909px",
            //             name: "Shawcross",
            //             right: "",
            //             top: "208.045px"
            //         },
            //         {
            //             left: "91.0909px",
            //             name: "Bauer",
            //             right: "",
            //             top: "275.136px"
            //         },
            //         {
            //             left: "151.818px",
            //             name: "Ndiaye",
            //             right: "",
            //             top: "140.955px"
            //         },
            //         {
            //             left: "151.818px",
            //             name: "Cameron",
            //             right: "",
            //             top: "208.045px"
            //         },
            //         {
            //             left: "212.545px",
            //             name: "Choupo-Moting",
            //             right: "",
            //             top: "107.409px"
            //         },
            //         {
            //             left: "212.545px",
            //             name: "Allen",
            //             right: "",
            //             top: "174.5px"
            //         },
            //         {
            //             left: "212.545px",
            //             name: "Shaqiri",
            //             right: "",
            //             top: "241.591px"
            //         },
            //         {
            //             left: "273.273px",
            //             name: "Crouch",
            //             right: "",
            //             top: "174.5px"
            //         }
            //     ],
            //     homeNews: [
            //         {
            //             text: "Jese made his first start since October in Stoke's 2-0 defeat at home to Manchester City on Monday but is expected to return to the bench here."
            //         },
            //         {
            //             text: "Ryan Shawcross will hope to be fit enough to start this match after only making the bench in Stoke's last two matches. Kevin Wimmer is also a doubt for the home side."
            //         },
            //         {
            //             text: "Mame Biram Diouf, Lee Grant and Stephen Ireland are ruled out for the Potters when they welcome Everton on Saturday."
            //         }
            //     ],
            //     missingAwayPlayers: [
            //         {
            //             name: "James McCarthy",
            //             reason: "injured",
            //             status: "Out"
            //         },
            //         {
            //             name: "Maarten Stekelenburg",
            //             reason: "injured",
            //             status: "Out"
            //         },
            //         {
            //             name: "Eliaquim Mangala",
            //             reason: "injured",
            //             status: "Out"
            //         },
            //         {
            //             name: "Gylfi Sigurdsson",
            //             reason: "injured",
            //             status: "Out"
            //         },
            //         {
            //             name: "Ashley Williams",
            //             reason: "suspended",
            //             status: "Out"
            //         },
            //         {
            //             name: "Idrissa Gueye",
            //             reason: "unfit",
            //             status: "Doubtful"
            //         },
            //         {
            //             name: "Morgan Schneiderlin",
            //             reason: "unfit",
            //             status: "Doubtful"
            //         },
            //         {
            //             name: "Theo Walcott",
            //             reason: "injured doubtful",
            //             status: "Doubtful"
            //         }
            //     ],
            //     missingHomePlayers: [
            //         {
            //             name: "Stephen Ireland",
            //             reason: "injured",
            //             status: "Out"
            //         },
            //         {
            //             name: "Lee Grant",
            //             reason: "injured",
            //             status: "Out"
            //         },
            //         {
            //             name: "Mame Biram Diouf",
            //             reason: "injured",
            //             status: "Out"
            //         },
            //         {
            //             name: "Kevin Wimmer",
            //             reason: "unfit",
            //             status: "Doubtful"
            //         },
            //         {
            //             name: "Ryan Shawcross",
            //             reason: "injured doubtful",
            //             status: "Doubtful"
            //         }
            //     ]
            // };

            // SETTING GAMES TO BE SCRAPED
            if (team.nextGame) {
                // if (!team.nextGame.date || !team.nextGame.homeTeam || !team.nextGame.awayTeam) {
                //     logger.debug(`» ${team.name}: There is no next game required information (date/home/away).`);
                // } else {
                var nextGameDate = new Date(team.nextGame.date);

                var homeTeamArray = dicionario.filter(function (el) {
                    return el.sofaTeamName == team.nextGame.homeTeam;
                });
                var awayTeamArray = dicionario.filter(function (el) {
                    return el.sofaTeamName == team.nextGame.awayTeam;
                });

                logger.debug('Home Maped Team: ' + JSON.stringify(homeTeamArray));
                logger.debug('Away Maped Team: ' + JSON.stringify(awayTeamArray));

                if (homeTeamArray.length > 0 && awayTeamArray.length > 0) {

                    nextGames.push({
                        date: team.nextGame.date,

                        permalink: team.permalink,

                        provider: 'WhoScored',
                        homeTeamLink: homeTeamArray[0].whoTeamLink,
                        homeTeamName: homeTeamArray[0].whoTeamName,

                        awayTeamLink: awayTeamArray[0].whoTeamLink,
                        awayTeamName: awayTeamArray[0].whoTeamName
                    });
                }
                else {
                    logger.debug('Teams no found in dictionary!');
                }
                // }
                // else {

                // }
            }
            else {
                logger.debug(`» ${team.name}: There is no next game defined.`);
            }
        });

        TeamsToScrap.find({
            permalink: {
                $in: ids
            }
        }, function (err, dbTeamsToScrap) {
            if (err) {
                logger.error(err);
                return res.status(500).json(responseModel.errorResponse(err));
            }
            logger.info('Got ' + dbTeamsToScrap.length + ' TeamsToScrap from db');
            if (dbTeamsToScrap.length == 0) {
                logger.info('Nothing to do...returning "204 No Content".');
                return res.status(204).json(responseModel.errorResponse('Found no teams to update.'));
            }

            // UPDATE Next Scrap Date
            dbTeamsToScrap.forEach(teamInfo => {
                var newArray = teamsData.filter(function (el) {
                    return el.permalink == teamInfo.permalink;
                });

                if (newArray.length > 0) {
                    teamInfo.nextScrapAt = newArray[0].nextScrapAt;
                    if (teamInfo.nextScrapAt)
                        logger.info('New scrap date: ' + teamInfo.nextScrapAt);
                    else {
                        var nextScrapDateDefault = new Date();
                        teamInfo.nextScrapAt = nextScrapDateDefault;
                        logger.console.warn('The scrap date received is null, going to set next scrap date to: ' + nextScrapDateDefault);
                    }
                }


                var nextGameArray = nextGames.filter(function (el) {
                    return el.permalink == teamInfo.permalink;
                });

                if (nextGameArray.length > 0) {
                    console.log(' - NextGameScrapDate for ' + teamInfo.name);
                    teamInfo.nextGameScrapAt = new Date();
                    teamInfo.nextGame = {
                        date: nextGameArray[0].date,
                        provider: nextGameArray[0].provider,
                        homeTeamName: nextGameArray[0].homeTeamName,
                        homeTeamLink: nextGameArray[0].homeTeamLink,
                        awayTeamName: nextGameArray[0].awayTeamName,
                        awayTeamLink: nextGameArray[0].awayTeamLink
                    };
                }
            });

            const matchFields = ['permalink'];


            var result2 = TeamInfo.upsertMany(teamsData, matchFields);
            logger.info('Team info data succesfully saved for ' + teamsData.length + ' teams.');


            var result3 = TeamsToScrap.upsertMany(dbTeamsToScrap, matchFields);
            logger.info('Updated TeamsToScrap info with nextScrapAt.');









            return res.json(responseModel.successResponse());
        });
    }


    save_team_game_scrap_info(req, res) {

    }
}

module.exports = TeamsController