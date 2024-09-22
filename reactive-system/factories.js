import { Computed, Observable, ObservableOf } from "./entities.js";

const context = new Observable();

/**
 * @template T
 * 
 * @param {() => T} fn 
 * @returns 
 */
export const computed = (fn) => {
  const computed = new Computed(fn);

  context.subscribe(() => {
    computed.get();
  });

  return computed;
}

/**
 * @template T
 * 
 * @param {T} value 
 * @returns 
 */
export const observableOf = (value) => {
  const observable = new ObservableOf(value);

  observable.subscribe(context.notifyAll);

  return observable;
}

