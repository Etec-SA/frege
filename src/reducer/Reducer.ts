import {
  Formula,
  Biconditional,
  Conjunction,
  Implication,
  Disjunction,
  Negation,
} from 'types';

/**
 * A class that provides methods to reduce formulas, which use implication or biconditional, to use only negations, conjunctions and disjunctions.
 */
export class Reducer {
  /**
   * Recursively reduces a logical formula to its reduced form based on its operation.
   * @param x - The logical formula to reduce.
   * @returns The reduced logical formula.
   */
  private static reduceFormula(x: Formula) {
    if (typeof x === 'string') return x;

    switch (x.operation) {
      case 'Biconditional':
        return this.biconditional(x);
      case 'Implication':
        return this.implication(x);
      case 'Conjunction':
        return this.conjunction(x);
      case 'Disjunction':
        return this.disjunction(x);
      case 'Negation':
        return this.negation(x);
      default:
        throw new Error('Invalid operation');
    }
  }

  /**
   * Reduces a Biconditional to a Conjunction.
   * @param x - The Biconditional operation to reduce.
   * @returns The reduced Conjunction formula.
   */
  public static biconditional(x: Biconditional): Conjunction {
    const left = this.reduceFormula(x.left);
    const right = this.reduceFormula(x.right);

    const reducedLeft = this.reduceFormula({
      operation: 'Implication',
      left: left,
      right: right,
    });

    const reducedRight = this.reduceFormula({
      operation: 'Implication',
      left: right,
      right: left,
    });

    return {
      operation: 'Conjunction',
      left: reducedLeft,
      right: reducedRight,
    };
  }

  /**
   * Reduces an Implication to a Disjunction
   * @param x - The formula to reduce.
   * @returns The reduced Disjunction formula.
   */
  public static implication(x: Implication): Disjunction {
    const left = this.reduceFormula(x.left);
    const right = this.reduceFormula(x.right);

    return {
      operation: 'Disjunction',
      left: {
        operation: 'Negation',
        value: left,
      },
      right: right,
    };
  }

  /**
   * Reduces both sides of a Conjunction
   * @param x - The formula to reduce.
   * @returns The reduced Conjunction formula.
   */
  public static conjunction(x: Conjunction): Conjunction {
    const left = this.reduceFormula(x.left);
    const right = this.reduceFormula(x.right);

    return {
      operation: 'Conjunction',
      left: left,
      right: right,
    };
  }

  /**
   * Reduces both sides of a Disjunction
   * @param x - The formula to reduce.
   * @returns The reduced Disjunction formula.
   */
  public static disjunction(x: Disjunction): Disjunction {
    const left = this.reduceFormula(x.left);
    const right = this.reduceFormula(x.right);

    return {
      operation: 'Disjunction',
      left: left,
      right: right,
    };
  }

  /**
   * Reduces the negated formula
   * @param x - The formula to reduce.
   * @returns The reduced Negation formula.
   */
  public static negation(x: Negation): Negation {
    const value = this.reduceFormula(x.value);

    return {
      operation: 'Negation',
      value,
    };
  }
}
