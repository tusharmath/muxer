/**
 * Created by tushar.mathur on 26/05/16.
 */

'use strict'

import {TestScheduler, ReactiveTest} from 'rx'
import test from 'ava'
import {demux, mux} from '../src/muxer'

const {onNext} = ReactiveTest

test(t => {
  const sh = new TestScheduler()
  const obA = sh.createObserver()
  const obB = sh.createObserver()
  const obR = sh.createObserver()
  const mux$ = mux({
    a$: sh.createColdObservable(
      onNext(210, 'a0'),
      onNext(220, 'a1')
    ),
    b$: sh.createColdObservable(
      onNext(215, 'b0'),
      onNext(225, 'b1')
    ),
    r$: sh.createColdObservable(
      onNext(220, 'r0'),
      onNext(225, 'r1')
    )
  })

  const [{a$, b$}, r$] = demux(mux$, 'a$', 'b$')

  a$.subscribe(obA)
  b$.subscribe(obB)
  r$.subscribe(obR)
  sh.start()

  t.deepEqual(obA.messages, [
    onNext(210, 'a0'),
    onNext(220, 'a1')
  ])

  t.deepEqual(obB.messages, [
    onNext(215, 'b0'),
    onNext(225, 'b1')
  ])

  t.deepEqual(obR.messages, [
    onNext(220, 'r0'),
    onNext(225, 'r1')
  ])
})

test('default', t => {
  const sh = new TestScheduler()
  const mux$ = mux({
    a$: sh.createHotObservable(
      onNext(210, 'a0'),
      onNext(220, 'a1')
    ),
    b$: sh.createHotObservable(
      onNext(215, 'b0'),
      onNext(225, 'b1')
    )
  })

  const [_, rest$] = demux(mux$)
  const {messages} = sh.startScheduler(() => rest$)
  t.deepEqual(messages, [
    onNext(210, 'a0'),
    onNext(215, 'b0'),
    onNext(220, 'a1'),
    onNext(225, 'b1')
  ])
})
