# TackleCovid19

Covid19 outbreak status monitoring and case tracking.
This dashboard will be used by Ministry of health for internal logging and monitoring.

# NOTE
You need to add an environment variable in the respective .env file for ```VUE_APP_GOOGLE_MAPS_API_KEY``` with a valid google maps API key for maps to show properly.

# How to contribute

[Here are the guidelines](CONTRIBUTING.md)


# Breaking Changes as of March 29, 2020
1. Authentication is through AWS Cognito

2. previous demo credentials[below]  doesn't work any more

3. cases list and management removed, since the data collection and aggregation is done through other projects

4. (New!)The master branch of this repo will automatically be deployed to - http://dashboard.ethiopia-covid19.com   



## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```
## License

GPLv3
https://www.gnu.org/licenses/gpl-3.0.en.html
