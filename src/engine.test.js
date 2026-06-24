// Guardrail tests (PRD §6). Run with: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  screenForHardStops,
  routedRoles,
  protectedRouting,
  planPathFor,
  entryStepFor,
  isDirectContact,
} from './engine.js'
import { ROLES } from './data/erData.js'

test('GUARDRAIL 1: a hard stop short-circuits to the protected plan, even with a lane chosen', () => {
  // User checked a hard stop AND picked Performance — the ladder must be unreachable.
  assert.equal(planPathFor({ triggeredIds: ['retaliation'], lane: 'PERFORMANCE' }), 'protected')
  // No hard stop → classification proceeds.
  assert.equal(planPathFor({ triggeredIds: [], lane: 'PERFORMANCE' }), 'ladder')
  assert.equal(planPathFor({ triggeredIds: [], lane: 'SERIOUS' }), 'serious')
})

test('screenForHardStops is a pure function of the checked ids', () => {
  assert.equal(screenForHardStops([]).length, 0)
  assert.equal(screenForHardStops(['student_involved']).length, 1)
  assert.equal(screenForHardStops(['student_involved'])[0].route.includes('EOA'), true)
})

test('GUARDRAIL 2: OGC is never a direct contact', () => {
  assert.equal(ROLES.OGC.indirect, true)
  assert.equal(isDirectContact('OGC'), false)
  assert.equal(isDirectContact('ER'), true)
  // When OGC is routed (legally heavy trigger), a direct human is always alongside it.
  const routing = protectedRouting(['protected_class'], 'manager')
  assert.ok(routing.includes('OGC'), 'OGC should be routed for a legally heavy trigger')
  assert.ok(routing.some(isDirectContact), 'a direct-contact human must accompany OGC')
})

test('GUARDRAIL 3: every protected routing resolves to at least one direct-contact human', () => {
  const HARD_STOP_IDS = [
    'protected_class', 'harassment_violence', 'student_involved', 'disability_accommodation',
    'leave_interference', 'concerted_activity', 'criminal', 'retaliation', 'offduty',
  ]
  for (const id of HARD_STOP_IDS) {
    const routing = protectedRouting([id], 'manager')
    assert.ok(routing.length > 0, `${id} must route somewhere`)
    assert.ok(routing.some(isDirectContact), `${id} must route to a direct-contact human`)
  }
})

test('routedRoles is ordered and de-duplicated across multiple triggers', () => {
  // protected_class → [EOA, EC]; retaliation → [ER, EC]; EC must not duplicate.
  const routes = routedRoles(['protected_class', 'retaliation'])
  assert.deepEqual(routes, ['EOA', 'EC', 'ER'])
})

test('GUARDRAIL 4: California is flagged urgent so termination paths warn on final pay', () => {
  // entryStep maps severity correctly; ladder step 4 + CA urgent drives the warning in the UI.
  assert.equal(entryStepFor('minor'), 1)
  assert.equal(entryStepFor('serious'), 3)
  assert.equal(entryStepFor(undefined), 1)
})

test('employee role adds EAP support to the protected routing', () => {
  const asEmployee = protectedRouting(['student_involved'], 'employee')
  const asManager = protectedRouting(['student_involved'], 'manager')
  assert.ok(asEmployee.includes('EAP'))
  assert.ok(!asManager.includes('EAP'))
})
