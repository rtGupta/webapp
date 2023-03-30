import { createLogger, format, transports } from "winston";

const logger = createLogger({
transports:
    new transports.File({
    filename: '/home/ec2-user/.pm2/logs/webapp-out.log',
    format:format.combine(
        format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
        format.align(),
        format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    )}),
});

export default logger;