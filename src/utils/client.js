import { config } from '../const/index';
import window from 'global/window';
import ClientJs from 'clientjs';

const getClientJS = () => {
  if (window.ClientJS) {
    const { ClientJS } = window;

    return new ClientJS();
  }
  return new ClientJs();
};

/**
 * An advanced Client info.
 *
 */
class Client {
  /**
   * create ClientJs instance.
   */
  constructor() {
    this.clientJs = getClientJS();
  }

  get(methodName) {
    if (!this.clientJs) {
      this.clientJs = getClientJS();
    }
    if (this.clientJs) {
      if (this.clientJs[methodName]) {
        return this.clientJs[methodName]();
      }
    }
  }
  /**
   * Get user basic info.
   * ------------------
   *
   * @function getBasicInfo
   *
   * @return {Object} return client info object { os:@int , osVersion:@int , market:@string , marketVersion:@string }
   */
  getBasicInfo() {
    if (this.clientJs) {
      const { clientJs } = this;

      return {
        os: clientJs.getOS ? clientJs.getOS() : '',
        osVersion: clientJs.getOSVersion ? clientJs.getOSVersion() : '',
        market: config.APP_TYPE,
        marketVersion: config.APP_VERSION
      };
    }
  }
}

export default Client;
