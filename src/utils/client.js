import ClientJS from 'clientjs';
import { config } from '../const/index';

/**
 * An advanced Client info.
 *
 */
class Client {
  /**
   * create ClientJs instance.
   */
  constructor() {
    // this.clientJs = new ClientJS();
  }

  get(methodName) {
    if (!this.clientJs)
      this.clientJs = new ClientJS();
      
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
    if (!this.clientJs)
      this.clientJs = new ClientJS();

    if (this.clientJs) {
      const { clientJs } = this;

      const osInfo = clientJs.getOS();

      return {
        client: {
          os: osInfo ? osInfo.name : '',
          osVersion: osInfo ? osInfo.version : '',
          market: config.APP_TYPE,
          marketVersion: config.APP_VERSION
        }
      };
    }
  }
}

export default Client;
