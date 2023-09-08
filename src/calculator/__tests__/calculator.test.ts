import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculator } from '../Calculator';
import {
  Implication,
  Conjunction,
  Disjunction,
  Biconditional,
  Negation,
} from 'types';

describe('calculator', () => {
  it('should be defined', () => {
    assert.ok(calculator, 'calculator class is defined.');
  });

  describe('evaluate', () => {
    it('should be defined', () => {
      assert.ok(calculator.evaluate, 'evaluate method is defined');
    });

    it('should evaluate correctly an implication', () => {
      const operation: Implication = {
        operation: 'Implication',
        left: 'A',
        right: 'B',
      };
      const case1 = calculator.evaluate(operation, { A: true, B: true });
      const case2 = calculator.evaluate(operation, { A: false, B: true });
      const case3 = calculator.evaluate(operation, { A: true, B: false });
      const case4 = calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, true);
      assert.equal(case3, false);
      assert.equal(case4, true);
    });

    it('should evaluate correctly a conjunction', () => {
      const operation: Conjunction = {
        operation: 'Conjunction',
        left: 'A',
        right: 'B',
      };
      const case1 = calculator.evaluate(operation, { A: true, B: true });
      const case2 = calculator.evaluate(operation, { A: false, B: true });
      const case3 = calculator.evaluate(operation, { A: true, B: false });
      const case4 = calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, false);
      assert.equal(case3, false);
      assert.equal(case4, false);
    });

    it('should evaluate correctly a disjunction', () => {
      const operation: Disjunction = {
        operation: 'Disjunction',
        left: 'A',
        right: 'B',
      };
      const case1 = calculator.evaluate(operation, { A: true, B: true });
      const case2 = calculator.evaluate(operation, { A: false, B: true });
      const case3 = calculator.evaluate(operation, { A: true, B: false });
      const case4 = calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, true);
      assert.equal(case3, true);
      assert.equal(case4, false);
    });

    it('should evaluate correctly a biconditional', () => {
      const operation: Biconditional = {
        operation: 'Biconditional',
        left: 'A',
        right: 'B',
      };
      const case1 = calculator.evaluate(operation, { A: true, B: true });
      const case2 = calculator.evaluate(operation, { A: false, B: true });
      const case3 = calculator.evaluate(operation, { A: true, B: false });
      const case4 = calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, false);
      assert.equal(case3, false);
      assert.equal(case4, true);
    });

    it('should evaluate correctly a negation', () => {
      const operation: Negation = { operation: 'Negation', value: 'A' };
      const case1 = calculator.evaluate(operation, { A: true });
      const case2 = calculator.evaluate(operation, { A: false });

      assert.equal(case1, false);
      assert.equal(case2, true);
    });

    it('should evaluate A->(B->A)', () => {
      const operation = 'A->(B->A)';
      const case1 = calculator.evaluate(operation, { A: true, B: true });
      const case2 = calculator.evaluate(operation, { A: false, B: true });
      const case3 = calculator.evaluate(operation, { A: true, B: false });
      const case4 = calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, true);
      assert.equal(case3, true);
      assert.equal(case4, true);
    });

    it('should evaluate ¬(¬(A ∧ ¬B) ∧ ¬(A ∧ ¬B))', () => {
      const operation = '¬A ∨ (¬B ∨ A)';
      const case1 = calculator.evaluate(operation, { A: true, B: true });
      const case2 = calculator.evaluate(operation, { A: false, B: true });
      const case3 = calculator.evaluate(operation, { A: true, B: false });
      const case4 = calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, true);
      assert.equal(case3, true);
      assert.equal(case4, true);
    });

    it('should evaluate ¬(¬ A ∧ ¬(B->A))', () => {
      const operation = '¬(A ∧ ¬¬(B ∧ ¬A))';

      const case1 = calculator.evaluate(operation, { A: true, B: true });
      const case2 = calculator.evaluate(operation, { A: false, B: true });
      const case3 = calculator.evaluate(operation, { A: true, B: false });
      const case4 = calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, true);
      assert.equal(case3, true);
      assert.equal(case4, true);
    });
  });

  describe('generateTruthTable', () => {
    it('should generate a truth table for ¬P', () => {
      const output = calculator.generateTruthTable('¬P');

      const [formulas, truthCombinations, mainFormulaValues] = output;
      assert.deepStrictEqual(formulas, ['P', '¬P']);
      assert.deepStrictEqual(truthCombinations, [[0], [1]]);
      assert.deepStrictEqual(mainFormulaValues, [true, false]);
    });

    it('should generate a truth table for P -> Q', () => {
      const output = calculator.generateTruthTable('P -> Q');

      const [formulas, truthCombinations, mainFormulaValues] = output;
      assert.deepStrictEqual(formulas, ['P', 'Q', 'P -> Q']);
      assert.deepStrictEqual(truthCombinations, [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ]);
      assert.deepStrictEqual(mainFormulaValues, [true, true, false, true]);
    });

    it('should generate a truth table for P <-> Q', () => {
      const output = calculator.generateTruthTable('P <-> Q');

      const [formulas, truthCombinations, mainFormulaValues] = output;
      assert.deepStrictEqual(formulas, ['P', 'Q', 'P <-> Q']);
      assert.deepStrictEqual(truthCombinations, [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ]);
      assert.deepStrictEqual(mainFormulaValues, [true, false, false, true]);
    });

    it('should generate a truth table for P ∧ Q', () => {
      const output = calculator.generateTruthTable('P ∧ Q');

      const [formulas, truthCombinations, mainFormulaValues] = output;
      assert.deepStrictEqual(formulas, ['P', 'Q', 'P ∧ Q']);
      assert.deepStrictEqual(truthCombinations, [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ]);
      assert.deepStrictEqual(mainFormulaValues, [false, false, false, true]);
    });

    it('should generate a truth table for P ∨ Q', () => {
      const output = calculator.generateTruthTable('P ∨ Q');

      const [formulas, truthCombinations, mainFormulaValues] = output;
      assert.deepStrictEqual(formulas, ['P', 'Q', 'P ∨ Q']);
      assert.deepStrictEqual(truthCombinations, [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ]);
      assert.deepStrictEqual(mainFormulaValues, [false, true, true, true]);
    });

    it('should generate a truth table for (A ∨ B) -> ¬(¬C ∧ D)', () => {
      const output = calculator.generateTruthTable('(A ∨ B) -> ¬(¬C ∧ D)');

      const [formulas, truthCombinations, mainFormulaValues] = output;
      assert.deepStrictEqual(formulas, [
        'A',
        'B',
        'C',
        'D',
        '(A ∨ B) -> ¬(¬C ∧ D)',
      ]);
      assert.deepStrictEqual(truthCombinations, [
        [0, 0, 0, 0],
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 0, 1, 1],
        [0, 1, 0, 0],
        [0, 1, 0, 1],
        [0, 1, 1, 0],
        [0, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 0, 1],
        [1, 0, 1, 0],
        [1, 0, 1, 1],
        [1, 1, 0, 0],
        [1, 1, 0, 1],
        [1, 1, 1, 0],
        [1, 1, 1, 1],
      ]);
      assert.deepStrictEqual(mainFormulaValues, [
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        false,
        true,
        true,
      ]);
    });

    it('should generate a truth table for ¬(A ∧ B)', () => {
      const output = calculator.generateTruthTable('¬(A ∧ B)');

      const [formulas, truthCombinations, mainFormulaValues] = output;
      assert.deepStrictEqual(formulas, ['A', 'B', '¬(A ∧ B)']);
      assert.deepStrictEqual(truthCombinations, [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ]);
      assert.deepStrictEqual(mainFormulaValues, [true, true, true, false]);
    });

    it('should generate a truth table for (A -> B) ∧ (B -> A)', () => {
      const output = calculator.generateTruthTable('(A -> B) ∧ (B -> A)');

      const [formulas, truthCombinations, mainFormulaValues] = output;
      assert.deepStrictEqual(formulas, ['A', 'B', '(A -> B) ∧ (B -> A)']);
      assert.deepStrictEqual(truthCombinations, [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ]);
      assert.deepStrictEqual(mainFormulaValues, [true, false, false, true]);
    });

    it('should generate a truth table for (A ∨ B) -> (B -> A)', () => {
      const output = calculator.generateTruthTable('(A ∨ B) -> (B -> A)');

      const [formulas, truthCombinations, mainFormulaValues] = output;
      assert.deepStrictEqual(formulas, ['A', 'B', '(A ∨ B) -> (B -> A)']);
      assert.deepStrictEqual(truthCombinations, [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ]);
      assert.deepStrictEqual(mainFormulaValues, [true, false, true, true]);
    });
  });

  describe('isSemanticConsequence', () => {
    describe('Inference Rules', () => {
      it('should validate an application of Modus Ponens', () => {
        const output = calculator.isSemanticConsequence(['P->Q', 'P'], 'Q');
        assert.ok(output);
      });

      it('should validate an application of Modus Tollens', () => {
        const output = calculator.isSemanticConsequence(['P->Q', '¬Q'], '¬P');
        assert.ok(output);
      });

      it('should validate an application of Hypothetical Syllogism', () => {
        const output = calculator.isSemanticConsequence(
          ['P->Q', 'Q->R'],
          'P->R'
        );
        assert.ok(output);
      });

      it('should validate an application of Disjunctive Syllogism', () => {
        const output = calculator.isSemanticConsequence(['P ∨ Q', '¬P'], 'Q');
        assert.ok(output);
      });

      it('should validate an application of Constructive Dilemma', () => {
        const output = calculator.isSemanticConsequence(
          ['P -> Q', 'R -> S', 'P ∨ R'],
          'Q ∨ S'
        );
        assert.ok(output);
      });

      it('should validate an application of Reductio ad Absurdum', () => {
        const output = calculator.isSemanticConsequence(
          ['P->(Q ∨ R)', 'R -> (P ∧ ¬P)', 'P', '¬Q'],
          '¬P'
        );
        assert.ok(output);
      });

      it('should validate an application of Conditional Proof', () => {
        const output = calculator.isSemanticConsequence(
          ['A->B', 'B->C', 'A'],
          'A->C'
        );
        assert.ok(output);
      });

      it('should validate an application of Contraposition', () => {
        const output = calculator.isSemanticConsequence(
          ['(P ∧ ¬Q) -> (¬Q ∧ X)'],
          '¬(¬Q ∧ X) -> ¬(P ∧ ¬Q)'
        );
        assert.ok(output);
      });

      it('should validate an application of Negation of Conditional', () => {
        const output = calculator.isSemanticConsequence(['¬(P->Q)'], 'P ∧ ¬Q');
        assert.ok(output);
      });

      it('should validate an application of Associativity (Biconditional)', () => {
        const output = calculator.isSemanticConsequence(
          ['(P<->Q)<->R'],
          'P<->(Q<->R)'
        );
        assert.ok(output);
      });

      it('should validate an application of Associativity (Conjunction)', () => {
        const output = calculator.isSemanticConsequence(
          ['(P ∧ Q) ∧ R'],
          'P ∧ (Q ∧ R)'
        );
        assert.ok(output);
      });

      it('should validate an application of Associativity (Disjunction)', () => {
        const output = calculator.isSemanticConsequence(
          ['(P ∨ Q) ∨ R'],
          'P ∨ (Q ∨ R)'
        );
        assert.ok(output);
      });

      it('should validate an application of Commutativity (Biconditional)', () => {
        const output = calculator.isSemanticConsequence(['(P<->Q)'], 'Q<->P');
        assert.ok(output);
      });

      it('should validate an application of Commutativity (Conjunction)', () => {
        const output = calculator.isSemanticConsequence(['(P ∧ Q)'], 'Q ∧ P');
        assert.ok(output);
      });

      it('should validate an application of Commutativity (Disjunction)', () => {
        const output = calculator.isSemanticConsequence(['(P ∨ Q)'], 'Q ∨ P');
        assert.ok(output);
      });

      it('should validate an application of Distribution', () => {
        const output = calculator.isSemanticConsequence(
          ['(P ∨ Q) ∧ R'],
          '(P ∧ R) ∨ (Q ∧ R)'
        );
        assert.ok(output);
      });

      it('should validate an application of De Morgan (Conjunction)', () => {
        const output = calculator.isSemanticConsequence(
          ['¬(P ∧ Q)'],
          '¬P ∨ ¬Q'
        );
        assert.ok(output);
      });

      it('should validate an application of De Morgan (Disjunction)', () => {
        const output = calculator.isSemanticConsequence(
          ['¬(P ∨ Q)'],
          '¬P ∧ ¬Q'
        );
        assert.ok(output);
      });

      it('should validate an application of Implication Introduction', () => {
        const output = calculator.isSemanticConsequence(['P'], 'Q->P');
        assert.ok(output);
      });

      it('should validate an application of Biconditional Introduction', () => {
        const output = calculator.isSemanticConsequence(
          ['P->Q', 'Q->P'],
          'P <-> Q'
        );
        assert.ok(output);
      });

      it('should validate an application of Conjunction Introduction', () => {
        const output = calculator.isSemanticConsequence(['P', 'Q'], 'P ∧ Q');
        assert.ok(output);
      });

      it('should validate an application of Disjunction Introduction', () => {
        const output = calculator.isSemanticConsequence(['P'], 'P ∨ R');
        assert.ok(output);
      });

      it('should validate an application of Biconditional Simplification', () => {
        const output = calculator.isSemanticConsequence(
          ['P <-> Q'],
          '(P->Q) ∧ (Q->P)'
        );
        assert.ok(output);
      });

      it('should validate an application of Conjunction Simplification', () => {
        const output = calculator.isSemanticConsequence(['P ∧ Q'], 'P');
        const output2 = calculator.isSemanticConsequence(['P ∧ Q'], 'Q');
        assert.ok(output);
        assert.ok(output2);
      });

      it('should validate an application of Negation Simplification', () => {
        const output = calculator.isSemanticConsequence(['¬¬¬¬P'], 'P');
        assert.ok(output);
      });
    });

    describe('Fallacies', () => {
      it('should invalidate a fallacy of asserting the consequent', () => {
        const output = calculator.isSemanticConsequence(['P->Q', 'Q'], 'P');
        assert.ok(!output);
      });

      it('should invalidate a fallacy of asserting the disjunct', () => {
        const output = calculator.isSemanticConsequence(['P ∨ Q', 'P'], '¬Q');
        assert.ok(!output);
      });
    });
  });
});
