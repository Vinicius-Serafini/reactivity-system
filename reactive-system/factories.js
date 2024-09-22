import { Computed, Observable, ObservableOf } from "./entities.js";

const globalContext = new Observable();

/**
 * @template T
 * 
 * @param {() => T} fn 
 * @param {Observable} context
 */
const _computed = (fn, context) => {
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
 * @param {Observable} context
 */
const _observableOf = (value, context) => {
  const observable = new ObservableOf(value);

  observable.subscribe(context.notifyAll);

  return observable;
}

/** 
 * @param {import("./entities.js").Watchable} watchable 
 * @param {(value: T) => void} fn
 * 
 * @returns {() => void} stop function
 */
const _watch = (watchable, fn, context) => {
  const handler = () => {
    fn(watchable.get());
  }

  context.subscribe(handler);

  const unsubscribe = () => {
    context.unsubscribe(handler);
  };

  return unsubscribe;
}

export const computed = /** @param {() => T} fn */ (fn) => _computed(fn, globalContext);
export const observableOf = /** @param {T} value */ (value) => _observableOf(value, globalContext);
export const watch = /** @param {import("./entities.js").Watchable} watchable */ (watchable, fn) => _watch(watchable, fn, globalContext);