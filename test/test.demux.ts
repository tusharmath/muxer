/**
 * Created by tushar.mathur on 26/05/16.
 */

import {TestScheduler} from 'rxjs/testing'
import test from 'ava'
import {demux, mux} from '../src/muxer'

test(t => {
  const sh = new TestScheduler(t.deepEqual)
  sh.run(({expectObservable, hot}) => {
    const upper = hot('--A--B---C-D--|')
    const lower = hot('----ab---c----d----|')
    const mux$ = mux({upper, lower})
    const expected = '-a-----c---|'
    const [_, rest$] = demux(mux$)
    expectObservable(rest$).toBe(expected)
  })
})

test(t => {
  const sh = new TestScheduler(t.deepEqual)
  sh.run(({expectObservable, hot}) => {
    const upper$ = hot('--A--B---C-D--|')
    const lower$ = hot('----ab---c----d----|')
    const mux$ = mux({upper$, lower$})
    const expected = '-a-----c---|'
    const [source, _] = demux(mux$, 'upper')
    expectObservable(source.upper).toBe(expected)
  })
})
