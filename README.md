# videojs-collect-data

Collect data from client on during watching movie.

## Table of Contents

<!-- START doctoc -->
<!-- END doctoc -->
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

  player.collectData();
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
