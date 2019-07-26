import { store } from './store';
import { DuplicateHandler } from './errors';
import { findStep } from './findStep';

export function defineStep(clause: string, handler) {
  const step = findStep(clause)
  if (step && step.handler !== handler) throw new DuplicateHandler(clause)

  if (isTemplate(clause)) {
    const valueTypes: string[] = []
    const regex = new RegExp(`^${clause.replace(/{([\w-]*(:(number|boolean|float|string|\/(.*)\/))?)?}/g, (_, value) => {
      const m = /[\w]*:(.*)/.exec(value)
      const valueType = m ? m[1].trim() : 'string'
      const isRegex = valueType.startsWith('/')
      if (isRegex) {
        valueTypes.push('regex')
        return `(${valueType.slice(1, -1)})`
      }
      else {
        valueTypes.push(valueType)
        return '([\\w\\.\\-]*)'
      }
    })}$`)
    store.steps.push({ clause, handler, regex, valueTypes })
  }
  store.steps.push({ clause, handler })
}


function isTemplate(clause: string) {
  return clause.search(/{([\w-]*(:(number|boolean|float|string|\/(.*)\/))?)?}/) >= 0
}
