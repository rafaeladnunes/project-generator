/**
 * @param {object} options
 * @param {object} options.body
 * @param {number} options.status
 * @param {object} options.headers
 */
module.exports = ({ body = {}, status = 200, headers = { 'Content-Type': 'application/json' } }) => ({
  body,
  status,
  headers,
});
