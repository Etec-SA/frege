import { Implication } from 'types/operations/binary-operations';
import { isBinaryOperationFormula } from './isBinaryOperation';

export function isImplication(formula: any): formula is Implication {
  return (
    formula.operation === 'Implication' && isBinaryOperationFormula(formula)
  );
}
