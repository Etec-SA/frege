import { Negation } from 'types/operations/unary-operation';

export function isNegation(formula: any): formula is Negation {
  return formula.operation === 'Negation' && !!formula.value;
}
