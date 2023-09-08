export function buildConjunctionString(premises: string[]) {
  const conjunctionFormulaArray: string[] = premises.map(
    (premise) => `(${premise})`
  );
  const conjunctionFormulaString: string = conjunctionFormulaArray.join('∧');
  return conjunctionFormulaString;
}
