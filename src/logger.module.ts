import { Module } from '@nestjs/common';
import { format, transports } from 'winston';
import { WinstonModule } from 'nest-winston';

// تعریف رابط گسترش یافته برای گزینه‌های FileTransport
interface ExtendedFileTransportOptions extends transports.FileTransportOptions {
  level?: string;
}

// تعریف رابط گسترش یافته برای گزینه‌های ConsoleTransport
interface ExtendedConsoleTransportOptions extends transports.ConsoleTransportOptions {
  level?: string;
}

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new transports.File({
          level: 'error', // اکنون مجاز است
          filename: 'error.log',
          format: format.combine(format.timestamp(), format.json()),
        } as ExtendedFileTransportOptions),
        new transports.Console({
          level: 'info', // همچنین برای Console
          format: format.combine(format.colorize(), format.simple()),
        } as ExtendedConsoleTransportOptions),
      ],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
