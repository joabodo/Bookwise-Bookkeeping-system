/**This function creates a new function that delays the execution of the provided func until a certain amount of time has passed since the last call.
 * @function
 *@param {function} function - Function to debounce.
 *@param {int} delay - Time to debounce in milliseconds
 *@returns {function} A new function that executes func after a delay of inactivity.
 */
export default (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
