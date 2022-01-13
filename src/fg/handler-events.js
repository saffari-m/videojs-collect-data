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
    this.intervalId = -1;
    this.fgObject = new FgObject(player);
  }

  setIntervalId(id) {
    if (id === 'undefined' || id === null) {
      throw new TypeError('Interval id is not valid.');
    }
    this.intervalId = id;
  }
  getIntervalId() {
    return this.intervalId;
  }

  /**
   * This get clone object from options
   *
   * @return {*} clone object of options
   */
  getOptions() {
    const options = Object.assign({}, this.options);

    return options;
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
  getHeaders(headers = {}) {
    const _headers = {
      'Content-Type': 'application/json'
    };

    if (headers) {
      Object.assign(headers, _headers);
    }
    return headers;
  }
  /**
   * Calculate value
   *
   * @param {*} propertyValue propertyValue
   * @param {*} params params
   *
   * @return {*} calculated value
   */
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
    const _params = Object.assign({}, params);

    Object.keys(_params).map(property => {
      const _type = typeof _params[property];

      if (_type === 'object') {
        _params[property] = this.getParamsValue(_params[property]);
      } else if (_type === 'string') {
        _params[property] = this.calculateValue(_params[property], _params);
      }
    });
    return _params;
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

    const { requiredParameter } = this.getOptions();

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
      let _params = Object.assign({}, body.params);
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
    const { altAction } = this.getOptions();

    try {
      if (altAction && altAction.length > 0) {
        altAction.map(action => {
          try {
            if (action) {
              const config = {
                url: action.url,
                method: action.method,
                headers: this.getHeaders(action.headers),
                body: JSON.stringify(action.body ? this.getBody(action) : {})
              };

              if (action.call && typeof action.call === 'function') {
                action.call(config);
              } else {
                videojs.xhr(config, function(err, resp, _body) {
                  if (resp.statusCode !== 200 || resp.statusCode !== 201) {
                    if (err) {
                      videojs.log('Some error on call action method');
                    } else {
                      videojs.log('Some error on call action method');
                    }
                  }
                });
              }
            }
          } catch (e) {
            videojs.log(`failed on call ${action.name} request.`);
          }
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
    const { action } = this.getOptions();
    const that = this;

    try {
      if (action) {
        const config = {
          url: action.url,
          method: action.method,
          headers: this.getHeaders(action.headers),
          body: JSON.stringify(action.body ? this.getBody(action) : {})
        };

        if (action.call && typeof action.call === 'function') {
          try {
            action.call(config).catch(function(e) {
              that.callAltAction();
            });
          } catch (e) {
            action.call(config);
          }
        } else {
          videojs.xhr(config, function(err, resp, _body) {
            if (resp.statusCode !== 200) {
              that.callAltAction();
              if (err) {
                videojs.log('Some error on call action method');
              }
            }
          });
        }
      }
    } catch (e) {
      this.callAltAction();
    }
  }
  // #endregion

  /**
   * Pause send data
   * ----------------------
   */
  pauseSend() {
    this.isPaused = true;
  }
  /**
   * Resume send data
   * ----------------------
   */
  resumeSend() {
    this.isPaused = false;
  }
  /**
   * on Load meta data
   * ----------------------
   */
  onLoadedMetaData() {
    this.player.one('loadedmetadata', () => {
      this.fgObject.setInitRequest(true);
      this.callAction();
    });
  }
  /**
   * on Playing
   * ----------------------
   */
  onPlaying() {
    this.player.one('play', () => {
      let time = 0;
      const that = this;

      const intervalId = window.setInterval(function() {
        if (!that.isPaused) {
          time++;
          if (time % 60 === 0) {
            if (that.fgObject.hasIntialRequest) {
              that.fgObject.setInitRequest(false);
            }
            time = 0;
            that.callAction();
          }
        }
      }, this.options.intervalTime);

      this.setIntervalId(intervalId);
    });
    this.player.on('dispose', () => {
      window.clearInterval(this.getIntervalId());
      this.setIntervalId(-1);
    });
  }
  /**
   * Same Function Events
   * ----------------------
   */
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
