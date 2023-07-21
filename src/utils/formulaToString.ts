import { builder } from "src/builder/Builder";
import { Formula } from "src/builder/interfaces/formula";

export function formulaToString(x: Formula): string {
  return builder.buildFormula(x);
}
