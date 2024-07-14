/**Configured Status Codes
 * @property {Integer} SUCCESS - The request was successful.
 * @property {Integer} CREATED - A new resource was created.
 * @property {Integer} BAD_REQUEST - The request was invalid.
 * @property {Integer} UNAUTHORIZED - Access denied - requires valid credentials.
 * @property {Integer} FORBIDDEN - Access denied - not authorized for this resource.
 * @property {Integer} NOT_FOUND - Resource not found (Used only for indiviual resource requests).
 * @property {Integer} CONFLICT - Resource Conflict
 * @property {Integer} SERVER_ERROR - The server encountered an error.
 */
const STATUS_CODES = {
  /**The request was successful. */
  SUCCESS: 200,

  /**A new resource was created. */
  CREATED: 201,

  /**The request was invalid. */
  BAD_REQUEST: 400,

  /**Access denied - requires valid credentials. */
  UNAUTHORIZED: 401,

  /**Access denied - not authorized for this resource. */
  FORBIDDEN: 403,

  /**Resource not found*/
  NOT_FOUND: 404,

  /**Resource conflict */
  CONFLICT: 409,

  /**The server encountered an error. */
  SERVER_ERROR: 500,
};
module.exports = STATUS_CODES;
