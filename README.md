# gymnastics-text
Texting service for the UW-Madison Gymnastics Club, revamped and serverless now


## Development
Nasty text uses the [Serverless framework](https://serverless.com/) to make iterating quickly easy and to remove any complicated deployment work.  
  
Recommended Setup:
* Node.js installed, version 8.10.0 (ideally with a tool such as nvm for easy version switching in the future)
* `npm i` to install dependencies, which installs the Serverless cli tool discussed in their documentation to local dev dependencies as well as the rest of the necessary components


### NPM scripts
* `npm run deploy`: deploys with Serverless
* `npm run sls -- \< any severless options>`: run the Serverless cli tool with any options you want