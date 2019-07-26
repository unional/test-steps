import t from 'assert'
import a from 'assertron'
import { defineStep } from './defineStep';
import { DuplicateHandler } from './errors';

test('duplicate handler throws DuplicateHandler', async () => {
  defineStep('duplicate handler', () => { return })
  const err = await a.throws(() => defineStep('duplicate handler', () => { return }), DuplicateHandler)
  t.strictEqual(err.message, `Handler for 'duplicate handler' is already defined.`)
})

test('calling the same defineStep two times is fine', async () => {
  const h = () => { return }
  defineStep('same handler', h)
  defineStep('same handler', h)
})
