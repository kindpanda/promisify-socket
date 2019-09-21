"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promisifySocketEvent = _interopRequireDefault(require("../promisifySocketEvent/promisifySocketEvent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const promisifySocket = (socket, options = {}) => {
  const {
    convertError = null,
    convertResult = null,
    emitEventName = 'emitEvent',
    onEventName = 'onEvent',
    onceEventName = 'onceEvent'
  } = options;

  socket[onEventName] = (event, callback) => {
    socket.on(event, (0, _promisifySocketEvent.default)(callback, convertResult, convertError));
  };

  socket[onceEventName] = (event, callback) => {
    socket.once(event, (0, _promisifySocketEvent.default)(callback, convertResult, convertError));
  };

  socket[emitEventName] = (event, options = undefined) => {
    return new Promise((resolve, reject) => {
      socket.emit(event, options, (error, result) => error ? reject(error) : resolve(result));
    });
  };

  return socket;
};

var _default = promisifySocket;
exports.default = _default;