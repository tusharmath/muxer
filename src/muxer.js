/**
 * Created by tushar.mathur on 26/05/16.
 */

'use strict'
import {Observable as O} from 'rx'
const tuple = a => b => [a, b]
const createStream = sources => key => sources[key].map(tuple(key))
const match = key => ([_key]) => _key === key
const first = x => x[1]
const noMatch = keys => ([key]) => keys.indexOf(key) === -1

/**
 * Creates a multiplexed stream from all the input streams
 * @function
 * @param {Object} sources - Dictionary of source streams.
 * @returns {external:Observable} Multiplexed stream
 */
export const mux = sources => {
  const keys = Object.keys(sources)
  return O.merge(keys.map(createStream(sources)))
}

/**
 * De-multiplexes the source stream
 * @function
 * @param {external:Observable} source$ - Input multiplexed stream
 * @param {...String} keys - Map of source streams
 * @returns {Array} Tuple of the selected streams and the rest of them
 */
export const demux = (source$, ...keys) => {
  const createSource = (source, key) => {
    const t$ = source$.filter(match(key)).map(first)
    return {...source, [key]: t$}
  }

  const rest$ = source$.filter(noMatch(keys)).map(first)
  const source = keys.reduce(createSource, {})
  return [source, rest$]
}

/**
 * An observable is an interface that provides a generalized mechanism for push-based notification,
 * also known as observer design pattern.
 * @external Observable
 * @see {@link https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md RxJS Observable}
 */
