export class Simplify {
  private static implicationRegex = /(.*)->(.*)/;
  private static biconditionalRegex = /(.*)<->(.*)/;

  private static simplifyImplication(expression: string): string {
    const matches = expression.match(this.implicationRegex);

    if (!matches) return expression;

    if (matches.length != 3) return expression;

    const p = matches[1].trim();
    const q = matches[2].trim();
    const negatedP = `¬${p}`;

    return `(${negatedP} ∨ ${q})`;
  }

  private static simplifyBiconditional(expression: string): string {
    const matches = expression.match(this.biconditionalRegex);

    if (!matches) return expression;

    if (matches.length !== 3) return expression;


    const p = matches[1].trim();
    const q = matches[2].trim();
    const pImplyQ = this.simplifyImplication(`${p} -> ${q}`);
    const qImplyP = this.simplifyImplication(`${q} -> ${p}`);

    return `(${pImplyQ} ^ ${qImplyP})`;
  }
}
