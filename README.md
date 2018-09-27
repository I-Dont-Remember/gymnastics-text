# gymnastics-text
Texting service for the UW-Madison Gymnastics Club, revamped and serverless now


## Development
Nasty text uses the [Serverless framework](https://serverless.com/) to make iterating quickly easy and to remove any complicated deployment work.  
  
Recommended Setup:
* Node.js installed, version 8.10.0 (ideally with a tool such as nvm for easy version switching in the future)
* `npm i` to install dependencies, which installs the Serverless cli tool discussed in their documentation to local dev dependencies as well as the rest of the necessary components

There is a local version of the API for development (`npm run local`). It can be run in a terminal and then you may make as many changes to the codebase as you want without restarting it as long as you don't change `serverless.yml`.  Each time a request comes in it grabs the current copy of the code.

### NPM scripts
* `npm run deploy`: deploys with Serverless to the AWS account configured on your computer.
* `npm run sls -- \< any severless options>`: run the Serverless cli tool with any options you want.
* `npm run local`: runs `serverless-offline` to run a local copy of the API, default at `localhost:3000`.