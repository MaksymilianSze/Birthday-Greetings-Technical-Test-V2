import pino from "pino";
import pinoPretty from "pino-pretty";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

export default logger;
