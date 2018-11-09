[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# gymnastics-text

Texting service for the UW-Madison Gymnastics Club, revamped and serverless now.

## Development

Nasty text uses the [Serverless framework](https://serverless.com/) to make iterating quickly easy and to remove any complicated deployment work.

Recommended Setup:

-   Node.js installed, version 8.10.0 (ideally with a tool such as nvm for easy version switching in the future)
-   `npm i` to install dependencies, which installs the Serverless cli tool discussed in their documentation to local dev dependencies as well as the rest of the necessary components

There is a local version of the API for development (`npm run local`). It can be run in a terminal and then you may make as many changes to the codebase as you want without restarting it as long as you don't change `serverless.yml`. Each time a request comes in it grabs the current copy of the code. There are several useful tools for interacting
with this API, including Httpie, curl, Postman, and many more. The npm scripts already set `NODE_ENV` to `dev` for you. To imitate AWS DynamoDB locally, we are using the Localstack project [link](https://localstack.cloud/). To use this, first setup your machine with Docker and Docker-Compose. Go to https://www.docker.com/get-started and click the appropriate Download button. If using a Mac, Docker-Compose comes in the Docker download. You may have to create an account. Then clone the Localstack repo then run `docker-compose up` inside it (this should be run in a separate terminal, or run as a daemon). This will spin up a bunch of containers emulating a variety of AWS services, with their ports mapped to your `localhost`. You are able to make aws cli commands against DYnamoDB by using the `--endpoint-url https://localhost:4569` option in your command. When initializing `dynamoose` checks if our environment is `dev` and either connects to the local db or uses the AWS credentials it finds.

### NPM scripts

-   `npm run deploy`: deploys with Serverless to the AWS account configured on your computer.
-   `npm run sls -- \< any severless options>`: run the Serverless cli tool with any options you want.
-   `npm run local`: runs `serverless-offline` to run a local copy of the API, default at `localhost:3000`.
