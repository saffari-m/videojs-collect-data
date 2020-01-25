import videojs from 'video.js';
import { ActionModel } from '../const/models';
import FgObject from '../utils/fg-object';
import Client from '../utils/client';
import window from 'global/window';
const client = new Client();

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
      action: ActionModel,
      altAction: []
    };
    this.fgObject = new FgObject(player);
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
    // if (!options.movieId) {
    //   throw new TypeError("movieId is require for initialize 'CollectData' plugin.");
    // }
    // if (!options.userId) {
    //   throw new TypeError("userId is require for initialize 'CollectData' plugin.");
    // }
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

  // #region Utils Function

  /**
   * Add client info to params object.
   * if exist targetParamName in config client info append to this param.
   *
   * @param {*} params params of request body
   * @param {string} targetParamName the name of destination property to add clientInfo
   *
   * @return {*} new object of params
   */
  addClientInfo(params, targetParamName) {
    try {
      const clientInfo = client.getBasicInfo();

      if (targetParamName) {
        Object.assign(params[targetParamName], clientInfo);
      } else {
        Object.assign(params, clientInfo);
      }
    } catch (e) {
      videojs.log('Some error on add ClientInfo.');
    }
    return params;
  }

  /**
   * Assign required params to params.
   * if @targetParamName is exist, @requiredParams assign to this property.
   *
   * @param {*} params params of request body
   * @param {*} requiredParams public parameter to assign params
   * @param {string} targetParamName the name of destination property to add requiredParams
   *
   * @return {*} new params object with required Parameters
   */
  addRequiredParams(params, requiredParams, targetParamName) {
    const requiredParameter = {};

    try {
      if (requiredParams && requiredParams.length > 0) {
        requiredParams.map(param => {
          requiredParameter[param.modelName || param.name] = param.value;
        });
      }
      if (targetParamName) {
        Object.assign(params[targetParamName], requiredParameter);
      } else {
        Object.assign(params, requiredParameter);
      }
    } catch (e) {
      videojs.log('Some error on add RequiredParams.');
    }
    return params;
  }

  /**
   * Add extra header request to xhr headers property
   *
   * @param {*} headers object of extra http headers
   *
   * @return {*} object of http header
   *
   */
  getHeaders(headers) {
    const _headers = {
      'Content-Type': 'application/json'
    };

    if (headers) {
      Object.assign(headers, _headers);
    }
    return headers;
  }

  calculateValue(propertyValue, params) {
    let value = propertyValue;

    value = this.fgObject.calculateParam(value, params);
    return value;
  }
  /**
   * Calculate FG-* variable and fill properties
   *
   * @param {*} params params of request body
   *
   * @return {*} filled property with true value
   */
  getParamsValue(params) {
    Object.keys(params).map(property => {
      const _type = typeof params[property];

      if (_type === 'object') {
        params[property] = this.getParamsValue(params[property]);
      } else if (_type === 'string') {
        params[property] = this.calculateValue(params[property], params);
      }
    });
    return params;
  }

  /**
   * Create request body from option's config and requiredParams property
   * also add client Information to this model if you want ignore this property must be add "clientInfo:false" in each action block.
   *
   * @param {*} action action model
   *
   * @return {*} return new body object.
   */
  getBody(action) {
    const { body } = action;

    const { requiredParameter } = this.options;

    if (body && body.params) {
      const opt = {
        ignoreClientInfo: false,
        ignoreRequireParameter: false,
        hasTargetParam: false,
        targetParamName: null
      };

      if (body.config) {
        const { config } = body;

        if (config.targetParam) {
          opt.hasTargetParam = true;
          opt.targetParamName = config.targetParam;
        }
        if (config.ignore && config.ignore.requiredParameter) {
          opt.ignoreRequireParameter = true;
        }
        if (config.ignore && config.ignore.clientInfo) {
          opt.ignoreClientInfo = true;
        }
      }
      // clone params object
      let _params = body.params;
      let targetParamName = null;

      if (opt.hasTargetParam) {
        targetParamName = opt.targetParamName;
      }
      if (!opt.ignoreClientInfo) {
        _params = this.addClientInfo(_params, targetParamName);
      }
      if (requiredParameter && requiredParameter.length > 0 && !opt.ignoreRequireParameter) {
        _params = this.addRequiredParams(_params, requiredParameter, targetParamName);
      }
      _params = this.getParamsValue(_params);
      return _params;
    }
  }

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
  // #endregion

  // #region Main_Action

  /**
   * This method request to distination server with information come from 'altAction' parameter on option.
   *
   * @param {*} body body of request
   */
  callAltAction() {
    const { altAction } = this.options;

    try {
      if (altAction && altAction.length > 0) {
        altAction.map(action => {
          videojs.xhr({
            url: action.url,
            method: action.method,
            headers: this.getHeaders(action.headers),
            body: JSON.stringify(action.body ? this.getBody(action) : {})
          });
        });
      }
    } catch (e) {
      videojs.log("Some error on call alternative action's.");
    }
  }

  /**
   * This method request to distination server with information come from 'action' parameter on option.
   *
   */
  callAction() {
    const { action } = this.options;
    const _this = this;

    try {
      videojs.xhr(
        {
          url: action.url,
          method: action.method,
          headers: this.getHeaders(action.headers),
          body: JSON.stringify(action.body ? this.getBody(action) : {})
        },
        function (err, resp, _body) {
          if (resp.statusCode !== 200) {
            _this.callAltAction();
            if (err.message || err.name) {
              videojs.log('Some error on call action method');
            }
          }
        }
      );
    } catch (e) {
      this.callAltAction();
    }
  }
  // #endregion

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
    this.player.one('play', () => {
      let time = 0;
      const me = this;

      window.setInterval(function () {
        if (!me.isPaused) {
          time++;
          if (time % 60 === 0) {
            time = 0;
            me.callAction();
          }
        }
      }, this.options.intervalTime);
    });
  }

  sameFunctionEvents() {
    this.multiEvent(['ended', 'waiting'], props => {
      if (props.type === 'ended') {
        // show extra details
        this.pauseSend();
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
      this.onLoadedMetaData();
      this.onPlaying();
    }
  }
}
export default Handler;
