import { config } from '../const/index';
import window from 'global/window';
import parser from 'ua-parser-js';
// import ClientJS from 'clientjs';

/**
 * An advanced Client info.
 *
 */
class Client {
  /**
   * create ClientJs instance.
   */
  constructor() {
    const _window = typeof window === 'undefined' ? null : window;

    if (_window) {
      try {
        this.result = parser();
      } catch (e) {
        // console.log('Client: constructor : ' + e);
      }
    }
  }

  /**
   * Get user OS.
   * ------------------
   *
   * @function getOS
   * @return {Object} return user OS object { name:@string , version:@string }
   * @example
   * const client = new Client();
   * client.getOS();
   * return os: { name: 'Windows', version: '10' }
   *
   */
  getOS() {
    if (this.result) {
      return this.result.os;
    }
    return null;
  }
  /**
   * Get user OS name.
   * ------------------
   *
   * @function getOSName
   * @return {string} return OS name
   * @example
   * const client = new Client();
   * client.getOSName();
   * return 'Linux'
   *
   */
  getOSName() {
    if (this.result) {
      if (this.result.os) {
        return this.result.os.name;
      }
    }
    return '';
  }
  /**
   * Get user OS version.
   * ------------------
   *
   * @function getOSVersion
   * @return {string} return user OS version
   * @example
   * const client = new Client();
   * client.getOSVersion();
   * return '10.0'
   */
  getOSVersion() {
    if (this.result) {
      if (this.result.os) {
        return this.result.os.version;
      }
    }
    return '';
  }
  /**
   * Get user browser info.
   * ------------------
   *
   * @function getBrowser
   * @return {Object} return browser info object { browser:@string , browserVersion:@string }
   * @example
   * const client = new Client();
   * client.getBrowser();
   * return browser: { name: 'Chrome', version: '58.0.3029.110' }
   *
   */
  getBrowser() {
    if (this.result) {
      return this.result.browser;
    }
    return null;
  }
  /**
   * Get user browser name.
   * ------------------
   *
   * @function getBrowser
   * @return {Object} return browser name browser:@string
   * @example
   * const client = new Client();
   * client.getBrowserName();
   * return browser: 'Chrome'
   */
  getBrowserName() {
    if (this.result) {
      if (this.result.browser) {
        return this.result.browser.name;
      }
    }
    return '';
  }
  /**
   * Get user browser version.
   * ------------------
   *
   * @function getBrowserVersion
   * @return {string} return browser version browserVersion:@string
   * @example
   * const client = new Client();
   * client.getBrowserVersion();
   * return browserVersion: '58.0.3029.110'
   */
  getBrowserVersion() {
    if (this.result) {
      if (this.result.browser) {
        return this.result.browser.version;
      }
    }
    return '';
  }
  /**
   * Get user device resolution.
   * ------------------
   *
   * @function getDeviceResolution
   * @return {string} return device resolution
   * @example
   * const client = new Client();
   * client.getDeviceResolution();
   * return '1920x1080'
   */
  getDeviceResolution() {
    if (typeof window !== 'undefined') {
      const { screen } = window;

      return screen.width + 'x' + screen.height;
    }
    return '';
  }

  get(methodName) {
    if (this) {
      if (this[methodName]) {
        return this[methodName]();
      }
      // console.log(methodName + ' is not a method of ClientJs');
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
    if (this) {
      return {
        os: this.getOSName(),
        osVersion: this.getOSVersion(),
        market: config.APP_TYPE,
        marketVersion: config.APP_VERSION
      };
    }
  }
}

export default Client;
