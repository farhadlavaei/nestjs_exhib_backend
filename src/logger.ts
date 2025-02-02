// src/logger.ts
import { createLogger, format, transports } from 'winston';
import * as path from 'path';

// Extended interface for FileTransport options to include the 'level' property
interface ExtendedFileTransportOptions extends transports.FileTransportOptions {
    level?: string;
}

const logger = createLogger({
    // Set the default log level for the logger
    level: 'info',
    format: format.combine(
        format.timestamp(), // Adds a timestamp to each log entry
        format.json()       // Formats log entries in JSON format
    ),
    transports: [
        // Console transport for outputting logs to the console
        new transports.Console(),
        // File transport for error logs with an explicit level property
        new transports.File({
            filename: path.join(__dirname, 'logs/error.log'),
            level: 'error',
        } as ExtendedFileTransportOptions),
        // File transport for all logs
        new transports.File({
            filename: path.join(__dirname, 'logs/all.log')
        })
    ],
});

export default logger;
