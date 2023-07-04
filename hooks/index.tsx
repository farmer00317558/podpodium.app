import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export function usePersistState<S = undefined>(
  persistKey: string,
  initialState: S,
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(initialState);
  const ls = globalThis.localStorage;

  useEffect(() => {
    const content = ls?.getItem(persistKey);
    if (content) {
      try {
        const localState = JSON.parse(content);
        setState(localState);
      } catch {
        console.error('parse persist content error, key:', persistKey, ', data:', content);
      }
    }
  }, [ls, persistKey]);

  useEffect(() => {
    ls?.setItem(persistKey, JSON.stringify(state));
  }, [ls, persistKey, state]);

  return [state, setState];
}

export function useScrollTo(target: HTMLElement | null, callback: IntersectionObserverCallback) {
  useEffect(() => {
    if (!target) {
      return () => null;
    }
    let options = {
      root: target.offsetParent,
      rootMargin: '0px',
      threshold: 1.0,
    };

    let observer = new IntersectionObserver((entries, observer) => {
      if (entries?.[0]?.isIntersecting) {
        callback(entries, observer);
      }
    }, options);
    observer.observe(target);
    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [callback, target]);
}

export function useInput(defaultValue: string): {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
} {
  const [value, setValue] = useState<string>(defaultValue);
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);
  return useMemo(
    () => ({
      value,
      onChange,
    }),
    [onChange, value],
  );
}

interface ISecondCountDownRet {
  current: number;
  done: boolean;
}

export function useSecondCountDown(value: number): [ret: ISecondCountDownRet, start: () => void] {
  const [ret, setRet] = useState({ current: value, done: true });
  const timer = useRef<number>(0);

  const start = useCallback(() => {
    setRet((i) => ({ ...i, done: false }));
    timer.current = window.setInterval(() => {
      setRet((i) => {
        const current = i.current - 1;
        return {
          ...i,
          current,
        };
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (ret.current <= 0 && !ret.done) {
      window.clearInterval(timer.current);
      setRet({ current: value, done: true });
    }
  }, [ret, value]);

  return [ret, start];
}
