export type TestFunction = (description: string, handler: () => void | Promise<any>) => void

export function defineTest<F>(fn: (test: TestFunction) => F) {
  const { test, only, skip } = defineTest.options
  if (!test) throw new Error(`Unable to find test function. Please specify it in 'defineTest.options.test'`)
  if (!only) throw new Error(`Unable to find test.only function. Please specify it in 'defineTest.options.only'`)
  if (!skip) throw new Error(`Unable to find test.skip function. Please specify it in 'defineTest.options.skip'`)
  return Object.assign(fn(test), { only: fn(only), skip: fn(skip) })
}

defineTest.options = {
  test: it || test,
  only: (it && it.only) || (test && test.only),
  skip: xit || (it && it.skip) || (test && test.skip)
} as {
  test: TestFunction,
  only: TestFunction,
  skip: TestFunction
}
