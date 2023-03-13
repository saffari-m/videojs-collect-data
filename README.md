# videojs-collect-data

Collect data from client on during watching video.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Usage](#usage)
  - [`<script>` Tag](#script-tag)
  - [Browserify/CommonJS](#browserifycommonjs)
  - [RequireJS/AMD](#requirejsamd)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```sh
npm install --save @filmgardi/videojs-collect-data
```

## Usage

To include videojs-collect-data on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-collect-data.min.js"></script>
<script>
  var player = videojs('my-video');

  const collectDataOption = {
    intervalTime: 1000, // `intervalTime` get integer value. "base on miliseconds"
    requiredParameter: [
      { name: 'require1', value: 'require1_Value' },
      { name: 'require2', value: 1 },
      { name: 'require3', value: true },
      { name: 'require4', value: new Date().getTime() },
      { name: 'require5', value: 12 },

    ],
    action: { // The main action in each interval call this function.
      name: 'Temp1', // The name of action.
      method: 'POST', // GET,POST,PUT,DELETE
      url: 'https://example.com/api/v1/temp',// The destination url
      body: { // The body have to main parameter :
              // params : the defination of your request body set here.
              // config : the config is optional variable for create your body.
        params: {
          p1: 'p1_value', // static value
          p2: 'p2_value', // static value
          nestetParam: {
            p3: 'FG-VIDEO_HALF_TIME', // FG-VIDEO_HALF_TIME : get half video duration
            p4: 'FG-VIDEO_CURRENT_TIME', // FG-VIDEO_CURRENT_TIME : get videojs current time
            p5: 'FG-DEVICE_RESOLUTION' // FG-DEVICE_RESOLUTION : get client monitor resolution
            p6: 'FG-METHOD(${fuid} + "_" + ${fmid})', // FG-METHOD(arguments) : calculate arguments
            p7: 'FG-VIDEO_MIN_TO_NOW', // FG-VIDEO_MIN_TO_NOW : get videojs difference between live time and play time 
            // you can use static value and `params` inside parameters in your arguments.
            // ex.
            // 1: FG-METHOD(${p1} + ${p2})
            // 2: FG-METHOD(${require1} + ${require2})
            // 3: FG-METHOD(${require2} * ${require5}) use same type value for ( * and / and - ) operation.
          },
          ...
        },
        config: {
          targetParam: 'nestetParam' // with this config `requiredParameter` object add to `targetParam` object if you did't set `targetParam` the object add to root of `params`.
          ignore:{
            requiredParameter: false, // with this option control append `requiredParameter`to your body
            clientInfo: false // with this option control append `clientInfo`to your body
            //clientInfo contain os: "Linux", osVersion: "x86_64", market: "WEB", marketVersion: "0.0.1"
          }
        }
      }
    },
    altAction: [
      {
        name: 'Temp2',
        method: 'POST',
        url: 'https://example.com/api/v1/temp2',
        body: {
          params: {
            p1: 'FG-VIDEO_HALF_TIME',
            p2: 'FG-VIDEO_CURRENT_TIME',
            p3: 'FG-DEVICE_RESOLUTION',
            p4: 'FG-VIDEO_MIN_TO_NOW',
          }
        }
      },
      {
        name: 'Temp3',
        method: 'POST',
        url: 'https://example.com/api/v1/temp3/',
        headers: {
          Authorization: 'Authorization hash',
          ...
        },
        body: {
          params: {
            p1: 'FG-VIDEO_HALF_TIME',
            p2: 'FG-VIDEO_CURRENT_TIME',
            p3: 'FG-VIDEO_MIN_TO_NOW',
          }
        }
      }
    ]
  };

  player.collectData(collectDataOption);
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-collect-data via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('@filmgardi/videojs-collect-data');

var player = videojs('my-video');

player.collectData();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', '@filmgardi/videojs-collect-data'], function(videojs) {
  var player = videojs('my-video');

  player.collectData();
});
```

## License

MIT. Copyright (c) m-saffari &lt;mohamadsaffari90@gmail.com&gt;

[videojs]: http://videojs.com/
