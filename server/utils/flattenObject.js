/**
 * Flattens a nested object into a flat object with dot notation keys.
 * Useful for patch updates to avoid unwanted overwrite of nested objects
 * @param {Object} obj - The object to flatten.
 * @param {string} [rootKey=null] - An optional root key prefix for nested keys. Used internally during recursion.
 * @returns {Object} - The flattened object.
 *
 * @example
 * // Flatten a nested object
 * const nestedObject = {
 *   user: {
 *     name: {
 *       first: 'John',
 *       last: 'Doe'
 *     },
 *     username: 'johndoe123',
 *     details: {
 *       age: 30,
 *       email: 'john@example.com'
 *     }
 *   }
 * };
 * const flattenedObject = flattenObj(nestedObject);
 * console.log(flattenedObject);
 * // Output: {
 * //   'user.name.first': 'John',
 * //   'user.name.last': 'Doe',
 * //   'user.username': 'johndoe123',
 * //   'user.details.age': 30,
 * //   'user.details.email': 'john@example.com'
 * // }
 */
const flattenObj = (obj, rootKey = null) => {
  /**
   * Checks if a value is a plain object.
   * @param {*} val - The value to check.
   * @returns {boolean} - True if the value is a plain object, otherwise false.
   */
  const isPlainObject = (val) =>
    !!val && typeof val === "object" && val.constructor === Object;

  // Return Primitive / Non Plain Object arguments
  if (!isPlainObject(obj)) return obj;

  // Convert object into an array of [key, value] pairs
  const entries = Object.keys(obj).map((key) => [key, obj[key]]);

  // Reduce the array of entries to create the flattened object
  const flatObj = entries.reduce((acc, [key, value]) => {
    // Determine the new key with dot notation if rootKey is provided
    const newRootKey = rootKey ? `${rootKey}.${key}` : key;
    let temp;
    // If the value is a plain object, recursively flatten it
    if (isPlainObject(value)) {
      temp = { ...acc, ...flattenObj(value, newRootKey) };
    } else {
      // Otherwise, add the key-value pair to the accumulator
      temp = { ...acc, [newRootKey]: value };
    }
    return temp;
  }, {});

  return flatObj;
};

module.exports = flattenObj;
