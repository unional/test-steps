import { ModuleError } from 'iso-error'

export class TestStepsError extends ModuleError {
  constructor(description: string, ...errors: Error[]) {
    super('test-steps', description, ...errors)
  }
}

export class DuplicateHandler extends TestStepsError {
  // istanbul ignore next
  constructor(public clause: string | RegExp) {
    super(`Handler for '${clause}' is already defined.`)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class MissingHandler extends TestStepsError {
  // istanbul ignore next
  constructor(public clause: string) {
    super(`Handler for '${clause}' not found.`)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
