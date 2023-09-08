import { Conjunction } from 'types/operations/binary-operations';
import { isDeepStrictEqual } from 'util';
import { eliminateDoubleNegations } from './eliminateDoubleNegation';

export function isContradiction(formula: Conjunction): boolean {
  formula = eliminateDoubleNegations(formula) as Conjunction;
  const firstCondition = isDeepStrictEqual(formula, {
    operation: 'Conjunction',
    left: formula.left,
    right: { operation: 'Negation', value: formula.left },
  });

  const secondCondition = isDeepStrictEqual(formula, {
    operation: 'Conjunction',
    left: { operation: 'Negation', value: formula.right },
    right: formula.right,
  });

  return firstCondition || secondCondition;
}
