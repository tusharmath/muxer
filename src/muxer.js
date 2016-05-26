/**
 * Created by tushar.mathur on 26/05/16.
 */

'use strict'
import {Observable as O} from 'rx'

/**
 * Creates a multiplexed stream from all the input streams
 * @function
 * @param {Object} sources - Dictionary of source streams.
 * @returns {external:Observable} Multiplexed stream
 */
export const mux = sources => {
  const createStream = key => sources[key].map(value => ({key, value}))
  const keys = Object.keys(sources)
  return O.merge(keys.map(createStream))
}

/**
 * De-multiplexes the source stream
 * @function
 * @param {external:Observable} source$ - Input multiplexed stream
 * @param {...String} keys - Map of source streams
 * @returns {Array} Tuple of the selected streams and the rest of them
 */
export const demux = (source$, ...keys) => {
  const createSource = (source, _key) => {
    const t$ = source$.filter(({key}) => key === _key).pluck('value')
    return {...source, [_key]: t$}
  }
  const rest$ = source$.filter(({key}) => keys.indexOf(key) === -1).pluck('value')
  const source = keys.reduce(createSource, {})
  return [source, rest$]
}

/**
 * An observable is an interface that provides a generalized mechanism for push-based notification,
 * also known as observer design pattern.
 * @external Observable
 * @see {@link https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md RxJS Observable}
 */
