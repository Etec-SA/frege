import { builder } from "src/builder/Builder";
import { Formula } from "src/builder/interfaces/formula";
import { Biconditional } from "src/builder/interfaces/operations/biconditional";
import { Conjunction } from "src/builder/interfaces/operations/conjunction";
import { Disjunction } from "src/builder/interfaces/operations/disjunction";
import { Implication } from "src/builder/interfaces/operations/implication";

export class simplify {

  public static simplifyFormula(x: Formula): Formula {
    if (typeof x === 'string') return x;

    if (!('operation' in x)) return x;

    if (x.operation === 'Biconditional')
      return this.simplifyFormula(this.biconditional(x));

    if (x.operation === 'Implication')
      return this.implication(x);

    if (x.operation === 'Conjunction')
      return this.conjunction(x);

    if (x.operation === 'Disjunction')
      return this.disjunction(x);
  }

  public static biconditional(x: Biconditional) {
    const firstImplication: Implication = {
      operation: 'Implication',
      left: x.left,
      right: x.right
    };

    const secondImplication: Implication = {
      operation: 'Implication',
      right: x.left,
      left: x.right
    };

    const simplifiedBiconditional: Conjunction = {
      operation: 'Conjunction',
      left: firstImplication,
      right: secondImplication
    };

    return simplifiedBiconditional;
  }

  public static implication(x: Implication) {
    const simplifiedImplication: Disjunction = {
      operation: 'Disjunction',
      left: {
        operation: 'Negation',
        value: x.left
      },
      right: x.right
    };

    return simplifiedImplication;
  }

  public static conjunction(x: Conjunction): Formula {
    const simplifiedConjunction: Conjunction = {
      operation: 'Conjunction',
      left: this.simplifyFormula(x.left),
      right: this.simplifyFormula(x.right),
    };

    return simplifiedConjunction;
  }

  public static disjunction(x: Disjunction): Formula {
    const simplifiedDisjunction: Disjunction = {
      operation: 'Disjunction',
      left: this.simplifyFormula(x.left),
      right: this.simplifyFormula(x.right),
    };

    return simplifiedDisjunction;
  }
}
