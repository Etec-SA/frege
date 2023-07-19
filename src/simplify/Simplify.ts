import { Biconditional } from "src/builder/interfaces/operations/biconditional";
import { Conjunction } from "src/builder/interfaces/operations/conjunction";
import { Disjunction } from "src/builder/interfaces/operations/disjunction";
import { Implication } from "src/builder/interfaces/operations/implication";

export class simplify {
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
}

