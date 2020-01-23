/**
 * This class have extra utils function on object's
 *
 */
class FgObject {
  /**
   * Create Instance of FgObject
   *
   */
  constructor() {}
}

/**
 * This function equal object with model.
 * eqaul each field of object with model field's.
 *
 * @param {object} obj the object with data.
 * @param {object} model the object with data.
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
 * @param {array} array the array list of object with data.
 * @param {object} model the object with data.
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
