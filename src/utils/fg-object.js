import Client from './client';

const client = new Client();

/**
 * This class have extra utils function on object's
 * ------------------------
 */
class FgObject {
  /**
   * Create Instance of FgObject
   *
   * @param {*} player instance of video.js player
   *
   */
  constructor(player) {
    this.player = player;
  }

  /**
   * System variable's
   *
   * @return {*} some system variable's function
   */
  getSystemVariables() {
    const _player = this.player;

    return {
      CURRENT_TIME: () => {
        let value;

        try {
          value = Math.floor(_player.currentTime() / 60);
        } catch (e) {
          value = 9999;
        }
        return value;
      },
      HALF_TIME: () => {
        let value;

        try {
          value = Math.floor(Math.floor(_player.duration() / 60) / 2);
        } catch (e) {
          value = 7777;
        }
        return value;
      },
      RESOLUTION: () => {
        return client.get('getCurrentResolution');
      }
    };
  }

  /**
   * Get system variable's
   *
   * @param {*} propertyName system property name
   *
   * @return {*} value of system variable's
   */
  getSystemProperty(propertyName) {
    if (propertyName && propertyName.length > 0) {
      if (this.getSystemVariables()[propertyName]) {
        return this.getSystemVariables()[propertyName]();
      }
    }
    return null;
  }

  /**
   * Get param from parameters
   *
   * @param {string} param param name
   * @param {*} parameters object of parameters
   *
   * @return {*} value of param
   *
   */
  getFromParams(param, parameters) {
    let value = '';

    if (param) {
      Object.keys(parameters).map(property => {
        if (property === param) {
          value = parameters[property];
          if (typeof value === 'string') {
            value = `"${value}"`;
          }
          return value;
        }
        if (typeof property === 'object') {
          value = this.getFromParams(param, property);
        }
      });
    }
    return value;
  }

  /**
   * This method extract FG-METHOD(x) argument.
   *
   * @param {*} str The method sentences. i.e: FG-METHOD(${x} + ${y})
   *
   * @return {string} return FG-METHOD(x) argument. i.e : x
   */
  getFormula(str) {
    let m = null;

    const methodPatternRegex = new RegExp(/FG-METHOD\((.*?)\)/g);

    while ((m = methodPatternRegex.exec(str)) !== null) {
      return m[1];
    }
  }

  /**
   * This method extract parameters used in FG-METHOD(x) argument.
   *
   * @param {*} str The method argument sentences. i.e: ${x} + ${y}
   *
   * @return {Array} return Array of parameter used inside the argument. i.e: [["${x}","x"], ["${y}","y"]]
   */
  getParameters(str) {
    return Array.from(str.matchAll(/\$\{(.*?)\}/g));
  }
  /**
   * By passing a string to the Function constructor, you are requiring the engine to parse that string much in the way it has to when you call the eval function.
   *
   * @param {*} str 
   *
   * @return {*} result
   */
  parse(str) {
    /* eslint no-new-func: 0 */
    return Function(`'use strict'; return (${str})`)();
  }

  /**
   * Calculate value of FG-* parameter.
   *
   * @param {string} property property value with 'FG-*' template.
   * @param {*} params params of request body
   *
   * @return {*} value of property
   */
  calculateParam(property, params) {
    if (property.startsWith('FG-')) {
      let propertyName = '';

      if (property.startsWith('FG-VIDEO_') || property.startsWith('FG-DEVICE_')) {
        propertyName = property.replace('FG-VIDEO_', '').replace('FG-DEVICE_', '');
      } else {
        let formula = this.getFormula(property);

        const parameterArray = this.getParameters(formula);

        if (formula) {
          if (parameterArray.length > 0) {
            parameterArray.map(prameter => {
              formula = formula.replace(prameter[0], this.getFromParams(prameter[1], params));
            });
            return this.parse(formula);
          }
        }
      }
      return this.getSystemProperty(propertyName);
    }
    return property;
  }
}

/**
 * This function equal object with model.
 * eqaul each field of object with model field's.
 *
 * @param {Object} obj the object with data.
 * @param {Object} model the object with data.
 *
 * @return {boolean} This result is 'true' or 'false'.
 *
 */
const equal = (obj, model) => {
  let isOk = true;

  if (obj && model) {
    if (Array.isArray(obj)) {
      throw new Error('require object instead of array for equal with model...!');
    }
    Object.keys(model).map(key => {
      if (!obj[key]) {
        isOk = false;
      }
    });
  }
  return isOk;
};

/**
 * This function equal array of object with model.
 * check each object inside a array and
 * eqaul each field of object with model field's.
 *
 * @param {Array} array the array list of object with data.
 * @param {Object} model the object with data.
 *
 * @return {boolean} This result is 'true' or 'false'.
 *
 */
const equalArray = (array, model) => {
  let isOk = true;

  if (array && model) {
    if (Array.isArray(array)) {
      array.map(item => {
        if (!equal(item, model)) {
          isOk = false;
        }
      });
    }
  }
  return isOk;
};

FgObject.equal = equal;
FgObject.equalArray = equalArray;

export default FgObject;
