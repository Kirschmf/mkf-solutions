export type OrderInput = {product:string;unitPriceCents:number;quantity:number;stock:number;shippingCents:number};
export type Stage = 'edit'|'validate'|'stock'|'approval'|'payment'|'register'|'message'|'report';
export type WorkflowStatus = 'idle'|'running'|'paused'|'blocked'|'failed'|'completed'|'cancelled';
export type NormalizedOrder = OrderInput & {totalCents:number};
export type HistoryEntry = {sequence:number;from:Stage;to:Stage;event:string;detail:string;payload:Record<string,unknown>};
export type WorkflowState = {
  runId:string; stage:Stage; status:WorkflowStatus; input:OrderInput;
  order:NormalizedOrder|null; remainingStock:number; pendingDecision:'stock'|'approval'|'payment'|null;
  error:string|null; fieldErrors:Partial<Record<keyof OrderInput,string>>;
  history:HistoryEntry[]; registered:{id:string;at:string}|null;
  dirty:boolean; message:string; approval:'not-required'|'approved'|null;
};
type Scoped = {runId:string};
export type WorkflowEvent = Scoped & (
  | {type:'START'|'NEXT'|'PAUSE'|'RESUME'|'APPROVE'|'REJECT_APPROVAL'|'RETRY'|'CANCEL'}
  | {type:'RESET';newRunId:string;input?:OrderInput}
  | {type:'UPDATE_INPUT';input:OrderInput}
  | {type:'RESOLVE_STOCK';quantity:number;stock:number}
  | {type:'PAYMENT';confirmed:boolean}
  | {type:'REGISTER_RESULT';success:boolean;recordId?:string;at?:string}
);
