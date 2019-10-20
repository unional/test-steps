import { ignoreFailure, warnFailure } from 'never-fail'
import { MissingHandler } from './errors';
import { findStep } from './findStep';
import { invokeStep } from './invokeStep';

export function createScenario(context: any) {
  const s = {
    ensure(clause: string, ...inputs: any[]) {
      return ignoreFailure(() => s.run(clause, ...inputs))
    },
    setup(clause: string, ...inputs: any[]) {
      return warnFailure(() => s.run(clause, ...inputs), `setup: ${clause}`)
    },
    teardown(clause: string, ...inputs: any[]) {
      return warnFailure(() => s.run(clause, ...inputs), `teardown: ${clause}`)
    },
    run(clause: string, ...inputs: any[]) {
      const step = findStep(clause)
      if (!step) throw new MissingHandler(clause)

      return Promise.resolve(invokeStep(step, context, clause, inputs))
    }
  }
  return s
}
