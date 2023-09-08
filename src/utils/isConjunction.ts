import { Conjunction } from 'types/operations/binary-operations';
import { isBinaryOperationFormula } from './isBinaryOperation';

export function isConjunction(formula: any): formula is Conjunction {
  return (
    formula.operation === 'Conjunction' && isBinaryOperationFormula(formula)
  );
}
