# Talent Protocol AI API

This is the AI API for Talent Protocol, capable of:

- Generating goals based on the user profile info, such as "bio", "experience" and "interests";
- Generating descriptions for goals, based on the goal title and the user profile info described above.

More features maybe coming in the future.

## 📦 Installation

To install dependencies run:

```bash
bun install
```

This project is based on [bun](https://bun.sh) and uses the [ElysiaJS](https://elysiajs.com/) framework to ensure a fast and type-safe API.

## 🚀 Running

The first thing you need to do, if you don't have an `OPENAI_API_KEY` env variable set globally, is to create a `.env` file using the `.env.example` as a template.

```bash
cp .env.example .env
```

Then, you need to set the `OPENAI_API_KEY` variable to your OpenAI API key and the `TP_API_KEY` variable to your Talent Protocol API key.

Then, to run the API, just run:

```bash
bun start
```

The default port for the API is `8080`, in case you want to edit it just change the `PORT` variable in the `.env` file to whatever suits the best.

## 🐳 Docker

You can run this API using Docker as well. To do so, just run:

```bash
docker build -t talent-protocol-ai-api:latest .
```

Once it's built, you can run it using:

```bash
docker run -it --rm -d -p 8080:8080 talent-protocol-ai-api:latest
```

Refer to the [docker docs](https://docs.docker.com/engine/reference/commandline/run/) for more information about the `docker run` command.

You can also build the Docker image using `distroless`. You just need to change the `Dockerfile` to use the `distroless` base image and then run:

```bash
docker build -t talent-protocol-ai-api:latest -f Dockerfile.distroless .
```

If you are using docker and you don't want to use a `.env` file, make sure to pass the environment variables to the running docker container using the `-e` or `--env` flag.

## ƛ Lambda deployment

In case you want to deploy this API to AWS Lambda, you need to follow these steps:

1. Clone the bun repository to your machine and enter the `bun-lambda` package:

```bash
git clone git@github.com:oven-sh/bun.git
cd bun/packages/bun-lambda
```

2. Install the required dependencies:

```bash
bun install
bun install @oclif/plugin-plugins
```

3. Build the Bun Lambda package (this step is necessary if you want to upload the lambda layer using the `aws-cli`):

```bash
bun run build-layer --arch aarch64 --release latest --output ./bun-lambda.zip
```

4. Publish the Bun Lambda layer to your AWS account:

```bash
aws lambda publish-layer-version --layer-name bun-layer --region eu-central-1 --description "Bun is an incredibly fast JavaScript runtime, bundler, transpiler, and package manager." --license-info MIT --compatible-architectures arm64 --compatible-runtimes provided.al2 provided --zip-file fileb://bun-lambda.zip --output json
```

You can change the `--region` parameter with your region of choice.

5. Go on the AWS Lambda console and create a new Lambda function. Choose the `Provide your own bootstrap on Amazon Linux 2` option for the runtime.

6. Inside this repository, build the bundle for the lambda:

```bash
bun run build
```

This will create a `dist/bundle.js` file that needs to be imported in the lambda source code.

7. Go to the Code Source section of the Lambda function and upload the `dist/bundle.js` file by creating an `index.js` file in the root directory of the lambda. Click on the `Deploy` button to deploy the changes.

8. Go to the Layers section of the Lambda function and add the `bun-layer` layer that you created in step 4.

9. Scroll down to `Runtime settings` and click on `Edit`: update the `Handler` option with `index.fetch`.

10. Go to the `Environment variables` section and add the API environment variables following the `.env.example` file.

11. Enable the Lambda Function URL by going in the Configuration tab, then Function URL and click on `Create function URL`. Make sure to select `NONE` in the `Auth type` if you want the API to be publicly accessible.

12. Navigate to `LAMBDA_URL/swagger` to view the API Swagger UI. It should work fine.

### ‼️ Rate limiting

This API is rate limited in order to avoid any type of spam. The rate limiting is provided by the `elysia-rate-limit` package.

Currently you can make maximum `60` requests in `60000` milliseconds (1 minute) - so 1 request per second. In case you want to update this values, just update the `.env` file with the following variables:

```bash
RATE_LIMIT_DURATION=60000 // window duration in milliseconds
RATE_LIMIT_MAX=60 // number of requests in the window
```

## 📝 Usage

When the API is up and running, you can visit `http://localhost:8080/swagger` to see the Swagger UI and test the API endpoints available.

### POST /api/v0/ai/goals

This endpoint generates goals based on the user profile info, such as "bio", "experience" and "interests".

The endpoint receives the following JSON body as an input:

```json
{
  "history": ["string"],
  "talentId": "string",
  "bio": "string",
  "interests": ["string"],
  "experience": ["string"]
}
```

If you pass `talentId` in the body, it makes an HTTP request to the Talent Protocol API to retrieve the talent bio, interests and experience; if you don't pass it, it uses the `bio`, `interests` and `experience` fields in the body.

This means that either you pass the `talentId` in the body, or you pass the `bio`, `interests` and `experience` fields in the body, but not both.

The `history` field contains an array of an array of past goals that you would like to exclude, such as old goals already provided by the user, or goals that were already generated by this API.

The endpoint returns a simple JSON as an output:

```json
{
  "response": ["GOAL_1", "GOAL_2", "GOAL_3"]
}
```

A list of 3 goals is returned, each one being a string.

You can test this endpoint via the `/swagger` route or using cURL:

```bash
curl -XPOST -H "Content-Type: application/json" -d '{"history": [], "talentId": "TALENT_ID"}' -H "Content-Type: application/json" http://localhost:8080/api/v0/ai/goals
```

As stated before, if you want to exclude past goals or goals already generated by this API, you can pass them in the `history` field:

```bash
curl -XPOST -H "Content-Type: application/json" -d '{"history": ["GOAL_1", "GOAL_2", "GOAL_3", "GOAL_4", "GOAL_5", "GOAL_6"], "talentId": "TALENT_ID"}' -H "Content-Type: application/json" http://localhost:8080/api/v0/ai/goals
```

### POST /api/v0/ai/description

This endpoint generates descriptions for goals, based on the goal title and the user profile info described above.

The endpoint receives the following JSON body as an input:

```json
{
  "goal": "string",
  "talentId": "string",
  "bio": "string",
  "interests": ["string"],
  "experience": ["string"]
}
```

If you pass `talentId` in the body, it makes an HTTP request to the Talent Protocol API to retrieve the talent bio, interests and experience; if you don't pass it, it uses the `bio`, `interests` and `experience` fields in the body.

This means that either you pass the `talentId` in the body, or you pass the `bio`, `interests` and `experience` fields in the body, but not both.

The `goal` parameter is **mandatory**.

The endpoint returns a simple JSON as an output:

```json
{
  "response": ["DESCRIPTION_1", "DESCRIPTION_2", "DESCRIPTION_3"]
}
```

A list of 3 descriptions is returned, each one being a string.

You can test this endpoint via the `/swagger` route or using cURL:

```bash
curl -XPOST -H "Content-Type: application/json" -d '{"goal": "GOAL_1", "talentId": "TALENT_ID"}' -H "Content-Type: application/json" http://localhost:8080/api/v0/ai/description
```
