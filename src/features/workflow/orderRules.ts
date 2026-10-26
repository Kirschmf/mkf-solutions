import type { OrderInput } from './workflow.types';
export const calculateOrderTotal = (input:OrderInput):number => input.unitPriceCents*input.quantity+input.shippingCents;
export function validateOrder(input:OrderInput):Partial<Record<keyof OrderInput,string>> {
  const errors:Partial<Record<keyof OrderInput,string>>={};
  if (!input.product.trim() || input.product.trim().length>120) errors.product='Informe um produto de até 120 caracteres.';
  if (!Number.isSafeInteger(input.quantity)||input.quantity<=0) errors.quantity='Use uma quantidade inteira maior que zero.';
  if (!Number.isSafeInteger(input.stock)||input.stock<0) errors.stock='Use um estoque inteiro igual ou maior que zero.';
  if (!Number.isSafeInteger(input.unitPriceCents)||input.unitPriceCents<0) errors.unitPriceCents='Informe um preço válido, com até duas casas decimais.';
  if (!Number.isSafeInteger(input.shippingCents)||input.shippingCents<0) errors.shippingCents='Informe um frete válido, com até duas casas decimais.';
  if (!Object.keys(errors).length&&!Number.isSafeInteger(calculateOrderTotal(input))) errors.unitPriceCents='O total excede o limite seguro de cálculo.';
  return errors;
}
export const money = (cents:number) => Number.isFinite(cents)?new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(cents/100):'Valor inválido';
