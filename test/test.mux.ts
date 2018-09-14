/**
 * Created by tushar.mathur on 26/05/16.
 */

'use strict'

import {TestScheduler} from 'rxjs/testing'
import test from 'ava'
import {mux} from '../src/muxer'

test(t => {
  const sh = new TestScheduler(t.deepEqual.bind(t))
  sh.run(({expectObservable, hot}) => {
    const upper = hot('--A--B---C-D--|')
    const lower = hot('----ab---c----d----|')
    const expected = '-a-----c---|'
    expectObservable(mux({upper, lower})).toBe(expected)
  })
})
