/**
 * Created by tushar.mathur on 26/05/16.
 */

import {Observable, merge} from 'rxjs'
import * as O from 'rxjs/operators'

type Sources = {[key: string]: Observable<any>}
type SourceStream<T = any> = Observable<[string, T]>

const tuple = <A>(a: A) => <B>(b: B) => [a, b]
const createStream = <T extends Sources>(sources: T) => (key: keyof T) =>
  O.map(tuple(key), sources[key])
const match = (key: string) => ([_key]: [string, any]) => _key === key
const first = <T>(x: Array<T>) => x[1]
const noMatch = (keys: string[]) => ([key]: [string, any]) =>
  keys.indexOf(key) === -1

/**
 * Creates a multiplexed stream from all the input streams
 * @function
 * @example
 * const mux$ = mux({
 *   a: O.just(1),
 *   b: O.just(2),
 *   c: O.just(3)
 * })
 * mux$.subscribe(x => log(x)) // OUTPUTS: ['a', 1], ['b', 2], ['c', 3]
 * @param {Object} sources - Dictionary of source streams.
 * @returns {external:Observable} Multiplexed stream
 */
export const mux = <T extends Sources>(
  sources: T
): Observable<[string, any]> => {
  const keys = Object.keys(sources)
  return merge(...keys.map(createStream(sources)))
}

/**
 * De-multiplexes the source stream
 * @function
 * @example
 * const mux$ = mux({
 *   a: O.just(1),
 *   b: O.just(2),
 *   c: O.just(3)
 * })
 * const [{a, b}, rest] = demux(mux$, 'a', 'b')
 * a.subscribe(x => log(x)) // OUTPUTS: 1
 * b.subscribe(x => log(x)) // OUTPUTS: 2
 * rest.subscribe(x => log(x)) // OUTPUTS: 3
 * @param {external:Observable} source$ - Input multiplexed stream
 * @param {...String} keys - Map of source streams
 * @returns {Array} Tuple of the selected streams and the rest of them
 */
export const demux = (
  source$: SourceStream,
  ...keys: Array<string>
): [Sources, Observable<any>] => {
  const createSource = (source: Sources, key: string) => {
    const t$ = source$.pipe(
      O.filter(match(key)),
      O.map(first)
    )
    return {...source, [key]: t$}
  }

  const rest$ = source$.pipe(
    O.filter(noMatch(keys)),
    O.map(first)
  )
  const source = keys.reduce(createSource, {})
  return [source, rest$]
}

/**
 * An observable is an interface that provides a generalized mechanism for push-based notification,
 * also known as observer design pattern.
 * @external Observable
 * @see {@link https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md RxJS Observable}
 */
