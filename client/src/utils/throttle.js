/**Throttles a function by limiting its execution to a maximum of once every delay milliseconds.
 * @function
 *@param {function} function - Function to throttle.
 *@param {int} delay - Time to throttle in milliseconds.
 *@return {function} A new function that can only run once every delay period.
 */
const throttle = (func, delay) => {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    func(...args);
  };
};

export default throttle;
