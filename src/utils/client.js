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
    this.clientJs = new ClientJS();
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
      const clientjs = this.clientJs;

      return {
        os: clientjs.getOS(),
        osVersion: parseInt(clientjs.getOSVersion(), 10),
        market: config.APP_TYPE,
        marketVersion: config.APP_VERSION
      };
    }
  }
}

export default Client;
