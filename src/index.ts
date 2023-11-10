import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { goalGeneratorHandler } from "./controllers";
import { goalGeneratorAPIDetails } from "./lib/swagger";
import { logger } from "@bogeychan/elysia-logger";
import { rateLimit } from "elysia-rate-limit";
import { env } from "./env";
import { rateLimitKeyGenerator } from "./utils";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Talent Protocol AI API",
          version: "1.0.0",
          description:
            "Welcome to the Swagger documentation for the AI API of Talent Protocol. You can generate goals based on the user profile info (bio, experience and interests) or generate descriptions of goals using AI.",
        },
        tags: [
          {
            name: "AI",
            description: "Endpoints for interacting with AI",
          },
        ],
      },
    })
  )
  .use(
    logger({
      autoLogging: true,
    })
  )
  .use(
    rateLimit({
      duration: env.RATE_LIMIT_DURATION,
      max: env.RATE_LIMIT_MAX,
      generator: rateLimitKeyGenerator,
    })
  )
  .group("/api/v0", (app) =>
    app.group("/ai", (aiGroup) =>
      aiGroup.post(
        "/:talentId/goals",
        goalGeneratorHandler,
        goalGeneratorAPIDetails
      )
    )
  )
  .listen(env.PORT);

console.log(`⚡️ ElysiaJS server started on port ${env.PORT}.`);
