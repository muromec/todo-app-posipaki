declare module 'pspki/core.js';

type NotifyFn = () => void;
type UnsubscibeFn = () => void;
type Process = {
  send: (msg: Message) => void;
  wait: () => Promise<void>;
  subscribe: (fn: NotifyFn) => UnsubscibeFn;
  state: unknown;
};


type Message = {
  type: string;
};

