import t from 'assert'
import a from 'assertron'
import { createScenario, defineStep, MissingHandler } from '.';

describe('run', () => {
  test('no satisfying handler throws MissingHandler', async () => {
    const { run } = createScenario({})
    await a.throws(() => run('no handler'), MissingHandler)
  })
  test('call step', () => {
    let called = false
    defineStep('run: calls step', () => called = true)
    const { run } = createScenario({})
    run('run: calls step')
    t.strictEqual(called, true)
  })
  test('pass context to step', () => {
    let actual
    defineStep('run: passes context', (context) => actual = context)
    const context = { a: 1 }
    const { run } = createScenario(context)
    run('run: passes context')
    t.strictEqual(actual, context)
  })

  test('match simple string', () => {
    let called = false
    defineStep('run: simple string', () => called = true)
    const { run } = createScenario({})

    run('run: simple string')
    t(called)
  })

  test('matching simple template', () => {
    const values: string[] = []
    defineStep('run: {x} by template', (_, x) => { values.push(x) })

    const { run } = createScenario({})

    run('run: 1 by template')
    run('run: abc by template')
    run('run: abc-1 by template')
    run('run: abc-def by template')

    t.deepStrictEqual(values, ['1', 'abc', 'abc-1', 'abc-def'])
  })

  test('template can specify type', async () => {
    let values: any[] = []
    defineStep('run: {id:number} {enable:boolean} {pi:float}', (_, id, enable, pi) => {
      values.push(id, enable, pi)
    })

    const { run } = createScenario({})

    await run('run: 123 true 3.14')
    t.strictEqual(values[0], 123)
    t.strictEqual(values[1], true)
    t.strictEqual(values[2], 3.14)
  })

  test('template can take regex', async () => {
    let values: any[] = []
    defineStep(`run templateWithRegex {id:/\\d+/} remaining`, ({ }, id) => {
      values.push(id)
    })

    defineStep(`run templateWithRegexNSpace {id:/\\d{3} \\d{4}/} remaining`, ({ }, id) => {
      values.push(id)
    })
    let mm: any[] = []
    defineStep(`{method} {uri:/[\\w\\.\\/?=]*/} throws`, (_, method, uri) => {
      mm.push(method, uri)
    })

    const { run } = createScenario({})
    await run('run templateWithRegex 1 remaining')
    await run('run templateWithRegex 200 remaining')
    t.strictEqual(values[0], '1')
    t.strictEqual(values[1], '200')

    await run('run templateWithRegexNSpace 123 1234 remaining')
    t.strictEqual(values[2], '123 1234')

    await run('GET some/url/1.0/resources?a=b throws')
    t.strictEqual(mm[0], 'GET')
    t.strictEqual(mm[1], 'some/url/1.0/resources?a=b')
  })

  test('input from run is appended after template values', () => {
    const values: any[] = []
    defineStep('run: input append after template {x}', (context, x, ...inputs) => values.push(x, ...inputs))

    const { run } = createScenario({})
    run('run: input append after template abc', 1, 2, 3)
    t.deepStrictEqual(values, ['abc', 1, 2, 3])
  })
})

describe('ensure', () => {
  test('ignore failure', () => {
    defineStep('ensure: throws', () => { throw new Error('throwing') })
    defineStep('ensure: reject', () => Promise.reject('rejecting'))

    const { ensure } = createScenario({})
    ensure('ensure: throws')
    ensure('ensure: reject')
  })
})

describe('setup', () => {
  test('warn failure', () => {
    defineStep('setup: throws', () => { throw new Error('throwing') })
    defineStep('setup: reject', () => Promise.reject('rejecting'))

    const { setup } = createScenario({})
    setup('setup: throws')
    setup('setup: reject')
  })
})

describe('teardown', () => {
  test('warn failure', () => {
    defineStep('teardown: throws', () => { throw new Error('throwing') })
    defineStep('teardown: reject', () => Promise.reject('rejecting'))

    const { teardown } = createScenario({})
    teardown('teardown: throws')
    teardown('teardown: reject')
  })
})
