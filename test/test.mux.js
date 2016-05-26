/**
 * Created by tushar.mathur on 26/05/16.
 */

'use strict'

import {TestScheduler, ReactiveTest} from 'rx'
import test from 'ava'
import {mux} from '../src/muxer'

const {onNext} = ReactiveTest
test(t => {
  const sh = new TestScheduler()

  const mux$ = mux({
    a: sh.createHotObservable(
      onNext(210, 'a0'),
      onNext(220, 'a1')
    ),
    b: sh.createHotObservable(
      onNext(215, 'b0'),
      onNext(225, 'b1')
    )
  })
  const {messages} = sh.startScheduler(() => mux$)
  t.deepEqual(messages, [
    onNext(210, ['a', 'a0']),
    onNext(215, ['b', 'b0']),
    onNext(220, ['a', 'a1']),
    onNext(225, ['b', 'b1'])
  ])
})
