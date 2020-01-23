import { config } from '../const/index';
import videojs from 'video.js';
import { ActionModel } from '../const/models';
import FgObject from '../utils/fg-object';
/**
 * Handler player event.
 * --------------
 * @description This class generate for handler player event for "Filmgardi" player.
 * @class Handler
 */
class Handler {
  /**
   * Create a Handler class instance.
   *
   * @param {*} player video.js player instance
   */
  constructor(player) {
    this.player = player;
    this.isPaused = true;
    this.options = {
      action: ActionModel
    };
  }

  /**
   * This method set plugin options in Handler properties
   *
   * @param {*} options CollectData option for initialize.
   *
   */
  setOptions(options) {
    if (!options.intervalTime) {
      videojs.log("intervalTime is optional param in initialize 'CollectData' plugin. defaul value is '1000ms'");
    }
    if (!options.movieId) {
      throw new TypeError("movieId is require for initialize 'CollectData' plugin.");
    }
    if (!options.userId) {
      throw new TypeError("userId is require for initialize 'CollectData' plugin.");
    }
    if (!options.action && !Object.isObject(options.action)) {
      throw new TypeError("action is require for initialize 'CollectData' plugin.");
    }
    if (!FgObject.equal(options.action, ActionModel)) {
      throw new TypeError("action is not valid model for initialize 'CollectData' plugin.");
    }
    if (!options.altAction && !Array.isArray(options.altAction)) {
      throw new TypeError("altAction object is require for initialize 'CollectData' plugin.");
    }
    if (!FgObject.equalArray(options.altAction, ActionModel)) {
      throw new TypeError("action is not valid model for initialize 'CollectData' plugin.");
    }

    this.options = options;
  }
  /**
   * Check player instance
   *
   * @return {boolean} boolean value
   */
  hasPlayer() {
    if (this.player) {
      return true;
    }
    return false;
  }

  // #region Main_Action
  getKafkaModel(body) {
    return {
      topic: config.KAFKA_TOPIC,
      requestType: config.REQUEST_TYPE,
      property: body
    };
  }
  /**
   * This method request to distination server with information come from 'action' parameter on option.
   * 
   * @param {*} body body of request
   */
  callAction(body) {
    const data = this.getKafkaModel(body);
    const { action } = this.options;

    videojs.xhr({
      url: action.url,
      method: action.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data ? data : {})
    });
    // fetch(consts.KAFKA_URL, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(data ? data : {})
    // });
  }
  onKafkaError(minutes, halfTimeOfVideo) {
    // daqiqe_post(minutes, get_nid_uid(), halfTimeOfVideo);
    // hakim_post(minutes, getUid(), getNid());
  }
  // #endregion

  // #region Alternative_Action

  // #endregion

  /**
   * Register multi fuction on player and call same function
   *
   * @param {Array} eventNames array of string include event name's to bind player listener.
   * @param {Function} _function function
   */
  multiEvent(eventNames = [], _function) {
    if (this.hasPlayer()) {
      if (eventNames && eventNames.length > 0) {
        eventNames.map(eventName => {
          this.player.on(eventName, props => {
            _function(props);
          });
        });
      }
    }
  }

  pauseSend() {
    this.isPaused = true;
  }

  resumeSend() {
    this.isPaused = false;
  }

  onLoadedMetaData() {
    this.player.on('loadedmetadata', () => { });
  }

  onPlaying() {
    this.player.one('play', () => { });
  }

  sameFunctionEvents() {
    this.multiEvent(['ended', 'waiting'], props => {
      if (props.type === 'ended') {
      } else {
        //  send waiting reason to kafka
      }
      props.preventDefault();
    });

    this.multiEvent(['play', 'adplay'], props => {
      this.resumeSend();
      //  noSleep active
    });

    this.multiEvent(['pause', 'adpause'], props => {
      this.pauseSend();
      //  noSleep disable
    });
  }
  /**
   * Initialize Handler class for "Filmgardi" player.
   * ----------------------
   */
  init() {
    if (this.player) {
      this.sameFunctionEvents();
    }
  }
}
export default Handler;
