import { describe, expect, it } from 'vitest';
import { calculateOrderTotal, validateOrder } from './orderRules';
import { createWorkflow, workflowReducer } from './workflowReducer';
import { buildOrderArtifacts } from './orderArtifacts';
import { defaultInput } from './presets';
import type { WorkflowEvent, WorkflowState, OrderInput } from './workflow.types';

const runId = 'test-1';
const event = (state: WorkflowState, type: string, rest = {}) => workflowReducer(state, {type, runId:state.runId, ...rest} as WorkflowEvent);
function toPayment(input: OrderInput = defaultInput) {
  let state = event(createWorkflow(input,runId), 'START');
  state = event(state,'NEXT'); // normalize
  state = event(state,'NEXT'); // stock
  return event(state,'NEXT'); // commercial rule
}
function complete() {
  let state = toPayment();
  state = event(state,'PAYMENT',{confirmed:true});
  state = event(state,'REGISTER_RESULT',{success:true,recordId:'DEMO-1',at:'2026-10-26T12:00:00Z'});
  return event(state,'NEXT');
}

describe('operational rules', () => {
  it('calculates cents and validates the order before running', () => {
    expect(calculateOrderTotal(defaultInput)).toBe(25800);
    expect(validateOrder(defaultInput)).toEqual({});
    expect(validateOrder({...defaultInput,product:'   '})).toHaveProperty('product');
  });
  it.each([0,-1,1.5,Infinity])('blocks invalid quantity %s',quantity => {
    expect(validateOrder({...defaultInput,quantity})).toHaveProperty('quantity');
  });
  it.each([-1,Infinity,NaN,0.5])('blocks invalid cents %s',unitPriceCents => {
    expect(validateOrder({...defaultInput,unitPriceCents})).toHaveProperty('unitPriceCents');
    expect(validateOrder({...defaultInput,shippingCents:unitPriceCents})).toHaveProperty('shippingCents');
  });
  it('requires commercial approval only above 30000 cents', () => {
    expect(toPayment({...defaultInput,quantity:1,unitPriceCents:28200}).pendingDecision).toBe('payment');
    const state = toPayment({...defaultInput,quantity:1,unitPriceCents:28201});
    expect(state.pendingDecision).toBe('approval');
    expect(event(state,'NEXT')).toBe(state);
    expect(event(state,'APPROVE').pendingDecision).toBe('payment');
  });
  it('waits for a person to confirm payment, then completes with one stock debit', () => {
    const waiting=toPayment();
    expect(waiting.stage).toBe('payment');
    expect(event(waiting,'NEXT')).toBe(waiting);
    const state=complete();
    expect(state.status).toBe('completed');
    expect(state.remainingStock).toBe(3);
    expect(state.registered.id).toBe('DEMO-1');
    expect(event(state,'REGISTER_RESULT',{success:true,recordId:'DUPLICATE'})).toBe(state);
  });
  it('blocks insufficient stock and allows reduction or replenishment', () => {
    let state=event(event(createWorkflow({...defaultInput,stock:1},runId),'START'),'NEXT');
    state=event(state,'NEXT');
    expect(state.pendingDecision).toBe('stock');
    expect(state.remainingStock).toBe(1);
    const reduced=event(state,'RESOLVE_STOCK',{quantity:1,stock:1});
    expect(reduced.order.totalCents).toBe(13800);
    expect(reduced.stage).toBe('approval');
    expect(event(state,'RESOLVE_STOCK',{quantity:2,stock:5}).remainingStock).toBe(5);
    expect(event(state,'RESOLVE_STOCK',{quantity:2,stock:0}).pendingDecision).toBe('stock');
  });
  it('cancels before registering without changing stock and cannot silently cancel after registration', () => {
    const cancelled=event(toPayment(),'CANCEL');
    expect(cancelled.status).toBe('cancelled');
    expect(cancelled.remainingStock).toBe(5);
    const done=complete();
    expect(event(done,'CANCEL')).toBe(done);
  });
  it('recovers refused payment without bypassing the confirmation', () => {
    const denied=event(toPayment(),'PAYMENT',{confirmed:false});
    expect(denied.status).toBe('failed');
    expect(denied.registered).toBeNull();
    const retry=event(denied,'RETRY');
    expect(retry.pendingDecision).toBe('payment');
    expect(event(retry,'NEXT')).toBe(retry);
  });
  it('rejects approval and preserves inventory', () => {
    const state=event(toPayment({...defaultInput,quantity:3}),'REJECT_APPROVAL');
    expect(state.status).toBe('cancelled');
    expect(state.remainingStock).toBe(5);
  });
  it('retries failed registration without creating or deducting twice', () => {
    let state=event(toPayment(),'PAYMENT',{confirmed:true});
    state=event(state,'REGISTER_RESULT',{success:false});
    expect(state.status).toBe('failed');
    expect(state.remainingStock).toBe(5);
    state=event(state,'RETRY');
    state=event(state,'REGISTER_RESULT',{success:true,recordId:'ONCE',at:'now'});
    expect(state.remainingStock).toBe(3);
    expect(event(state,'REGISTER_RESULT',{success:true,recordId:'TWICE'})).toBe(state);
  });
  it('ignores stale callbacks after reset and pauses all advancement', () => {
    const active=event(createWorkflow(defaultInput,runId),'START');
    const paused=event(active,'PAUSE');
    expect(event(paused,'NEXT')).toBe(paused);
    const reset=event(paused,'RESET',{newRunId:'test-2'});
    expect(workflowReducer(reset,{type:'NEXT',runId})).toBe(reset);
    expect(reset.stage).toBe('edit');
    expect(event(event(paused,'RESUME'),'NEXT').stage).toBe('stock');
  });
  it('pauses when inputs change and requires a reset', () => {
    const changed=event(toPayment(),'UPDATE_INPUT',{input:{...defaultInput,quantity:3}});
    expect(changed.dirty).toBe(true);
    expect(changed.status).toBe('paused');
    expect(event(changed,'RESUME')).toBe(changed);
    expect(event(changed,'PAYMENT',{confirmed:true})).toBe(changed);
  });
  it('exports the completed snapshot and escapes CSV names', () => {
    const state=complete();
    const artifacts=buildOrderArtifacts(state);
    const json=JSON.parse(artifacts.orderJson);
    expect(json.order.totalCents).toBe(25800);
    expect(json.stock).toEqual({before:5,after:3});
    expect(artifacts.itemsCsv).toContain('"Produto de demonstração",2,12000,1800,25800');
    expect(()=>buildOrderArtifacts(toPayment())).toThrow();
  });
});
