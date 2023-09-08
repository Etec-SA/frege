import { Formula } from 'types/formulas/formula';
import { MolecularFormula } from 'types/formulas/molecular-formula';

/**
 * Checks if the given formula is a molecular formula.
 * @param formula - The formula to check.
 * @returns True if the formula is a molecular formula, false otherwise.
 */

export function isMolecularFormula(
  formula: Formula
): formula is MolecularFormula {
  if (typeof formula === 'string') return false;

  if (formula.operation === 'Negation') return false;

  return true;
}
