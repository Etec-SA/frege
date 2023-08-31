import { eliminateDoubleNegations } from "./eliminateDoubleNegation";
import { isNegation } from "./isNegation";
import { Formula } from "src/types/formulas/formula";

export function haveEvenNumberOfNegations(formula: Formula) {
  if (!isNegation(formula)) return true;

  formula = eliminateDoubleNegations(formula);
  return !isNegation(formula);
}
