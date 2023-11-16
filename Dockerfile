FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY .env .

RUN bun install --production

COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
EXPOSE 8080

CMD ["bun", "src/index.ts"]
