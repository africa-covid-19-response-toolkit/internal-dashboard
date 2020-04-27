# TackleCovid19
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

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


## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/yohane55"><img src="https://avatars0.githubusercontent.com/u/9741727?v=4" width="100px;" alt=""/><br /><sub><b>Yohannes Ejigu</b></sub></a><br /><a href="https://github.com/africa-covid-19-response-toolkit/internal-dashboard/commits?author=yohane55" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/helomberhane"><img src="https://avatars3.githubusercontent.com/u/8413152?v=4" width="100px;" alt=""/><br /><sub><b>Helom Berhane</b></sub></a><br /><a href="https://github.com/africa-covid-19-response-toolkit/internal-dashboard/commits?author=helomberhane" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!