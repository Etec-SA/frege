import { InferenceException } from 'exceptions';

import {
  Biconditional,
  Conjunction,
  Disjunction,
  Implication,
  Formula,
  Negation,
  BinaryOperationFormula,
} from 'types';

import {
  eliminateDoubleNegations,
  isBiconditional,
  isConjunction,
  isContradiction,
  isDisjunction,
  isImplication,
  isNegation,
  isPropositionalVariable,
  parseToFormulaString,
} from 'utils';

import { isDeepStrictEqual } from 'util';

/**
 * Class responsible for defining the inference rules.
 */
export class RuleSetter {
  protected static BiconditionalIntroduction(
    conditional1: Implication,
    conditional2: Implication
  ): Biconditional {
    if (
      isDeepStrictEqual(conditional1.left, conditional2.right) &&
      isDeepStrictEqual(conditional1.right, conditional2.left)
    )
      return {
        operation: 'Biconditional',
        left: conditional1.left,
        right: conditional1.right,
      };

    const errorMsg = `Biconditional Introduction: cannot apply in ${parseToFormulaString(
      conditional1
    )} and ${parseToFormulaString(conditional2)}`;
    throw new InferenceException(errorMsg);
  }

  protected static BiconditionalElimination(
    biconditional: Biconditional
  ): Conjunction {
    const implication1 = {
      operation: 'Implication',
      left: biconditional.left,
      right: biconditional.right,
    };
    const implication2 = {
      operation: 'Implication',
      left: biconditional.right,
      right: biconditional.left,
    };

    return {
      operation: 'Conjunction',
      left: implication1,
      right: implication2,
    } as Conjunction;
  }

  protected static ConditionalProof(
    hypothesis: Formula,
    conclusionOfHypothesis: Formula
  ) {
    const conditional: Implication = {
      operation: 'Implication',
      left: hypothesis,
      right: conclusionOfHypothesis,
    };

    return conditional;
  }

  protected static Conditionalization(
    formula: Formula,
    conditional: Implication
  ) {
    if (isDeepStrictEqual(formula, conditional.right)) return conditional;

    throw new InferenceException(
      `Conditionalization: cannot apply in ${parseToFormulaString(
        conditional
      )} with ${parseToFormulaString(formula)}`
    );
  }

  protected static Commutativity(
    formula: Conjunction | Disjunction | Biconditional
  ) {
    const right = formula.right;
    formula.right = formula.left;
    formula.left = right;
    return formula;
  }

  protected static Contraposition(formula: Implication) {
    const contraposition: Implication = {
      operation: 'Implication',
      left: { operation: 'Negation', value: formula.right },
      right: { operation: 'Negation', value: formula.left },
    };

    return eliminateDoubleNegations(contraposition);
  }

  protected static ConjunctionIntroduction(
    formula1: Formula,
    formula2: Formula
  ) {
    return {
      operation: 'Conjunction',
      left: formula1,
      right: formula2,
    } as Conjunction;
  }

  protected static ConjunctionElimination(
    conjunction: Conjunction
  ): [Formula, Formula] {
    return [conjunction.left, conjunction.right];
  }

  protected static DeMorgan(formula: Negation | Disjunction | Conjunction) {
    if (isNegation(formula)) {
      if (isDisjunction(formula.value)) {
        return {
          operation: 'Conjunction',
          left: { operation: 'Negation', value: formula.value.left },
          right: { operation: 'Negation', value: formula.value.right },
        } as Conjunction;
      }

      if (isConjunction(formula.value)) {
        return {
          operation: 'Disjunction',
          left: { operation: 'Negation', value: formula.value.left },
          right: { operation: 'Negation', value: formula.value.right },
        } as Disjunction;
      }
    }

    if (isDisjunction(formula)) {
      if (!(isNegation(formula.left) && isNegation(formula.right)))
        throw new InferenceException(
          `De Morgan: cannot apply in ${parseToFormulaString(formula)}`
        );

      return {
        operation: 'Negation',
        value: {
          operation: 'Conjunction',
          left: formula.left.value,
          right: formula.right.value,
        },
      } as Negation;
    }

    if (isConjunction(formula)) {
      if (!(isNegation(formula.left) && isNegation(formula.right)))
        throw new InferenceException(
          `De Morgan: cannot apply in ${parseToFormulaString(formula)}`
        );

      return {
        operation: 'Negation',
        value: {
          operation: 'Disjunction',
          left: formula.left.value,
          right: formula.right.value,
        },
      } as Negation;
    }

    throw new InferenceException(
      `De Morgan: cannot apply in ${parseToFormulaString(formula)}`
    );
  }

  protected static DisjunctionIntroduction(
    formula: Formula,
    disjunction: Disjunction
  ) {
    if (isDeepStrictEqual(disjunction.left, formula)) return disjunction;
    if (isDeepStrictEqual(disjunction.right, formula)) return disjunction;

    const errorMsg = `Disjunction Introduction: cannot apply in ${parseToFormulaString(
      disjunction
    )} with ${parseToFormulaString(formula)}`;
    throw new InferenceException(errorMsg);
  }

  protected static DisjunctiveSyllogism(
    disjunction: Disjunction,
    negatedDisjunct: Negation
  ): Formula {
    if (isDeepStrictEqual(disjunction.left, negatedDisjunct.value))
      return disjunction.right;

    if (isDeepStrictEqual(disjunction.right, negatedDisjunct.value))
      return disjunction.left;

    const errorMsg = `Disjunctive Syllogism: cannot apply in ${parseToFormulaString(
      disjunction
    )} with ${parseToFormulaString(negatedDisjunct)}`;
    throw new InferenceException(errorMsg);
  }

  protected static ImplicationElimination(conditional: Implication) {
    return {
      operation: 'Disjunction',
      left: { operation: 'Negation', value: conditional.left },
      right: conditional.right,
    } as Disjunction;
  }

  protected static ImplicationNegation(negation: Negation) {
    if (!isImplication(negation.value))
      throw new InferenceException(
        `Implication Negation: cannot apply in ${parseToFormulaString(
          negation
        )}`
      );

    return {
      operation: 'Conjunction',
      left: negation.value.left,
      right: { operation: 'Negation', value: negation.value.right },
    } as Conjunction;
  }

  protected static DoubleNegation(formula: Formula) {
    return eliminateDoubleNegations(formula);
  }

  protected static DoubleNegationIntroduction(formula: Formula) {
    const negation: Negation = {
      operation: 'Negation',
      value: { operation: 'Negation', value: formula },
    };

    return negation;
  }

  protected static ConjunctionOverDisjunctionDistribution(
    formula: Conjunction
  ) {
    return this.Distribute(formula, isDisjunction);
  }

  protected static DisjunctionOverConjunctionDistribution(
    formula: Disjunction
  ) {
    return this.Distribute(formula, isConjunction);
  }

  protected static ConjunctionAssociativity(formula: Conjunction) {
    return this.Associate(formula, isConjunction);
  }

  protected static DisjunctionAssociativity(formula: Disjunction) {
    return this.Associate(formula, isDisjunction);
  }

  protected static BiconditionalAssociativity(formula: Biconditional) {
    return this.Associate(formula, isBiconditional);
  }

  protected static HypotheticalSyllogism(
    conditional1: Implication,
    conditional2: Implication
  ): Formula {
    if (isDeepStrictEqual(conditional1.right, conditional2.left)) {
      return {
        operation: 'Implication',
        left: conditional1.left,
        right: conditional2.right,
      };
    }

    if (isDeepStrictEqual(conditional1.left, conditional2.right)) {
      return {
        operation: 'Implication',
        left: conditional2.left,
        right: conditional1.right,
      };
    }

    const errorMsg = `Hypothetical Syllogism: cannot apply in ${parseToFormulaString(
      conditional1
    )} with ${parseToFormulaString(conditional2)}`;
    throw new InferenceException(errorMsg);
  }

  protected static ModusPonens(
    conditional: Implication,
    antecedent: Formula
  ): Formula {
    if (isDeepStrictEqual(conditional.left, antecedent))
      return conditional.right;

    const errorMsg = `Modus Ponens: cannot apply in ${parseToFormulaString(
      conditional
    )} with ${parseToFormulaString(antecedent)}`;
    throw new InferenceException(errorMsg);
  }

  protected static ModusTollens(
    conditional: Implication,
    negatedConsequent: Negation
  ): Formula {
    if (isDeepStrictEqual(conditional.right, negatedConsequent.value))
      return { operation: 'Negation', value: conditional.left };

    const errorMsg = `Modus Tollens: cannot apply in ${parseToFormulaString(
      conditional
    )} with ${parseToFormulaString(negatedConsequent)}`;
    throw new InferenceException(errorMsg);
  }

  protected static ReductioAdAbsurdum(conditional: Implication) {
    if (isContradiction(conditional.right as Conjunction))
      return { operation: 'Negation', value: conditional.left } as Negation;

    throw new InferenceException(
      `Reductio Ad Absurdum: cannot apply in ${conditional} with ${conditional.right}`
    );
  }

  private static DistributeRecursively<
    T extends BinaryOperationFormula,
    K extends BinaryOperationFormula,
  >(formula: T, isK: (x: any) => x is K) {
    try {
      return this.Distribute(formula, isK);
    } catch {
      return formula;
    }
  }

  private static Distribute<
    T extends BinaryOperationFormula,
    K extends BinaryOperationFormula,
  >(formula: T, isK: (x: any) => x is K) {
    let KFormula: K;
    let otherFormula: Formula;

    if (isK(formula.left)) {
      KFormula = formula.left;
      otherFormula = formula.right;
    } else if (isK(formula.right)) {
      (KFormula = formula.right), (otherFormula = formula.left);
    } else {
      throw new InferenceException(
        `Distribution: cannot apply in ${parseToFormulaString(formula)}`
      );
    }

    let distributedFormula = {
      operation: KFormula.operation,
      left: {
        operation: formula.operation,
        left: otherFormula,
        right: KFormula.left,
      },
      right: {
        operation: formula.operation,
        left: otherFormula,
        right: KFormula.right,
      },
    };

    if (!isPropositionalVariable(distributedFormula.left))
      distributedFormula.left = this.DistributeRecursively(
        distributedFormula.left,
        isK
      );

    if (!isPropositionalVariable(distributedFormula.right))
      distributedFormula.right = this.DistributeRecursively(
        distributedFormula.right,
        isK
      );

    return distributedFormula;
  }

  private static Associate<T extends Conjunction | Disjunction | Biconditional>(
    formula: T,
    isT: (x: any) => x is T
  ) {
    let mainFormula: T;
    let otherFormula: Formula;

    if (isT(formula.left)) {
      mainFormula = formula.left;
      otherFormula = formula.right;

      return {
        operation: formula.operation,
        left: mainFormula.left,
        right: {
          operation: formula.operation,
          left: mainFormula.right,
          right: otherFormula,
        },
      } as T;
    }

    if (isT(formula.right)) {
      mainFormula = formula.right;
      otherFormula = formula.left;

      return {
        operation: formula.operation,
        left: {
          operation: formula.operation,
          left: otherFormula,
          right: mainFormula.left,
        },
        right: mainFormula.right,
      } as T;
    }

    throw new InferenceException(
      `Associativity: cannot apply in ${parseToFormulaString(formula)}`
    );
  }
}
