import { Formula } from 'types/formulas/formula';
import { isBinaryOperationFormula } from './isBinaryOperation';
import { isNegation } from './isNegation';

export function eliminateDoubleNegations(formula: Formula): Formula {
  if (isNegation(formula)) {
    const innerValue = formula.value;

    if (isNegation(innerValue)) {
      return eliminateDoubleNegations(innerValue.value);
    }

    return {
      operation: 'Negation',
      value: eliminateDoubleNegations(innerValue),
    };
  }

  if (isBinaryOperationFormula(formula)) {
    return {
      operation: formula.operation,
      left: eliminateDoubleNegations(formula.left),
      right: eliminateDoubleNegations(formula.right),
    };
  }

  return formula;
}
