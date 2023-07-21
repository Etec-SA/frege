import { InvalidFormulaException } from 'src/exceptions/invalid-formula.exception';
import { Formula } from './interfaces/formula';

/**
 * A class that provides methods to build formulas with
 * the artificial language of logic syntax.
 */


export class builder {
  private static operations = {
    Biconditional: this.biconditional,
    Conjunction: this.conjunction,
    Disjunction: this.disjunction,
    Implication: this.implication,
  };

  private static biconditional(left: Formula, right: Formula) {
    return `(${left} ↔ ${right})`;
  }

  private static conjunction(left: Formula, right: Formula) {
    return `(${left} ∧ ${right})`;
  }

  private static disjunction(left: Formula, right: Formula) {
    return `(${left} ∨ ${right})`;
  }

  private static implication(left: Formula, right: Formula) {
    return `(${left} -> ${right})`;
  }

  private static buildRecursively(formula: Formula) {
    if (typeof formula === 'string') return formula;

    if ('operation' in formula && formula.operation === 'Negation')
      return `¬(${this.buildFormula(formula.value)})`;

    if (!('operation' in formula)) throw new InvalidFormulaException('Invalid Formula.');

    const left = this.buildFormula(formula.left);
    const right = this.buildFormula(formula.right);
    const operation = formula.operation;

    return this.operations[operation](left, right);
  }

  /**
   * Builds a formula with the syntax of logic.
   * @param formula - The logical formula to build.
   * @returns The builded logical formula. 
   * @throws {InvalidFormulaException}
   */

  public static buildFormula(formula: Formula) {
    const result = this.buildRecursively(formula);
    return result as string;
  }
}
