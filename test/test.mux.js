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
    onNext(210, {value: 'a0', key: 'a'}),
    onNext(215, {value: 'b0', key: 'b'}),
    onNext(220, {value: 'a1', key: 'a'}),
    onNext(225, {value: 'b1', key: 'b'})
  ])
})
