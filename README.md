# TackleCovid19

Covid19 outbreak status monitoring and case tracking.
This dashboard will be used by Ministry of health for internal logging and monitoring.

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

## Screenshots


National Covid Stats
![main stats](https://i.imgur.com/GmFO73b.png)
![cases by travel history](https://i.imgur.com/wBtuOEL.png)
![daily cases](https://i.imgur.com/sd0O7sf.png)




Surveillance Heatmap
![surveillance heatmap](https://i.imgur.com/vgJqjWs.png)




Medical Resource Tracking (beds, ventilators, PPE, etc)
![medical resource tracking](https://i.imgur.com/FbPUsDr.png)




## License
```
MIT License

Copyright (c) 2020 Africa COVID-19 Response Toolkit

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

