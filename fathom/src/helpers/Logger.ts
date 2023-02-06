import React from "react";

export enum LogLevel {
  info,
  error,
  debug,
}

export class Logger {
  log = (level: LogLevel, msg: string) => {
    console.log(`${msg}`);
  };
}

const LoggerContext = React.createContext(new Logger());

// this will be the function available for the app to connect to the stores
export const useLogger = () => React.useContext(LoggerContext);
