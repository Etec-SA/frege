import { Proof, ProofItem, inferenceRulesMap } from "src/types/syntactic/proof";
import { isProofItemInferred } from "src/utils/isProofItemInferred";
import { parseToFormulaObject } from "src/utils/parse";

export class ProofChecker {
  static check(proof: Proof) {
    const premises: ProofItem['expression'][] = [];

    Object.keys(proof).forEach((_, idx) => {
      const item = proof[idx + 1];

      if (isProofItemInferred(item)) {
        const inferenceRule = item.from[1];
        inferenceRulesMap[inferenceRule](item, proof);
        console.log(
          '\x1b[32m',
          `Applied ${inferenceRule} with success at line ${item.id} ✔️`,
        );
      } else if (item.type === 'Premisse') {
        premises.push(item.expression);
      }
    });
  }
}

const proof: Proof = {
  1: {
    id: 1,
    expression: {
      operation: 'Conjunction',
      left: { operation: 'Negation', value: 'P' },
      right: { operation: 'Negation', value: 'Q' }
    },
    type: 'Premisse'
  },
  2: {
    id: 2,
    expression: { operation: 'Disjunction', left: 'P', right: 'Q' },
    type: 'Hypothesis',
  },
  3: {
    id: 3,
    expression: { operation: 'Negation', value: 'P' },
    type: 'Knowledge',
    from: [[1], 'Conjunction Elimination'],
  },
  4: {
    id: 4,
    expression: { operation: 'Negation', value: 'Q' },
    type: 'Knowledge',
    from: [[1], 'Conjunction Elimination'],
  },
  5: {
    id: 5,
    expression: 'P',
    type: 'Knowledge',
    from: [[4, 2], 'Disjunctive Syllogism']
  },
  6: {
    id: 6,
    expression: { operation: 'Conjunction', left: 'P', right: { operation: 'Negation', value: 'P' } },
    type: 'End of Hypothesis',
    from: [[3, 5], 'Conjunction Introduction'],
    hypothesisId: 2
  },
  7: {
    id: 7,
    expression: {
      operation: 'Implication',
      left: { operation: 'Disjunction', left: 'P', right: 'Q' },
      right: { operation: 'Conjunction', left: { operation: 'Negation', value: 'P' }, right: 'P' },
    },
    type: 'Knowledge',
    from: [[2, 6], 'Conditional Proof'],
  },
  8: {
    id: 8,
    expression: {
      operation: 'Negation',
      value: { operation: 'Disjunction', left: 'P', right: 'Q' }
    },
    type: 'Conclusion',
    from: [[7], 'Reductio Ad Absurdum']
  }
}
ProofChecker.check(proof);
