declare module 'pspki/xfetch.js';

declare type FetchState<DataType> = {
  data: DataType;
  code: 'pending' | 'loading' | 'ok' | 'error';
};
