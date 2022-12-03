// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require('chalk');

enum LogLevel {
  Success = 'success',
  Info = 'info',
  Error = 'error',
  Warning = 'warning',
  Trace = 'trace',
  Debug = 'debug',
}

export class Logger {
  constructor(private readonly className?: string) {}

  private log(message: any, level: LogLevel, optionalJson?: any[]) {
    let prependedInfo: string;
    let logger = console.log;

    switch (level) {
      case LogLevel.Success:
        logger = console.log;
        prependedInfo = '[SUCCESS]';

        prependedInfo = this.className
          ? chalk.green(`${prependedInfo} [${this.className}] `)
          : `${prependedInfo} `;
        break;
      case LogLevel.Info:
        logger = console.info;
        prependedInfo = '[INFO]';

        prependedInfo = this.className
          ? chalk.blue(`${prependedInfo} [${this.className}] `)
          : `${prependedInfo} `;
        break;
      case LogLevel.Trace:
        logger = console.trace;
        prependedInfo = '[TRACE]';

        prependedInfo = this.className
          ? chalk.yellow(`${prependedInfo} [${this.className}] `)
          : `${prependedInfo} `;
        break;
      case LogLevel.Debug:
        logger = console.debug;
        prependedInfo = '[DEBUG]';

        prependedInfo = this.className
          ? chalk.yellow(`${prependedInfo} [${this.className}] `)
          : `${prependedInfo} `;
        break;
      case LogLevel.Warning:
        logger = console.warn;
        prependedInfo = '[WARNING]';

        prependedInfo = this.className
          ? chalk.yellow(`${prependedInfo} [${this.className}] `)
          : `${prependedInfo} `;
        break;
      case LogLevel.Error:
        logger = console.error;
        prependedInfo = '[ERROR]';

        prependedInfo = this.className
          ? chalk.red(`${prependedInfo} [${this.className}] `)
          : `${prependedInfo} `;
        break;
      default:
        return;
    }

    if (optionalJson !== undefined) {
      logger(prependedInfo + message, '\n', optionalJson, '\n\n');
    } else {
      logger(prependedInfo + message);
    }
  }

  success(message: any, optionalJson?: any) {
    this.log(message, LogLevel.Success, optionalJson);
  }

  info(message: any, optionalJson?: any) {
    this.log(message, LogLevel.Info, optionalJson);
  }

  trace(message: any, optionalJson?: any) {
    this.log(message, LogLevel.Trace, optionalJson);
  }

  debug(message: any, optionalJson?: any) {
    this.log(message, LogLevel.Debug, optionalJson);
  }

  warn(message: any, optionalJson?: any) {
    this.log(message, LogLevel.Warning, optionalJson);
  }

  error(message: any, optionalJson?: any) {
    this.log(message, LogLevel.Error, optionalJson);
  }
}
