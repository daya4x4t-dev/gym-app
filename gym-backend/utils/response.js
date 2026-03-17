/**
 * Send a standardized JSON success response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {any} data
 * @returns {import('express').Response}
 */
export const sendSuccess = (res, statusCode, message, data = {}) =>
  res.status(statusCode).json({ success: true, message, data });

/**
 * Send a standardized JSON error response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @returns {import('express').Response}
 */
export const sendError = (res, statusCode, message) =>
  res.status(statusCode).json({ success: false, message, data: {} });

/**
 * Check if value is a UUID.
 * @param {string} value
 * @returns {boolean}
 */
export const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "")
  );
