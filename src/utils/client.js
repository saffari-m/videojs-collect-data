import { config } from '../const/index';
import window from 'global/window';

/**
 * An advanced Client info.
 *
 */
class Client {
  /**
   * create ClientJs instance.
   */
  constructor() {
    if (window.ClientJS) {
      const { ClientJS } = window;

      this.clientJs = new ClientJS();
    }
  }

  get(methodName) {
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
        client: {
          os: clientJs.getOS ? clientJs.getOS() : '',
          osVersion: clientJs.getOSVersion ? clientJs.getOSVersion() : '',
          market: config.APP_TYPE,
          marketVersion: config.APP_VERSION
        }
      };
    }
  }
}

export default Client;
