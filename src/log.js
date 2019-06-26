import { createLogger, format, transports } from 'winston';
const { label, combine, timestamp, printf, colorize } = format;

const log = createLogger({
    format: combine(
        colorize({
            error: 'red',
            warning: 'yellow',
            info: 'green',
            verbose: 'white',
            debug: 'blue',
        }),
        label({
            label: 'Grouper',
        }),
        timestamp(),
        printf(({ level, message, label, timestamp}) => {
            return `${timestamp} [${label}] ${level}: ${message}`;
        })
    ),
    levels: {
        debug: 0,
        verbose: 1,
        info: 2,
        warning: 3,
        error: 4,
    },
    transports: [
        new transports.Console()
    ]
});

export default log;
