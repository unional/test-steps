import { Step, RegExpStep } from './interfaces';

export function isRegExpStep(step: Step | RegExpStep): step is RegExpStep {
  return !!step['regex']
}
