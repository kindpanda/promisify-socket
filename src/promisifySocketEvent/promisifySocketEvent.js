const promisifySocketEvent = (userCallback, convertResult, convertError) => {
  if (!userCallback) {
    throw new Error('expect callback to be defined');
  }

  if (typeof userCallback !== 'function') {
    throw new Error('expect callback to be a function');
  }

  if (convertResult && typeof convertResult !== 'function') {
    throw new Error('expect convertResult to be a function');
  }

  if (convertError && typeof convertError !== 'function') {
    throw new Error('expect convertError to be a function');
  }

  return (eventData = undefined, eventCb = undefined) => {
    const cleanData = typeof eventData === 'function' ? undefined : eventData;
    const socketioCallback =
      typeof eventData === 'function' ? eventData : eventCb && typeof eventCb === 'function' ? eventCb : undefined;

    return Promise.resolve()
      .then(() => userCallback(cleanData))
      .then(success => socketioCallback(null, convertResult ? convertResult(success) : success))
      .catch(error => socketioCallback(convertError ? convertError(error) : error));
  };
};

export default promisifySocketEvent;
