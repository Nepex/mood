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

  /** Displays dev console messages. */
  private log(message: string, level: LogLevel, optionalJson?: any[]) {
    let prependedInfo: string;
    let color: string;
    let logger = console.log;

    switch (level) {
      case LogLevel.Success:
        logger = console.log;
        color = 'LightGreen';
        prependedInfo = '[SUCCESS]';
        break;
      case LogLevel.Info:
        logger = console.info;
        color = 'DodgerBlue';
        prependedInfo = '[INFO]';
        break;
      case LogLevel.Trace:
        logger = console.trace;
        color = 'LightBlue';
        prependedInfo = '[TRACE]';
        break;
      case LogLevel.Debug:
        logger = console.debug;
        color = 'LightCoral';
        prependedInfo = '[DEBUG]';
        break;
      case LogLevel.Warning:
        logger = console.warn;
        color = 'Orange';
        prependedInfo = '[WARNING]';
        break;
      case LogLevel.Error:
        logger = console.error;
        color = 'Red';
        prependedInfo = '[ERROR]';
        break;
      default:
        color = 'Black';
    }

    prependedInfo = this.className
      ? `${prependedInfo} [${this.className}] `
      : `${prependedInfo} `;

    if (optionalJson !== undefined) {
      logger(
        '%c' + prependedInfo + message,
        'color:' + color,
        '\n\n',
        optionalJson
      );
    } else {
      logger('%c' + prependedInfo + message, 'color:' + color);
    }
  }

  /** Displays a console success message. */
  success(message: string, optionalJson?: any) {
    this.log(message, LogLevel.Success, optionalJson);
  }

  /** Displays a console info message. */
  info(message: string, optionalJson?: any) {
    this.log(message, LogLevel.Info, optionalJson);
  }

  /** Displays console trace message, including a stack trace. */
  trace(message: string, optionalJson?: any) {
    this.log(message, LogLevel.Trace, optionalJson);
  }

  /** Displays a console debug message. */
  debug(message: string, optionalJson?: any) {
    this.log(message, LogLevel.Debug, optionalJson);
  }

  /** Raises a console warning and logs a message. */
  warn(message: string, optionalJson?: any) {
    this.log(message, LogLevel.Warning, optionalJson);
  }

  /** Throws a console error and logs a message. */
  error(message: string, optionalJson?: any) {
    this.log(message, LogLevel.Error, optionalJson);
  }
}
