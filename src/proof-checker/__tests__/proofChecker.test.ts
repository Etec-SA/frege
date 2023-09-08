import assert from 'node:assert';
import { it, describe } from 'node:test';
import { ProofChecker } from '../ProofChecker';
import { InferenceException } from 'exceptions';
import { Proof } from 'types';

describe('ProofChecker', () => {
  describe('check', () => {
    it('should validate { P -> Q, P } ⊢ Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: 'P',
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: { operation: 'Negation', value: 'Q' },
          type: 'Hypothesis',
        },
        4: {
          id: 4,
          expression: {
            operation: 'Disjunction',
            left: { operation: 'Negation', value: 'P' },
            right: 'Q',
          },
          from: [[1], 'Implication Elimination'],
          type: 'Knowledge',
        },
        5: {
          id: 5,
          expression: { operation: 'Negation', value: 'P' },
          type: 'Knowledge',
          from: [[3, 4], 'Disjunctive Syllogism'],
        },
        6: {
          id: 6,
          expression: {
            operation: 'Conjunction',
            left: 'P',
            right: { operation: 'Negation', value: 'P' },
          },
          type: 'End of Hypothesis',
          hypothesisId: 3,
          from: [[2, 5], 'Conjunction Introduction'],
        },
        7: {
          id: 7,
          expression: {
            operation: 'Implication',
            left: { operation: 'Negation', value: 'Q' },
            right: {
              operation: 'Conjunction',
              left: 'P',
              right: { operation: 'Negation', value: 'P' },
            },
          },
          from: [[3, 6], 'Conditional Proof'],
          type: 'Knowledge',
        },
        8: {
          id: 8,
          expression: {
            operation: 'Negation',
            value: { operation: 'Negation', value: 'Q' },
          },
          from: [[7], 'Reductio Ad Absurdum'],
          type: 'Knowledge',
        },
        9: {
          id: 9,
          expression: 'Q',
          from: [[8], 'Double Negation'],
          type: 'Conclusion',
        },
      };
      assert.ok(ProofChecker.check(proof), 'Validate Modus Ponens');
    });

    it('should not validate { P } ⊢ ¬P ^ P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: 'P',
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Negation', value: 'P' },
          type: 'Hypothesis',
        },
        3: {
          id: 3,
          expression: {
            operation: 'Conjunction',
            left: 'P',
            right: { operation: 'Negation', value: 'P' },
          },
          from: [[1, 2], 'Conjunction Introduction'],
          hypothesisId: 2,
          type: 'End of Hypothesis',
        },
        4: {
          id: 4,
          expression: {
            operation: 'Implication',
            left: 'P',
            right: {
              operation: 'Conjunction',
              left: 'P',
              right: { operation: 'Negation', value: 'P' },
            },
          },
          type: 'Conclusion',
          from: [[3], 'Conditionalization'],
        },
      };

      assert.throws(() => ProofChecker.check(proof), InferenceException);
    });

    it('should not validate if we have a conclusion in the hypothesis', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: 'A',
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: 'B',
          type: 'Hypothesis',
        },
        3: {
          id: 3,
          expression: { operation: 'Conjunction', left: 'A', right: 'B' },
          type: 'Conclusion',
          from: [[1, 2], 'Conjunction Introduction'],
        },
      };

      assert.throws(() => ProofChecker.check(proof));
    });
  });
});
