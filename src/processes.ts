import { createContext, useContext } from 'react';

type Reg = {
  [key: string]: unknown;
};

export const ProcessContext = createContext<Reg>({});

export const useProcReg = ()=> useContext(ProcessContext);
