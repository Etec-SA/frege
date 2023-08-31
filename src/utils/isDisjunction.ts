import { Disjunction } from 'src/types/operations/binary-operations';
import { isBinaryOperationFormula } from './isBinaryOperation';

export function isDisjunction(formula: any): formula is Disjunction {
  return (
    formula.operation === 'Disjunction' && isBinaryOperationFormula(formula)
  );
}
