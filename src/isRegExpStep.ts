import { RegExpStep } from './types';

export function isRegExpStep(step: any): step is RegExpStep {
  return !!step['regex']
}
