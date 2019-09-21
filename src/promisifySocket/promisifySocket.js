import promisifySocketEvent from '../promisifySocketEvent/promisifySocketEvent';

const promisifySocket = (socket, options = {}) => {
  const {
    convertError = null,
    convertResult = null,
    emitEventName = 'emitEvent',
    onEventName = 'onEvent',
    onceEventName = 'onceEvent',
  } = options;

  socket[onEventName] = (event, callback) => {
    socket.on(event, promisifySocketEvent(callback, convertResult, convertError));
  };

  socket[onceEventName] = (event, callback) => {
    socket.once(event, promisifySocketEvent(callback, convertResult, convertError));
  };

  socket[emitEventName] = (event, options = undefined) => {
    return new Promise((resolve, reject) => {
      socket.emit(event, options, (error, result) => (error ? reject(error) : resolve(result)));
    });
  };

  return socket;
};

export default promisifySocket;
