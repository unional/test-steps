import { ignoreFailure, warnFailure } from 'never-fail'
import { MissingHandler } from './errors';
import { findStep } from './findStep';
import { invokeStep } from './invokeStep';

export function createScenario(context) {
  const s = {
    ensure(clause: string, ...inputs) {
      return ignoreFailure(() => s.run(clause, ...inputs))
    },
    setup(clause: string, ...inputs) {
      return warnFailure(() => s.run(clause, ...inputs), `setup: ${clause}`)
    },
    teardown(clause: string, ...inputs) {
      return warnFailure(() => s.run(clause, ...inputs), `teardown: ${clause}`)
    },
    run(clause: string, ...inputs) {
      const step = findStep(clause)
      if (!step) throw new MissingHandler(clause)

      return Promise.resolve(invokeStep(step, context, clause, inputs))
    }
  }
  return s
}
