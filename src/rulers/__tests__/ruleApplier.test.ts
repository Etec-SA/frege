import assert from 'assert';
import { it, describe } from 'node:test';
import { RuleApplier } from '../RuleApplier';
import { InferenceException } from 'exceptions';
import { Proof, ProofItemInferred, Formula, Negation } from 'types';
import { parseToFormulaObject } from 'utils';

describe('RuleApplier', () => {
  it('should be defined', () => {
    assert.ok(RuleApplier);
  });

  describe('Associativity', () => {
    describe('Biconditional', () => {
      it('should apply in P <-> (Q <-> R)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Biconditional',
              left: 'P',
              right: { operation: 'Biconditional', left: 'Q', right: 'R' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Biconditional',
              left: { operation: 'Biconditional', left: 'P', right: 'Q' },
              right: 'R',
            },
            type: 'Knowledge',
            from: [[1], 'Associativity (Biconditional)'],
          },
        };

        const item = proof[2] as ProofItemInferred;

        assert.deepStrictEqual(
          RuleApplier.biconditionalAssociativity(item, proof),
          item.expression
        );
      });

      it('should apply in (P v Q) <-> (Q <-> R)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Biconditional',
              left: { operation: 'Disjunction', left: 'P', right: 'Q' },
              right: { operation: 'Biconditional', left: 'Q', right: 'R' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Biconditional',
              left: {
                operation: 'Biconditional',
                left: { operation: 'Disjunction', left: 'P', right: 'Q' },
                right: 'Q',
              },
              right: 'R',
            },
            type: 'Knowledge',
            from: [[1], 'Associativity (Biconditional)'],
          },
        };

        const item = proof[2] as ProofItemInferred;

        assert.deepStrictEqual(
          RuleApplier.biconditionalAssociativity(item, proof),
          item.expression
        );
      });

      it('should not apply in (P v Q) -> (Q ^ R)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Implication',
              left: { operation: 'Disjunction', left: 'P', right: 'Q' },
              right: { operation: 'Conjunction', left: 'Q', right: 'R' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Conjunction',
              left: {
                operation: 'Conjunction',
                left: { operation: 'Disjunction', left: 'P', right: 'Q' },
                right: 'Q',
              },
              right: 'R',
            },
            type: 'Knowledge',
            from: [[1], 'Associativity (Biconditional)'],
          },
        };

        const item = proof[2] as ProofItemInferred;

        assert.throws(
          () => RuleApplier.biconditionalAssociativity(item, proof),
          InferenceException
        );
      });
    });

    describe('Conjunction', () => {
      it('should apply in P ^ (Q ^ R)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Conjunction',
              left: 'P',
              right: { operation: 'Conjunction', left: 'Q', right: 'R' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Conjunction',
              left: { operation: 'Conjunction', left: 'P', right: 'Q' },
              right: 'R',
            },
            type: 'Knowledge',
            from: [[1], 'Associativity (Conjunction)'],
          },
        };

        const item = proof[2] as ProofItemInferred;

        assert.deepStrictEqual(
          RuleApplier.conjunctionAssociativity(item, proof),
          item.expression
        );
      });

      it('should apply in (P v Q) ^ (Q ^ R)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Conjunction',
              left: { operation: 'Disjunction', left: 'P', right: 'Q' },
              right: { operation: 'Conjunction', left: 'Q', right: 'R' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Conjunction',
              left: {
                operation: 'Conjunction',
                left: { operation: 'Disjunction', left: 'P', right: 'Q' },
                right: 'Q',
              },
              right: 'R',
            },
            type: 'Knowledge',
            from: [[1], 'Associativity (Conjunction)'],
          },
        };

        const item = proof[2] as ProofItemInferred;

        assert.deepStrictEqual(
          RuleApplier.conjunctionAssociativity(item, proof),
          item.expression
        );
      });

      it('should not apply in (P v Q) -> (Q ^ R)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Implication',
              left: { operation: 'Disjunction', left: 'P', right: 'Q' },
              right: { operation: 'Conjunction', left: 'Q', right: 'R' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Conjunction',
              left: {
                operation: 'Conjunction',
                left: { operation: 'Disjunction', left: 'P', right: 'Q' },
                right: 'Q',
              },
              right: 'R',
            },
            type: 'Knowledge',
            from: [[1], 'Associativity (Conjunction)'],
          },
        };

        const item = proof[2] as ProofItemInferred;

        assert.throws(
          () => RuleApplier.conjunctionAssociativity(item, proof),
          InferenceException
        );
      });
    });

    describe('Disjunction', () => {
      it('should apply in P v (Q v R)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Disjunction',
              left: 'P',
              right: { operation: 'Disjunction', left: 'Q', right: 'R' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Disjunction',
              left: { operation: 'Disjunction', left: 'P', right: 'Q' },
              right: 'R',
            },
            type: 'Knowledge',
            from: [[1], 'Associativity (Disjunction)'],
          },
        };

        const item = proof[2] as ProofItemInferred;

        assert.deepStrictEqual(
          RuleApplier.disjunctionAssociativity(item, proof),
          item.expression
        );
      });

      it('should apply in (P ^ Q) v (Q v R)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Disjunction',
              left: { operation: 'Conjunction', left: 'P', right: 'Q' },
              right: { operation: 'Disjunction', left: 'Q', right: 'R' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Disjunction',
              left: {
                operation: 'Disjunction',
                left: { operation: 'Conjunction', left: 'P', right: 'Q' },
                right: 'Q',
              },
              right: 'R',
            },
            type: 'Knowledge',
            from: [[1], 'Associativity (Disjunction)'],
          },
        };

        const item = proof[2] as ProofItemInferred;

        assert.deepStrictEqual(
          RuleApplier.disjunctionAssociativity(item, proof),
          item.expression
        );
      });

      it('should not apply in (P v Q) -> (Q ^ R)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Implication',
              left: { operation: 'Disjunction', left: 'P', right: 'Q' },
              right: { operation: 'Conjunction', left: 'Q', right: 'R' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Conjunction',
              left: {
                operation: 'Conjunction',
                left: { operation: 'Disjunction', left: 'P', right: 'Q' },
                right: 'Q',
              },
              right: 'R',
            },
            type: 'Knowledge',
            from: [[1], 'Associativity (Conjunction)'],
          },
        };

        const item = proof[2] as ProofItemInferred;

        assert.throws(
          () => RuleApplier.disjunctionAssociativity(item, proof),
          InferenceException
        );
      });
    });
  });
  describe('Biconditional Introduction', () => {
    it('should apply in P->Q, Q->P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Implication', left: 'Q', right: 'P' },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: { operation: 'Biconditional', left: 'P', right: 'Q' },
          type: 'Knowledge',
          from: [[1, 2], 'Biconditional Introduction'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.deepEqual(
        RuleApplier.biconditionalIntroduction(item, proof),
        item.expression
      );
    });

    it('should not apply in P->Q, R->P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Implication', left: 'R', right: 'P' },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: { operation: 'Biconditional', left: 'R', right: 'Q' },
          type: 'Knowledge',
          from: [[1, 2], 'Biconditional Introduction'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.biconditionalIntroduction(item, proof);
      }, InferenceException);
    });
  });

  describe('Biconditional Elimination', () => {
    it('should apply in A<->B', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Biconditional', left: 'A', right: 'B' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Conjunction',
            left: { operation: 'Implication', left: 'A', right: 'B' },
            right: { operation: 'Implication', left: 'B', right: 'A' },
          },
          type: 'Knowledge',
          from: [[1], 'Biconditional Elimination'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.biconditionalElimination(item, proof),
        item.expression
      );
    });

    it('should not apply in P->Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: parseToFormulaObject('((P->Q) ∧ (Q->P))'),
          type: 'Knowledge',
          from: [[1], 'Biconditional Introduction'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.biconditionalIntroduction(item, proof);
      }, InferenceException);
    });
  });

  describe('Conditional Proof', () => {
    it('should apply in hypothesis P v Q and end of hypothesis P ^ ¬P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Conjunction',
            left: { operation: 'Negation', value: 'P' },
            right: { operation: 'Negation', value: 'Q' },
          },
          type: 'Premise',
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
          from: [[4, 2], 'Disjunctive Syllogism'],
        },
        6: {
          id: 6,
          expression: {
            operation: 'Conjunction',
            left: 'P',
            right: { operation: 'Negation', value: 'P' },
          },
          type: 'End of Hypothesis',
          from: [[3, 5], 'Conjunction Introduction'],
          hypothesisId: 2,
        },
        7: {
          id: 7,
          expression: {
            operation: 'Implication',
            left: { operation: 'Disjunction', left: 'P', right: 'Q' },
            right: {
              operation: 'Conjunction',
              left: 'P',
              right: { operation: 'Negation', value: 'P' },
            },
          },
          type: 'Knowledge',
          from: [[2, 6], 'Conditional Proof'],
        },
      };

      const item = proof[7] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.conditionalProof(item, proof),
        item.expression
      );
    });

    it('should not apply if end of hypothesis id doesnt match', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Conjunction',
            left: { operation: 'Negation', value: 'P' },
            right: { operation: 'Negation', value: 'Q' },
          },
          type: 'Premise',
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
          from: [[4, 2], 'Disjunctive Syllogism'],
        },
        6: {
          id: 6,
          expression: {
            operation: 'Conjunction',
            left: 'P',
            right: { operation: 'Negation', value: 'P' },
          },
          type: 'End of Hypothesis',
          from: [[3, 5], 'Conjunction Introduction'],
          hypothesisId: 3,
        },
        7: {
          id: 7,
          expression: {
            operation: 'Implication',
            left: { operation: 'Disjunction', left: 'P', right: 'Q' },
            right: {
              operation: 'Conjunction',
              left: 'P',
              right: { operation: 'Negation', value: 'P' },
            },
          },
          type: 'Knowledge',
          from: [[2, 6], 'Conditional Proof'],
        },
      };

      const item = proof[7] as ProofItemInferred;

      assert.throws(
        () => RuleApplier.conditionalProof(item, proof),
        InferenceException
      );
    });

    it('should not apply if knowledge references are incorrect', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Conjunction',
            left: { operation: 'Negation', value: 'P' },
            right: { operation: 'Negation', value: 'Q' },
          },
          type: 'Premise',
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
          from: [[4, 2], 'Disjunctive Syllogism'],
        },
        6: {
          id: 6,
          expression: {
            operation: 'Conjunction',
            left: 'P',
            right: { operation: 'Negation', value: 'P' },
          },
          type: 'End of Hypothesis',
          from: [[3, 5], 'Conjunction Introduction'],
          hypothesisId: 3,
        },
        7: {
          id: 7,
          expression: {
            operation: 'Implication',
            left: { operation: 'Disjunction', left: 'P', right: 'Q' },
            right: {
              operation: 'Conjunction',
              left: 'P',
              right: { operation: 'Negation', value: 'P' },
            },
          },
          type: 'Knowledge',
          from: [[2, 4], 'Conditional Proof'],
        },
      };

      const item = proof[7] as ProofItemInferred;

      assert.throws(
        () => RuleApplier.conditionalProof(item, proof),
        InferenceException
      );
    });
  });

  describe('Commutativity', () => {
    it('should apply in P ^ Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Conjunction', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Conjunction', left: 'Q', right: 'P' },
          type: 'Knowledge',
          from: [[1], 'Commutativity'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.commutativity(item, proof),
        item.expression
      );
    });

    it('should apply in P v Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Disjunction', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Disjunction', left: 'Q', right: 'P' },
          type: 'Knowledge',
          from: [[1], 'Commutativity'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.commutativity(item, proof),
        item.expression
      );
    });

    it('should apply in P <-> Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Biconditional', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Biconditional', left: 'Q', right: 'P' },
          type: 'Knowledge',
          from: [[1], 'Commutativity'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.commutativity(item, proof),
        item.expression
      );
    });

    it('should not apply in P -> Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Implication', left: 'Q', right: 'P' },
          type: 'Knowledge',
          from: [[1], 'Commutativity'],
        },
      };

      const item = proof[2] as ProofItemInferred;
      assert.throws(
        () => RuleApplier.commutativity(item, proof),
        InferenceException
      );
    });
  });

  describe('Conjunction Introduction', () => {
    it('should apply in P->Q, Q->P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Implication', left: 'Q', right: 'P' },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: {
            operation: 'Conjunction',
            left: { operation: 'Implication', left: 'P', right: 'Q' },
            right: { operation: 'Implication', left: 'Q', right: 'P' },
          },
          type: 'Knowledge',
          from: [[1, 2], 'Conjunction Introduction'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.deepEqual(
        RuleApplier.conjunctionIntroduction(item, proof),
        item.expression
      );
    });

    it('should not apply in P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: 'P',
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: parseToFormulaObject('(P ∧ Q)'),
          type: 'Knowledge',
          from: [[1, 3], 'Conjunction Introduction'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.conjunctionIntroduction(item, proof);
      }, InferenceException);
    });
  });

  describe('Conjunction Elimination', () => {
    it('should apply in P ∧ Q, P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Conjunction', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: 'P',
          type: 'Knowledge',
          from: [[1], 'Conjunction Elimination'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.ok(
        RuleApplier.conjunctionElimination(item, proof).includes(
          item.expression as Formula
        )
      );
    });

    it('should apply in P ∧ Q, Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Conjunction', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: 'Q',
          type: 'Knowledge',
          from: [[1], 'Conjunction Elimination'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.ok(
        RuleApplier.conjunctionElimination(item, proof).includes(
          item.expression as Formula
        )
      );
    });

    it('should not apply in P ∧ Q, R', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Conjunction', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: 'R',
          type: 'Knowledge',
          from: [[1], 'Conjunction Elimination'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.conjunctionElimination(item, proof);
      }, InferenceException);
    });
  });

  describe('Contraposition', () => {
    it('should apply in P->Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Implication',
            left: { operation: 'Negation', value: 'Q' },
            right: { operation: 'Negation', value: 'P' },
          },
          type: 'Knowledge',
          from: [[1], 'Contraposition'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.contraposition(item, proof),
        item.expression
      );
    });

    it('should apply in ¬Q->¬P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Implication',
            left: { operation: 'Negation', value: 'Q' },
            right: { operation: 'Negation', value: 'P' },
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Knowledge',
          from: [[1], 'Contraposition'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.contraposition(item, proof),
        item.expression
      );
    });

    it('should apply in ¬¬P->¬¬Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: parseToFormulaObject('¬¬P->¬¬Q'),
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Implication',
            left: { operation: 'Negation', value: 'Q' },
            right: { operation: 'Negation', value: 'P' },
          },
          type: 'Knowledge',
          from: [[1], 'Contraposition'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.contraposition(item, proof),
        item.expression
      );
    });

    it('should apply in (¬¬¬Q)->(¬¬¬P)', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: parseToFormulaObject('(¬¬¬Q)->(¬¬¬P)'),
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Knowledge',
          from: [[1], 'Contraposition'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.contraposition(item, proof),
        item.expression
      );
    });

    it('should not apply in P->Q, Q->P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Implication', left: 'Q', right: 'P' },
          type: 'Knowledge',
          from: [[1], 'Contraposition'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.throws(
        () => RuleApplier.contraposition(item, proof),
        InferenceException
      );
    });
  });

  describe('Disjunction Introduction', () => {
    it('should apply in P, P ∨ Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: 'P',
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Disjunction',
            left: 'P',
            right: { operation: 'Implication', left: 'P', right: 'Q' },
          },
          type: 'Knowledge',
          from: [[1], 'Disjunction Introduction'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.disjunctionIntroduction(item, proof),
        item.expression
      );
    });

    it('should apply in P, Q ∨ P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: 'P',
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Disjunction',
            left: 'P',
            right: { operation: 'Implication', left: 'Q', right: 'P' },
          },
          type: 'Knowledge',
          from: [[1], 'Disjunction Introduction'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.disjunctionIntroduction(item, proof),
        item.expression
      );
    });

    it('should not apply in R, P ∨ Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: 'R',
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Disjunction',
            left: 'P',
            right: { operation: 'Implication', left: 'P', right: 'Q' },
          },
          type: 'Knowledge',
          from: [[1], 'Disjunction Introduction'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.disjunctionIntroduction(item, proof);
      }, InferenceException);
    });
  });

  describe('Distribution', () => {
    describe('Conjunction over Disjunction', () => {
      it('should distribute P ^ (Q v R)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Conjunction',
              left: 'P',
              right: { operation: 'Disjunction', left: 'Q', right: 'R' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Disjunction',
              left: { operation: 'Conjunction', left: 'P', right: 'Q' },
              right: { operation: 'Conjunction', left: 'P', right: 'R' },
            },
            type: 'Knowledge',
            from: [[1], 'Distribution (Conjunction over Disjunction)'],
          },
        };

        const item = proof[2] as ProofItemInferred;

        assert.deepStrictEqual(
          RuleApplier.conjunctionOverDisjunctionDistribution(item, proof),
          item.expression
        );
      });

      it('should distribute (P v Q) ^ (R v S)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Conjunction',
              left: { operation: 'Disjunction', left: 'P', right: 'Q' },
              right: { operation: 'Disjunction', left: 'R', right: 'S' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Disjunction',
              left: {
                operation: 'Disjunction',
                left: { operation: 'Conjunction', left: 'P', right: 'R' },
                right: { operation: 'Conjunction', left: 'P', right: 'S' },
              },
              right: {
                operation: 'Disjunction',
                left: { operation: 'Conjunction', left: 'Q', right: 'R' },
                right: { operation: 'Conjunction', left: 'Q', right: 'S' },
              },
            },
            type: 'Knowledge',
            from: [[1], 'Distribution (Conjunction over Disjunction)'],
          },
        };

        const item = proof[2] as ProofItemInferred;

        assert.deepStrictEqual(
          RuleApplier.conjunctionOverDisjunctionDistribution(item, proof),
          item.expression
        );
      });

      it('should not distribute P -> (R v S)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Implication',
              left: 'P',
              right: { operation: 'Disjunction', left: 'R', right: 'S' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Disjunction',
              left: { operation: 'Implication', left: 'P', right: 'R' },
              right: { operation: 'Implication', left: 'P', right: 'S' },
            },
            type: 'Knowledge',
            from: [[1], 'Distribution (Conjunction over Disjunction)'],
          },
        };

        const item = proof[2] as ProofItemInferred;
        assert.throws(
          () => RuleApplier.conjunctionOverDisjunctionDistribution(item, proof),
          InferenceException
        );
      });
    });

    describe('Disjunction over Conjunction', () => {
      it('should distribute P v (Q ^ R)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Disjunction',
              left: 'P',
              right: { operation: 'Conjunction', left: 'Q', right: 'R' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Conjunction',
              left: { operation: 'Disjunction', left: 'P', right: 'Q' },
              right: { operation: 'Disjunction', left: 'P', right: 'R' },
            },
            type: 'Knowledge',
            from: [[1], 'Distribution (Disjunction over Conjunction)'],
          },
        };

        const item = proof[2] as ProofItemInferred;

        assert.deepStrictEqual(
          RuleApplier.disjunctionOverConjunctionDistribution(item, proof),
          item.expression
        );
      });

      it('should distribute (P ^ Q) v (R ^ S)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Disjunction',
              left: { operation: 'Conjunction', left: 'P', right: 'Q' },
              right: { operation: 'Conjunction', left: 'R', right: 'S' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Conjunction',
              left: {
                operation: 'Conjunction',
                left: { operation: 'Disjunction', left: 'P', right: 'R' },
                right: { operation: 'Disjunction', left: 'P', right: 'S' },
              },
              right: {
                operation: 'Conjunction',
                left: { operation: 'Disjunction', left: 'Q', right: 'R' },
                right: { operation: 'Disjunction', left: 'Q', right: 'S' },
              },
            },
            type: 'Knowledge',
            from: [[1], 'Distribution (Disjunction over Conjunction)'],
          },
        };

        const item = proof[2] as ProofItemInferred;

        assert.deepStrictEqual(
          RuleApplier.disjunctionOverConjunctionDistribution(item, proof),
          item.expression
        );
      });

      it('should not distribute P -> (R ^ S)', () => {
        const proof: Proof = {
          1: {
            id: 1,
            expression: {
              operation: 'Implication',
              left: 'P',
              right: { operation: 'Conjunction', left: 'R', right: 'S' },
            },
            type: 'Premise',
          },
          2: {
            id: 2,
            expression: {
              operation: 'Conjunction',
              left: { operation: 'Implication', left: 'P', right: 'R' },
              right: { operation: 'Implication', left: 'P', right: 'S' },
            },
            type: 'Knowledge',
            from: [[1], 'Distribution (Disjunction over Conjunction)'],
          },
        };

        const item = proof[2] as ProofItemInferred;
        assert.throws(
          () => RuleApplier.disjunctionOverConjunctionDistribution(item, proof),
          InferenceException
        );
      });
    });
  });

  describe('De Morgan', () => {
    it('should apply in ¬(P ∨ Q)', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Negation',
            value: { operation: 'Disjunction', left: 'P', right: 'Q' },
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Conjunction',
            left: { operation: 'Negation', value: 'P' },
            right: { operation: 'Negation', value: 'Q' },
          },
          type: 'Knowledge',
          from: [[1], 'De Morgan'],
        },
      };

      const item = proof[2] as ProofItemInferred;
      assert.deepStrictEqual(
        RuleApplier.deMorgan(item, proof),
        item.expression
      );
    });

    it('should apply in ¬(P ^ Q)', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Negation',
            value: { operation: 'Conjunction', left: 'P', right: 'Q' },
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Disjunction',
            left: { operation: 'Negation', value: 'P' },
            right: { operation: 'Negation', value: 'Q' },
          },
          type: 'Knowledge',
          from: [[1], 'De Morgan'],
        },
      };

      const item = proof[2] as ProofItemInferred;
      assert.deepStrictEqual(
        RuleApplier.deMorgan(item, proof),
        item.expression
      );
    });

    it('should apply in ¬(¬P ^ ¬Q)', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Negation',
            value: {
              operation: 'Conjunction',
              left: { operation: 'Negation', value: 'P' },
              right: { operation: 'Negation', value: 'Q' },
            },
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Disjunction',
            left: {
              operation: 'Negation',
              value: { operation: 'Negation', value: 'P' },
            },
            right: {
              operation: 'Negation',
              value: { operation: 'Negation', value: 'Q' },
            },
          },
          type: 'Knowledge',
          from: [[1], 'De Morgan'],
        },
      };

      const item = proof[2] as ProofItemInferred;
      assert.deepStrictEqual(
        RuleApplier.deMorgan(item, proof),
        item.expression
      );
    });

    it('should apply in ¬P ^ ¬Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Conjunction',
            left: { operation: 'Negation', value: 'P' },
            right: { operation: 'Negation', value: 'Q' },
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Negation',
            value: { operation: 'Disjunction', left: 'P', right: 'Q' },
          },
          type: 'Knowledge',
          from: [[1], 'De Morgan'],
        },
      };

      const item = proof[2] as ProofItemInferred;
      assert.deepStrictEqual(
        RuleApplier.deMorgan(item, proof),
        item.expression
      );
    });

    it('should apply in ¬P v ¬Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Disjunction',
            left: { operation: 'Negation', value: 'P' },
            right: { operation: 'Negation', value: 'Q' },
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Negation',
            value: { operation: 'Conjunction', left: 'P', right: 'Q' },
          },
          type: 'Knowledge',
          from: [[1], 'De Morgan'],
        },
      };

      const item = proof[2] as ProofItemInferred;
      assert.deepStrictEqual(
        RuleApplier.deMorgan(item, proof),
        item.expression
      );
    });

    it('should apply in ¬(¬P ∨ ¬Q)', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Negation',
            value: {
              operation: 'Disjunction',
              left: { operation: 'Negation', value: 'P' },
              right: { operation: 'Negation', value: 'Q' },
            },
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Conjunction',
            left: {
              operation: 'Negation',
              value: { operation: 'Negation', value: 'P' },
            },
            right: {
              operation: 'Negation',
              value: { operation: 'Negation', value: 'Q' },
            },
          },
          type: 'Knowledge',
          from: [[1], 'De Morgan'],
        },
      };

      const item = proof[2] as ProofItemInferred;
      assert.deepStrictEqual(
        RuleApplier.deMorgan(item, proof),
        item.expression
      );
    });

    it('should not apply in ¬¬(P ^ Q)', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Negation',
            value: {
              operation: 'Negation',
              value: {
                operation: 'Conjunction',
                left: 'P',
                right: 'Q',
              },
            },
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Disjunction',
            left: { operation: 'Negation', value: 'P' },
            right: { operation: 'Negation', value: 'Q' },
          },
          type: 'Knowledge',
          from: [[1], 'De Morgan'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.throws(
        () => RuleApplier.deMorgan(item, proof),
        InferenceException
      );
    });
  });

  describe('Disjunctive Syllogism', () => {
    it('shoud apply in (P ∨ Q), ¬Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Disjunction', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Negation', value: 'Q' },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: 'P',
          type: 'Knowledge',
          from: [[2, 1], 'Disjunctive Syllogism'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.deepEqual(
        RuleApplier.disjunctiveSyllogism(item, proof),
        item.expression
      );
    });

    it('should apply in (P ∨ Q), ¬P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Disjunction', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Negation', value: 'P' },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: 'Q',
          type: 'Knowledge',
          from: [[2, 1], 'Disjunctive Syllogism'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.deepEqual(
        RuleApplier.disjunctiveSyllogism(item, proof),
        item.expression
      );
    });

    it('should not apply in P, Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: 'P',
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: 'Q',
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: 'R',
          type: 'Knowledge',
          from: [[1, 2], 'Disjunctive Syllogism'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.disjunctiveSyllogism(item, proof);
      }, InferenceException);
    });

    it('should not apply in P ∨ Q, ¬Q, Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Disjunction', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Negation', value: 'Q' },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: 'Q',
          type: 'Knowledge',
          from: [[1, 2], 'Disjunctive Syllogism'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.disjunctiveSyllogism(item, proof);
      }, InferenceException);
    });
  });

  describe('Conditionalization', () => {
    it('should apply in P, Q->P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: 'P',
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Implication', left: 'Q', right: 'P' },
          type: 'Knowledge',
          from: [[1], 'Conditionalization'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.conditionalization(item, proof),
        item.expression
      );
    });

    it('should not apply in P, P->Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: 'P',
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Knowledge',
          from: [[1], 'Conditionalization'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.conditionalization(item, proof);
      }, InferenceException);
    });
  });

  describe('Implication Elimination', () => {
    it('should apply in P->Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Disjunction',
            left: { operation: 'Negation', value: 'P' },
            right: 'Q',
          },
          type: 'Knowledge',
          from: [[1], 'Implication Elimination'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.implicationElimination(item, proof),
        item.expression
      );
    });

    it('should not apply in P∧Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Conjunction', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Disjunction',
            left: { operation: 'Negation', value: 'P' },
            right: 'Q',
          },
          type: 'Knowledge',
          from: [[1], 'Implication Elimination'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.implicationElimination(item, proof);
      }, InferenceException);
    });
  });

  describe('Implication Negation', () => {
    it('should apply in ¬(P->Q)', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Negation',
            value: { operation: 'Implication', left: 'P', right: 'Q' },
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Conjunction',
            left: 'P',
            right: { operation: 'Negation', value: 'Q' },
          },
          type: 'Knowledge',
          from: [[1], 'Implication Negation'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.implicationNegation(item, proof),
        item.expression
      );
    });

    it('should not apply in ¬(P<->Q)', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Negation',
            value: { operation: 'Biconditional', left: 'P', right: 'Q' },
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Conjunction',
            left: 'P',
            right: { operation: 'Negation', value: 'Q' },
          },
          type: 'Knowledge',
          from: [[1], 'Implication Negation'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.throws(
        () => RuleApplier.implicationNegation(item, proof),
        InferenceException
      );
    });
  });

  describe('Modus Ponens', () => {
    it('should apply in P->Q, P', () => {
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
          expression: 'Q',
          type: 'Knowledge',
          from: [[2, 1], 'Modus Ponens'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.equal(RuleApplier.modusPonens(item, proof), item.expression);
    });

    it('should apply in ¬P->¬Q, ¬P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Implication',
            left: { operation: 'Negation', value: 'P' },
            right: { operation: 'Negation', value: 'Q' },
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Negation', value: 'P' },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: { operation: 'Negation', value: 'Q' },
          type: 'Knowledge',
          from: [[1, 2], 'Modus Ponens'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.deepEqual(RuleApplier.modusPonens(item, proof), item.expression);
    });

    it('should apply in P->Q,R,S, P', () => {
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
          expression: 'R',
          type: 'Premise',
        },
        4: {
          id: 4,
          expression: 'S',
          type: 'Premise',
        },
        5: {
          id: 5,
          expression: 'Q',
          type: 'Knowledge',
          from: [[2, 1], 'Modus Ponens'],
        },
      };

      const item = proof[5] as ProofItemInferred;

      assert.equal(RuleApplier.modusPonens(item, proof), item.expression);
    });

    it('should apply in (P<->Q)->¬A, (P<->Q)', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Biconditional', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Implication',
            left: { operation: 'Biconditional', left: 'P', right: 'Q' },
            right: { operation: 'Negation', value: 'A' },
          },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: { operation: 'Negation', value: 'A' },
          type: 'Knowledge',
          from: [[2, 1], 'Modus Ponens'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.deepEqual(RuleApplier.modusPonens(item, proof), item.expression);
    });

    it('should apply in (P<->Q)->(Q<->P)', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Biconditional',
            left: 'P',
            right: 'Q',
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Implication',
            left: { operation: 'Biconditional', left: 'P', right: 'Q' },
            right: { operation: 'Biconditional', left: 'Q', right: 'P' },
          },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: {
            operation: 'Biconditional',
            left: 'Q',
            right: 'P',
          },
          type: 'Knowledge',
          from: [[1, 2], 'Modus Ponens'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.deepEqual(RuleApplier.modusPonens(item, proof), item.expression);
    });

    it('should not apply in P->Q, Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: parseToFormulaObject('P->Q'),
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: parseToFormulaObject('Q'),
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: parseToFormulaObject('P'),
          type: 'Knowledge',
          from: [[1, 2], 'Modus Ponens'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.modusPonens(item, proof);
      }, InferenceException);
    });

    it('should not apply in P->Q, P, A', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: parseToFormulaObject('P->Q'),
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: parseToFormulaObject('P'),
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: parseToFormulaObject('A'),
          type: 'Knowledge',
          from: [[1, 2], 'Modus Ponens'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.modusPonens(item, proof);
      }, InferenceException);
    });
  });

  describe('Modus Tollens', () => {
    it('should apply in P->Q, ¬Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Negation', value: 'Q' },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: { operation: 'Negation', value: 'P' },
          type: 'Knowledge',
          from: [[2, 1], 'Modus Tollens'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.deepEqual(RuleApplier.modusTollens(item, proof), item.expression);
    });

    it('should apply in ¬P->(P ∧ Q), ¬(P ∧ Q)', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Implication',
            left: { operation: 'Negation', value: 'P' },
            right: { operation: 'Conjunction', left: 'P', right: 'Q' },
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Negation',
            value: { operation: 'Conjunction', left: 'P', right: 'Q' },
          },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: {
            operation: 'Negation',
            value: { operation: 'Negation', value: 'P' },
          },
          type: 'Knowledge',
          from: [[1, 2], 'Modus Tollens'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.deepEqual(RuleApplier.modusTollens(item, proof), item.expression);
    });

    it('should not apply in ¬P->Q, ¬¬¬P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: parseToFormulaObject('¬P->Q'),
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: parseToFormulaObject('¬Q'),
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: parseToFormulaObject('¬¬¬P'),
          type: 'Knowledge',
          from: [[1, 2], 'Modus Tollens'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.modusTollens(item, proof);
      }, InferenceException);
    });

    it('should not apply in ¬(P ∧ Q)->Q, ¬¬¬(P ∧ Q)', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: parseToFormulaObject('¬(P ∧ Q)->Q'),
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: parseToFormulaObject('¬Q'),
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: parseToFormulaObject('¬¬¬(P ∧ Q)'),
          type: 'Knowledge',
          from: [[1, 2], 'Modus Tollens'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.modusTollens(item, proof);
      }, InferenceException);
    });
  });

  describe('Double Negation', () => {
    it('should apply in ¬¬P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Negation',
            value: { operation: 'Negation', value: 'P' },
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: 'P',
          type: 'Knowledge',
          from: [[1], 'Double Negation'],
        },
      };

      const item = proof[2] as ProofItemInferred;
      assert.deepEqual(
        RuleApplier.doubleNegation(item, proof),
        item.expression
      );
    });

    it('should apply in ¬¬(P->¬¬Q)', () => {
      const complexFormula: Negation = {
        operation: 'Negation',
        value: {
          operation: 'Negation',
          value: {
            operation: 'Implication',
            left: 'P',
            right: {
              operation: 'Negation',
              value: {
                operation: 'Negation',
                value: 'Q',
              },
            },
          },
        },
      };

      const proof: Proof = {
        1: {
          id: 1,
          expression: complexFormula,
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Knowledge',
          from: [[1], 'Double Negation'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepEqual(
        RuleApplier.doubleNegation(item, proof),
        item.expression
      );
    });

    it('should apply in ¬¬¬¬¬((¬¬¬P)->(¬¬¬¬(P ^ ¬Q)))', () => {
      const complexFormula = parseToFormulaObject(
        '¬¬¬¬¬((¬¬¬P)->(¬¬¬¬(P ∧ ¬Q)))'
      );

      const simplifiedFormula = parseToFormulaObject('¬(¬P->(P ∧ ¬Q))');

      const proof: Proof = {
        1: {
          id: 1,
          expression: complexFormula,
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: simplifiedFormula,
          type: 'Knowledge',
          from: [[1], 'Double Negation'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepEqual(
        RuleApplier.doubleNegation(item, proof),
        item.expression
      );
    });

    it('should apply in ¬¬¬¬((¬¬¬P)<->(¬¬Q))', () => {
      const complexFormula = parseToFormulaObject('¬¬¬¬((¬¬¬P)<->(¬¬Q))');

      const simplifiedFormula = parseToFormulaObject('¬P<->Q');

      const proof: Proof = {
        1: {
          id: 1,
          expression: complexFormula,
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: simplifiedFormula,
          type: 'Knowledge',
          from: [[1], 'Double Negation'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepEqual(
        RuleApplier.doubleNegation(item, proof),
        item.expression
      );
    });

    it('should not apply in ¬¬¬P => P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: parseToFormulaObject('¬¬¬P'),
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: 'P',
          type: 'Knowledge',
          from: [[1], 'Double Negation'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.doubleNegation(item, proof);
      }, InferenceException);
    });
  });

  describe('Double Negation Introduction', () => {
    it('should apply in P', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: 'P',
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: {
            operation: 'Negation',
            value: { operation: 'Negation', value: 'P' },
          },
          type: 'Knowledge',
          from: [[1], 'Double Negation Introduction'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.doubleNegationIntroduction(item, proof),
        item.expression
      );
    });

    it('should not apply in ¬¬P, P', () => {
      const proof: Proof = {
        2: {
          id: 2,
          expression: 'P',
          type: 'Knowledge',
          from: [[1], 'Double Negation Introduction'],
        },
        1: {
          id: 1,
          expression: {
            operation: 'Negation',
            value: { operation: 'Negation', value: 'P' },
          },
          type: 'Premise',
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.throws(
        () => RuleApplier.doubleNegationIntroduction(item, proof),
        InferenceException
      );
    });
  });

  describe('Hypothetical Syllogism', () => {
    it('shoud apply in P->Q, Q->R', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Implication', left: 'Q', right: 'R' },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: { operation: 'Implication', left: 'P', right: 'R' },
          type: 'Knowledge',
          from: [[1, 2], 'Hypothetical Syllogism'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.deepEqual(
        RuleApplier.hypotheticalSyllogism(item, proof),
        item.expression
      );
    });

    it('shoud apply in Q->R, P->Q ', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Implication', left: 'Q', right: 'R' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: { operation: 'Implication', left: 'P', right: 'R' },
          type: 'Knowledge',
          from: [[1, 2], 'Hypothetical Syllogism'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.deepEqual(
        RuleApplier.hypotheticalSyllogism(item, proof),
        item.expression
      );
    });

    it('shoud apply in (P->Q)->(Q->P), (Q->P)->(A->B) ', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: parseToFormulaObject('(P->Q)->(Q->P)'),
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: parseToFormulaObject('(Q->P)->(A->B)'),
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: parseToFormulaObject('(P->Q)->(A->B)'),
          type: 'Knowledge',
          from: [[1, 2], 'Hypothetical Syllogism'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.deepEqual(
        RuleApplier.hypotheticalSyllogism(item, proof),
        item.expression
      );
    });

    it('should not apply in P->Q, ¬Q, P->¬Q', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Disjunction', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Negation', value: 'Q' },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: {
            operation: 'Disjunction',
            left: 'P',
            right: { operation: 'Negation', value: 'Q' },
          },
          type: 'Knowledge',
          from: [[1, 2], 'Hypothetical Syllogism'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.hypotheticalSyllogism(item, proof);
      }, InferenceException);
    });

    it('should not apply in P->Q, Q->A, P->C', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Implication', left: 'Q', right: 'A' },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: { operation: 'Implication', left: 'P', right: 'C' },
          type: 'Knowledge',
          from: [[1, 2], 'Hypothetical Syllogism'],
        },
      };

      const item = proof[3] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.hypotheticalSyllogism(item, proof);
      }, InferenceException);
    });

    it('should not apply in P->Q, Q->A, A->B, P->B', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: { operation: 'Implication', left: 'P', right: 'Q' },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Implication', left: 'Q', right: 'A' },
          type: 'Premise',
        },
        3: {
          id: 3,
          expression: { operation: 'Implication', left: 'A', right: 'B' },
          type: 'Premise',
        },
        4: {
          id: 4,
          expression: { operation: 'Implication', left: 'P', right: 'B' },
          type: 'Knowledge',
          from: [[1, 2, 3], 'Hypothetical Syllogism'],
        },
      };

      const item = proof[4] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.hypotheticalSyllogism(item, proof);
      }, InferenceException);
    });
  });

  describe('Reductio Ad Absurdum', () => {
    it('should apply in P->(Q ^ ¬Q)', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: {
            operation: 'Implication',
            left: 'P',
            right: {
              operation: 'Conjunction',
              left: 'Q',
              right: { operation: 'Negation', value: 'Q' },
            },
          },
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Negation', value: 'P' },
          type: 'Knowledge',
          from: [[1], 'Reductio Ad Absurdum'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.reductioAdAbsurdum(item, proof),
        item.expression
      );
    });

    it('should apply in P->(Q ^ (¬¬¬Q))', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: parseToFormulaObject('P->(Q ∧ (¬¬¬Q))'),
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Negation', value: 'P' },
          type: 'Knowledge',
          from: [[1], 'Reductio Ad Absurdum'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.deepStrictEqual(
        RuleApplier.reductioAdAbsurdum(item, proof),
        item.expression
      );
    });

    it('should not apply in P->(Q ^ ¬¬Q)', () => {
      const proof: Proof = {
        1: {
          id: 1,
          expression: parseToFormulaObject('P->(Q ∧ (¬¬Q))'),
          type: 'Premise',
        },
        2: {
          id: 2,
          expression: { operation: 'Negation', value: 'P' },
          type: 'Knowledge',
          from: [[1], 'Reductio Ad Absurdum'],
        },
      };

      const item = proof[2] as ProofItemInferred;

      assert.throws(() => {
        RuleApplier.reductioAdAbsurdum(item, proof);
      }, InferenceException);
    });
  });
});
