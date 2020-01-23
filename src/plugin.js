import videojs from 'video.js';
import { version as VERSION } from '../package.json';
import Handler from './fg/handler-events';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class CollectData extends Plugin {
  /**
   * Create a CollectData plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    const handler = new Handler(player);

    handler.setOptions(options);
    this.player.ready(() => {
      handler.init();
    });
  }
}

// Define default values for the plugin's `state` object here.
CollectData.defaultState = {};

// Include the version number.
CollectData.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('collectData', CollectData);

export default CollectData;
