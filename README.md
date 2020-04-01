# TackleCovid19

Covid19 outbreak status monitoring and case tracking.
This dashboard will be used by Ministry of health for internal logging and monitoring.

# How to contribute

[Here are the guidelines](CONTRIBUTING.md)


# Breaking Changes as of March 29, 2020
1. Authentication is through AWS Cognito

2. previous demo credentials[below]  doesn't work any more

3. cases list and management removed, since the data collection and aggregation is done through other projects

4. The master branch of this repo will automatically be deployed to - http://ethiopia-covid19.com/   

# Demo

http://covid.fynsystems.com

demo credentials
username: 1234567890
password: password

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
