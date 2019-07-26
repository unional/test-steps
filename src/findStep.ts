import { isRegExpStep } from './isRegExpStep';
import { store } from './store';

export function findStep(clause: string) {
  return store.steps.find(s => {
    if (isRegExpStep(s)) {
      return s.regex.test(clause)
    }
    else {
      return s.clause === clause
    }
  })
}

