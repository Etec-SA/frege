import { Biconditional } from 'types/operations/binary-operations';
import { isBinaryOperationFormula } from './isBinaryOperation';

export function isBiconditional(formula: any): formula is Biconditional {
  return (
    formula.operation === 'Biconditional' && isBinaryOperationFormula(formula)
  );
}
