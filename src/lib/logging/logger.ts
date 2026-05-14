import pino from "pino";
import { getDb } from "@/lib/db/config";

export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  component: string;
}

let loggerInstance: pino.Logger | null = null;
let dbWriteQueue: Array<{
  timestamp: string;
  level: string;
  message: string;
  component: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  errorStack?: string;
  requestId?: string;
}> = [];

const pinoLogger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      singleLine: false,
    },
  },
});

function getLogger(): pino.Logger {
  if (!loggerInstance) {
    loggerInstance = pinoLogger;
  }
  return loggerInstance;
}

async function flushLogsToDatabase() {
  if (dbWriteQueue.length === 0) return;

  const logsToWrite = [...dbWriteQueue];
  dbWriteQueue = [];

  try {
    const db = getDb();
    for (const log of logsToWrite) {
      await db
        .insertInto("logs")
        .values({
          timestamp: new Date(log.timestamp),
          level: log.level,
          message: log.message,
          component: log.component,
          user_id: log.userId as any,
          session_id: log.sessionId,
          metadata: log.metadata,
          error_stack: log.errorStack,
          request_id: log.requestId,
        })
        .execute();
    }
  } catch (error) {
    console.error("Failed to flush logs to database:", error);
    dbWriteQueue = [...logsToWrite, ...dbWriteQueue];
  }
}

// Periodically flush logs to database
if (typeof window === "undefined") {
  setInterval(() => {
    flushLogsToDatabase();
  }, 5000);
}

export function createLogger(context: LogContext) {
  const logger = getLogger();

  return {
    info: (message: string, metadata?: Record<string, unknown>) => {
      logger.info(
        {
          component: context.component,
          userId: context.userId,
          sessionId: context.sessionId,
          requestId: context.requestId,
          ...metadata,
        },
        message
      );

      dbWriteQueue.push({
        timestamp: new Date().toISOString(),
        level: "info",
        message,
        component: context.component,
        userId: context.userId,
        sessionId: context.sessionId,
        metadata,
        requestId: context.requestId,
      });
    },

    warn: (message: string, metadata?: Record<string, unknown>) => {
      logger.warn(
        {
          component: context.component,
          userId: context.userId,
          sessionId: context.sessionId,
          requestId: context.requestId,
          ...metadata,
        },
        message
      );

      dbWriteQueue.push({
        timestamp: new Date().toISOString(),
        level: "warn",
        message,
        component: context.component,
        userId: context.userId,
        sessionId: context.sessionId,
        metadata,
        requestId: context.requestId,
      });
    },

    error: (message: string, error?: Error, metadata?: Record<string, unknown>) => {
      logger.error(
        {
          component: context.component,
          userId: context.userId,
          sessionId: context.sessionId,
          requestId: context.requestId,
          errorStack: error?.stack,
          ...metadata,
        },
        message
      );

      dbWriteQueue.push({
        timestamp: new Date().toISOString(),
        level: "error",
        message,
        component: context.component,
        userId: context.userId,
        sessionId: context.sessionId,
        metadata,
        errorStack: error?.stack,
        requestId: context.requestId,
      });
    },

    debug: (message: string, metadata?: Record<string, unknown>) => {
      logger.debug(
        {
          component: context.component,
          userId: context.userId,
          sessionId: context.sessionId,
          requestId: context.requestId,
          ...metadata,
        },
        message
      );
    },
  };
}

export function getCloudLogger() {
  return getLogger();
}

export async function flushAllLogs() {
  await flushLogsToDatabase();
}
