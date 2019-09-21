import promisifySocket from './promisifySocket';

const methods = ['emitEvent', 'onEvent', 'onceEvent'].sort();

const getSocketMock = () => {
  const mocks = {
    on: jest.fn(),
    once: jest.fn(),
    emit: jest.fn(),
  };
  const socket = mocks;
  return socket;
};

describe('promisifySocket works', () => {
  it('add default socket methods', () => {
    const socket = {};
    const upgradedSocket = promisifySocket(socket);
    expect(Object.keys(upgradedSocket).sort()).toEqual(methods);
    methods.forEach(method => {
      expect(upgradedSocket[method]).toBeInstanceOf(Function);
    });
  });

  it('methods', () => {
    const socket = getSocketMock();
    const upgradedSocket = promisifySocket(socket);
    upgradedSocket.emitEvent('plop', async () => true);
    expect(socket.emit.mock.calls.length).toBe(1);
    expect(socket.emit.mock.calls[0][0]).toBe('plop');
    expect(socket.emit.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(socket.emit.mock.calls[0][2]).toBeInstanceOf(Function);

    upgradedSocket.emitEvent('plop2', { arg: 1 }, async () => true);
    expect(socket.emit.mock.calls.length).toBe(2);
    expect(socket.emit.mock.calls[1][0]).toBe('plop2');
    expect(socket.emit.mock.calls[1][1]).toBeInstanceOf(Object);
    expect(socket.emit.mock.calls[1][1]).toEqual(expect.objectContaining({ arg: expect.any(Number) }));
  });
});
