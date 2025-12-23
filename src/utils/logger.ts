import { consoleTransport, logger } from "react-native-logs";

const config = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: process.env.NODE_ENV === "production" ? "error" : "debug",
  transport: consoleTransport, // You can swap this for file or network transports later
  transportOptions: {
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    } as const,
  },
};

export const log = logger.createLogger(config);
