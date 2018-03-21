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

                    return res.json(doc);
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
            limit: 1,
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
            limit: 1,
            sort: {
                createdAt: -1
            }
        };



        TeamsToScrap.paginate(
            filter,
            options,
            function (err, data) {
                if (err) {
                    logger.error(err);
                    return res.status(500).json(responseModel.errorResponse(err));
                }

                var gamesArray = [];
                data.docs.forEach(doc => {
                    if (doc.nextGame)
                        gamesArray.push({ team: doc.permalink, nextGame: doc.nextGame });
                });
                return res.json(responseModel.successResponse(gamesArray));
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