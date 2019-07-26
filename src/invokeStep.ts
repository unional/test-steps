import { isRegExpStep } from './isRegExpStep';
import { Step, RegExpStep } from './interfaces';

export function invokeStep(step: Step | RegExpStep, context, clause, inputs) {
  if (isRegExpStep(step)) {
    // regex must pass as it is tested above
    const matches = step.regex.exec(clause)!
    const values = matches.slice(1, matches.length).map((v, i) => {
      const valueType = step.valueTypes![i]
      if (valueType === 'number')
        return parseInt(v, 10)
      if (valueType === 'boolean')
        return v === 'true'
      if (valueType === 'float')
        return parseFloat(v)
      return v
    })
    return step.handler(context, ...[...values, ...inputs])
  }
  return step.handler(context, ...inputs)
}
