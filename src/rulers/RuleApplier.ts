import { InferenceException } from 'exceptions';
import {
  ProofItemInferred,
  Proof,
  Formula,
  Disjunction,
  Negation,
  Implication,
} from 'types';
import { isDeepStrictEqual } from 'util';
import {
  isImplication,
  isBiconditional,
  isPropositionalVariable,
  isConjunction,
  parseToFormulaString,
  isDisjunction,
  isNegation,
  isHypothesis,
  isEndOfHypothesis,
} from 'utils';
import { RuleSetter } from './RuleSetter';

/**
 * Class responsible for, through a test and its items, applying the inference rules defined by the RuleSetter class.
 */
export class RuleApplier extends RuleSetter {
  static biconditionalIntroduction(item: ProofItemInferred, proof: Proof) {
    const requiredItens = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 2, requiredItens.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItens, proof);

    const formulas = [
      proof[requiredItens[0]].expression,
      proof[requiredItens[1]].expression,
    ];

    if (!isImplication(formulas[0]) || !isImplication(formulas[1]))
      throw new InferenceException(
        `Biconditional Introduction (Line ${line}): conditionals not found.`
      );

    const inferenceResult = RuleApplier.BiconditionalIntroduction(
      formulas[0],
      formulas[1]
    );

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static biconditionalElimination(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    const biconditional = proof[requiredItem[0]].expression;

    if (!isBiconditional(biconditional))
      throw new InferenceException(
        `Biconditional Elimination (Line ${line}): biconditional not found.`
      );

    const inferenceResult = RuleApplier.BiconditionalElimination(biconditional);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static conditionalization(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    if (!isImplication(item.expression))
      throw new InferenceException(
        `Conditionalization (Line ${line}): the formula is not an implication.`
      );

    const formula = proof[requiredItem[0]].expression;

    if (typeof formula === 'string' && !isPropositionalVariable(formula))
      throw new InferenceException(
        `Conditionalization (Line ${line}): formula not found.`
      );

    const inferenceResult = RuleApplier.Conditionalization(
      formula,
      item.expression
    );

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static conjunctionIntroduction(item: ProofItemInferred, proof: Proof) {
    const requiredItens = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 2, requiredItens.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItens, proof);

    const firstFormula = proof[requiredItens[0]].expression;

    if (
      typeof firstFormula === 'string' &&
      !isPropositionalVariable(firstFormula)
    )
      throw new InferenceException(
        `Conjunction Introduction (Line ${line}): line ${requiredItens[0]} formula not found.`
      );

    const secondFormula = proof[requiredItens[1]].expression;

    if (
      typeof secondFormula === 'string' &&
      !isPropositionalVariable(secondFormula)
    )
      throw new InferenceException(
        `Conjunction Introduction (Line ${line}): line ${requiredItens[1]} formula not found.`
      );

    const inferenceResult = RuleApplier.ConjunctionIntroduction(
      firstFormula,
      secondFormula
    );

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static conjunctionElimination(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    const conjunction = proof[requiredItem[0]].expression;

    if (!isConjunction(conjunction))
      throw new InferenceException(
        `Conjunction Elimination (Line ${line}): conjunction not found.`
      );

    const inferenceResults = RuleApplier.ConjunctionElimination(conjunction);

    if (
      !isDeepStrictEqual(item.expression, inferenceResults[0]) &&
      !isDeepStrictEqual(item.expression, inferenceResults[1])
    ) {
      throw new InferenceException(
        `Conjunction Elimination (Line ${line}): expected ${parseToFormulaString(
          inferenceResults[0]
        )} or ${parseToFormulaString(
          inferenceResults[1]
        )} but received ${parseToFormulaString(item.expression as Formula)}`
      );
    }

    return inferenceResults;
  }

  static commutativity(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    const formula = proof[requiredItem[0]].expression;

    if (
      !isDisjunction(formula) &&
      !isConjunction(formula) &&
      !isBiconditional(formula)
    )
      throw new InferenceException(
        `Commutativity (Line ${line}): cannot find any conjunction, biconditional or disjunction.`
      );

    const inferenceResult = RuleApplier.Commutativity(formula);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static contraposition(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    const formula = proof[requiredItem[0]].expression;

    if (!isImplication(formula))
      throw new InferenceException(
        `Contraposition (Line ${line}): implication not found.`
      );

    const inferenceResult = RuleApplier.Contraposition(formula);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static deMorgan(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    const formula = proof[requiredItem[0]].expression;

    if (
      !isNegation(formula) &&
      !isConjunction(formula) &&
      !isDisjunction(formula)
    )
      throw new InferenceException(
        `De Morgan (Line ${line}): formula is not a disjunction, conjunction or negation.`
      );

    const inferenceResult = RuleApplier.DeMorgan(formula);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static disjunctionIntroduction(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    if (!isDisjunction(item.expression))
      throw new InferenceException(
        `Disjunction Introduction (Line ${line}): expression is not a disjunction`
      );

    const formula = proof[requiredItem[0]].expression;

    if (typeof formula === 'string' && !isPropositionalVariable(formula))
      throw new InferenceException(
        `Disjunction Introduction (Line ${line}): formula not found.`
      );

    const inferenceResult = RuleApplier.DisjunctionIntroduction(
      formula,
      item.expression
    );

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static disjunctiveSyllogism(item: ProofItemInferred, proof: Proof) {
    const requiredItens = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 2, requiredItens.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItens, proof);

    const firstFormula = proof[requiredItens[0]].expression;
    const secondFormula = proof[requiredItens[1]].expression;
    let remainingFormula: ProofItemInferred['expression'];

    let disjunction: Disjunction;

    if (isDisjunction(firstFormula)) {
      disjunction = firstFormula;
      remainingFormula = secondFormula;
    }

    if (isDisjunction(secondFormula)) {
      disjunction = secondFormula;
      remainingFormula = firstFormula;
    }

    if (!disjunction)
      throw new InferenceException(
        `Disjunctive Syllogism (Line ${line}): disjunction not found`
      );

    let negation: Negation;

    if (isNegation(remainingFormula)) negation = remainingFormula;

    if (!negation)
      throw new InferenceException(
        `Disjunctive Syllogism (Line ${line}): negation not found`
      );

    const inferenceResult = RuleApplier.DisjunctiveSyllogism(
      disjunction,
      negation
    );

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static doubleNegation(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    const formula = proof[requiredItem[0]].expression;

    if (typeof formula === 'string' && !isPropositionalVariable(formula))
      throw new InferenceException(
        `Double Negation (Line ${line}): formula not found.`
      );

    const inferenceResult = RuleApplier.DoubleNegation(formula);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static doubleNegationIntroduction(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    const formula = proof[requiredItem[0]].expression;

    if (typeof formula === 'string' && !isPropositionalVariable(formula))
      throw new InferenceException(
        `Double Negation Introduction (Line ${line}): negation not found.`
      );

    const inferenceResult = RuleApplier.DoubleNegationIntroduction(formula);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static hypotheticalSyllogism(item: ProofItemInferred, proof: Proof) {
    const requiredItens = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 2, requiredItens.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItens, proof);

    const firstFormula = proof[requiredItens[0]].expression;
    const secondFormula = proof[requiredItens[1]].expression;

    if (!isImplication(firstFormula) || !isImplication(secondFormula))
      throw new InferenceException(
        `Hypothetical Syllogism (Line ${line}): both formulas should be conditionals.`
      );

    const inferenceResult = RuleApplier.HypotheticalSyllogism(
      firstFormula,
      secondFormula
    );

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static implicationElimination(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    const formula = proof[requiredItem[0]].expression;

    if (!isImplication(formula))
      throw new InferenceException(
        `Implication Elimination (Line ${line}): implication not found.`
      );

    const inferenceResult = RuleApplier.ImplicationElimination(formula);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static implicationNegation(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    let formula = proof[requiredItem[0]].expression;

    if (!isNegation(formula))
      throw new InferenceException(
        `Implication Negation (Line ${line}): negation not found`
      );

    const inferenceResult = RuleApplier.ImplicationNegation(formula);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static modusPonens(item: ProofItemInferred, proof: Proof) {
    const requiredItens = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 2, requiredItens.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItens, proof);

    let firstFormula = proof[requiredItens[0]].expression;
    let secondFormula = proof[requiredItens[1]].expression;
    let remainingFormula: ProofItemInferred['expression'];

    let implication: Implication;

    if (isImplication(firstFormula)) {
      implication = firstFormula;
      remainingFormula = secondFormula;
    }

    if (isImplication(secondFormula)) {
      implication = secondFormula;
      remainingFormula = firstFormula;
    }

    if (!implication)
      throw new InferenceException(
        `Modus Ponens (Line ${line}): implication not found`
      );

    const antecedent = remainingFormula;

    if (!isPropositionalVariable(antecedent) && typeof antecedent === 'string')
      throw new InferenceException(
        `Modus Ponens (Line ${line}): antecedent not found`
      );

    const inferenceResult = RuleApplier.ModusPonens(implication, antecedent);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static modusTollens(item: ProofItemInferred, proof: Proof) {
    const requiredItens = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 2, requiredItens.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItens, proof);

    const firstFormula = proof[requiredItens[0]].expression;
    const secondFormula = proof[requiredItens[1]].expression;
    let remainingFormula: ProofItemInferred['expression'];

    let implication: Implication;

    if (isImplication(firstFormula)) {
      implication = firstFormula;
      remainingFormula = secondFormula;
    }

    if (isImplication(secondFormula)) {
      implication = secondFormula;
      remainingFormula = firstFormula;
    }

    if (!implication)
      throw new InferenceException(
        `Modus Tollens (Line ${line}): implication not found`
      );

    const consequent = remainingFormula;

    if (!isNegation(consequent))
      throw new InferenceException(
        `Modus Tollens (Line ${line}): negated consequent not found`
      );

    const inferenceResult = RuleApplier.ModusTollens(implication, consequent);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static conjunctionOverDisjunctionDistribution(
    item: ProofItemInferred,
    proof: Proof
  ) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    const conjunction = proof[requiredItem[0]].expression;

    if (!isConjunction(conjunction))
      throw new InferenceException(
        `Distribution (Line ${line}): conjunction not found.`
      );

    const inferenceResult =
      RuleApplier.ConjunctionOverDisjunctionDistribution(conjunction);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static disjunctionOverConjunctionDistribution(
    item: ProofItemInferred,
    proof: Proof
  ) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    const disjunction = proof[requiredItem[0]].expression;

    if (!isDisjunction(disjunction))
      throw new InferenceException(
        `Distribution (Line ${line}): disjunction not found.`
      );

    const inferenceResult =
      RuleApplier.DisjunctionOverConjunctionDistribution(disjunction);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static conjunctionAssociativity(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    const conjunction = proof[requiredItem[0]].expression;

    if (!isConjunction(conjunction))
      throw new InferenceException(
        `Associativity (Line ${line}): conjunction not found.`
      );

    const inferenceResult = RuleApplier.ConjunctionAssociativity(conjunction);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static disjunctionAssociativity(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    const disjunction = proof[requiredItem[0]].expression;

    if (!isDisjunction(disjunction))
      throw new InferenceException(
        `Associativity (Line ${line}): disjunction not found.`
      );

    const inferenceResult = RuleApplier.DisjunctionAssociativity(disjunction);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static biconditionalAssociativity(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    const biconditional = proof[requiredItem[0]].expression;

    if (!isBiconditional(biconditional))
      throw new InferenceException(
        `Associativity (Line ${line}): disjunction not found.`
      );

    const inferenceResult =
      RuleApplier.BiconditionalAssociativity(biconditional);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static conditionalProof(item: ProofItemInferred, proof: Proof) {
    const requiredItens = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 2, requiredItens.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItens, proof);

    const item1 = proof[requiredItens[0]];
    const item2 = proof[requiredItens[1]];

    if (
      !isPropositionalVariable(item2.expression) &&
      typeof item2.expression === 'string'
    )
      throw new InferenceException(
        `Conditional Proof (Line ${line}): cannot find a formula at line ${item2.id}`
      );

    if (
      !isPropositionalVariable(item1.expression) &&
      typeof item1.expression === 'string'
    )
      throw new InferenceException(
        `Conditional Proof (Line ${line}): cannot find a formula at line ${item1.id}`
      );

    let hypothesis: Formula;
    let endOfHypothesis: Formula;

    if (isHypothesis(item1) && isEndOfHypothesis(item2)) {
      hypothesis = item1.expression;

      if (item2.hypothesisId != item1.id)
        throw new InferenceException(
          `Conditional Proof (Line ${line}): end of hypothesis references line ${item2.hypothesisId} hypothesis, but received line ${item1.id} hypothesis`
        );

      endOfHypothesis = item2.expression;
    } else if (isHypothesis(item2) && isEndOfHypothesis(item1)) {
      hypothesis = item2.expression;

      if (item1.hypothesisId != item2.id)
        throw new InferenceException(
          `Conditional Proof (Line ${line}): end of hypothesis references line ${item1.hypothesisId} hypothesis, but received line ${item2.id} hypothesis`
        );

      endOfHypothesis = item1.expression;
    } else {
      throw new InferenceException(
        `Conditional Proof: end of hypothesis or hypothesis not found.`
      );
    }

    const inferenceResult = RuleApplier.ConditionalProof(
      hypothesis,
      endOfHypothesis
    );

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  static reductioAdAbsurdum(item: ProofItemInferred, proof: Proof) {
    const requiredItem = item.from[0];
    const line = item.id;

    RuleApplier.throwsIfLengthDoesntMatch(item, 1, requiredItem.length);
    RuleApplier.throwsIfIndexDoesntExist(requiredItem, proof);

    const conditional = proof[requiredItem[0]].expression;

    if (!isImplication(conditional))
      throw new InferenceException(
        `Reductio Ad Absurdum (Line ${line}): conditional not found.`
      );

    const inferenceResult = RuleApplier.ReductioAdAbsurdum(conditional);

    RuleApplier.throwsIfIsNotEqual(inferenceResult, item);

    return inferenceResult;
  }

  private static throwsIfIsNotEqual(
    expectedFormula: Formula,
    actualItem: ProofItemInferred
  ) {
    const actualFormula = actualItem.expression as Formula;
    const inferenceMethod = actualItem.from[1];

    if (!isDeepStrictEqual(expectedFormula, actualFormula)) {
      throw new InferenceException(`
        ${inferenceMethod} (Line ${
          actualItem.id
        }): expected ${parseToFormulaString(
          expectedFormula
        )} but received ${parseToFormulaString(actualFormula)}
      `);
    }
  }

  private static throwsIfLengthDoesntMatch(
    item: ProofItemInferred,
    expected: number,
    received: number
  ) {
    const rule = item.from[1];
    const line = item.id;

    if (expected !== received)
      throw new InferenceException(
        `${rule} (Line ${line}): expect ${expected} formulas to apply the rule but received ${received}.`
      );
  }

  private static throwsIfIndexDoesntExist(
    requiredItens: number[],
    proof: Proof
  ) {
    requiredItens.forEach((idx) => {
      if (!proof[idx])
        throw new InferenceException(`Cannot find a formula at index ${idx}`);
    });
  }
}
