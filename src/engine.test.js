// Guardrail tests. Run with: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildPlan, screenForHardStops } from './engine.js'
import { isDirectContact } from './data/roles.js'

test('legal screen runs before classification: a hard stop withholds classification', () => {
  const plan = buildPlan({
    stateId: 'TN',
    flags: { 'recent-complaint': true },
    laneId: 'performance', // user picked a lane, but it must NOT classify
    hasPriorDiscipline: true,
  })
  assert.equal(plan.status, 'hard-stop')
  assert.equal(plan.classification, null, 'classification must be withheld on a hard stop')
  assert.ok(plan.steps[0].kind === 'stop', 'plan must lead with the stop')
})

test('no hard stop → classification proceeds', () => {
  const plan = buildPlan({ stateId: 'TN', flags: {}, laneId: 'performance' })
  assert.equal(plan.status, 'proceed')
  assert.ok(plan.classification, 'classification should be present when clear')
  assert.equal(plan.classification.lane.id, 'performance')
})

test('every plan ends with a route-to-a-human step', () => {
  const cases = [
    { stateId: 'TN', flags: { whistleblower: true } }, // hard stop
    { stateId: 'TN', flags: {}, laneId: 'conduct' }, // proceed
    { stateId: 'other', flags: {} }, // proceed, no lane
  ]
  for (const c of cases) {
    const plan = buildPlan(c)
    const last = plan.steps[plan.steps.length - 1]
    assert.equal(last.kind, 'route', 'final step must be a route step')
    assert.ok(last.roleIds && last.roleIds.length > 0, 'route step must name people')
    const hasHuman = last.roleIds.some(isDirectContact)
    assert.ok(hasHuman, 'final route must include a direct-contact human')
  }
})

test('counsel/OGC is never routed as a direct contact', () => {
  // Trigger a hard stop that routes to employment-counsel.
  const plan = buildPlan({ stateId: 'TN', flags: { 'protected-leave': true } })
  const last = plan.steps[plan.steps.length - 1]
  assert.ok(
    last.roleIds.includes('employment-counsel'),
    'counsel should be in the routing set for this hard stop',
  )
  assert.equal(
    isDirectContact('employment-counsel'),
    false,
    'counsel must never be a direct contact',
  )
  // ...and a direct human must accompany it.
  assert.ok(last.roleIds.some(isDirectContact), 'a direct human must accompany counsel')
})

test('screenForHardStops is a pure function of the flags', () => {
  assert.equal(screenForHardStops({}).length, 0)
  assert.equal(screenForHardStops({ 'concerted-activity': true }).length, 1)
})
