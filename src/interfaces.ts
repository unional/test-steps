export interface Step {
  clause: string,
  handler: Function,
}

export interface RegExpStep extends Step {
  regex: RegExp,
  valueTypes: string[]
}
