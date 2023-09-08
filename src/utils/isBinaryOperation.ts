import { BinaryOperationFormula } from 'types/formulas/binary-operation-formula';

export function isBinaryOperationFormula(
  formula: any
): formula is BinaryOperationFormula {
  return !!(formula.operation && formula.left && formula.right);
}
