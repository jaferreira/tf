var winston = require("winston");

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

var logger = winston.createLogger({
    level: 'info',
    format: combine(
        label({ label: 'Sportstats.API' }),
        timestamp(),
        myFormat
      ),
    transports: [
        new winston.transports.Console({
            colorize: true,
            prettyPrint: true
        }),
        //
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    ]
});


//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new winston.transports.Console({
//         // format: winston.format.simple()
//         format: combine(
//             label({ label: 'right meow!' }),
//             timestamp(),
//             prettyPrint()
//         )
//     }));
// }


module.exports = logger;