import { useState, useEffect, useRef } from 'react';
import { spawn, Process, Message } from 'pspki/core.js';
import { useProcReg } from './processes';

export function useProcess<StateType>(procFn : unknown, procName: string, procArgs: unknown) {
  const [ pstate, setPstate ] = useState<StateType | null>(null);
  const refArgs = useRef(procArgs);
  const refProc = useRef<Process | null>(null);
  const procReg = useProcReg();

  function send(msg: Message) {
    if(!refProc.current) {
      throw new Error('Nowhere to send');
    }
    refProc.current.send(msg);
  }

  useEffect(() => {
    function update() {
      setPstate({...proc.state as StateType});
    }

    let proc: Process = procReg[procName] || spawn(procFn, procName)(refArgs.current);
    let un = proc.subscribe(update);
    procReg[procName] = proc;

    proc.wait().then(() => {
      delete procReg[procName];
    });

    refProc.current = proc;
    return () => {
      if (un) {
        un();
      }
      proc.send({type: 'STOP'});
    };
  }, [procFn, procName, refArgs, procReg]);
  return { pstate, send };

}

