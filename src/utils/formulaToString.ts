import { builder } from 'src/builder/Builder';
import { Formula } from 'src/types/formulas/formula';

export function formulaToString(x: Formula): string {
  return builder.buildFormula(x);
}
