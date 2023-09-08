import { builder } from "builder/Builder";
import { Lexer } from "lexer/Lexer";
import { Parser } from "parser/Parser";
import { Formula, TruthTable, PropositionalVariable, PropositionalVariableValues, Implication, Biconditional, Conjunction, Disjunction, Negation, TruthValue } from "types";
import { isPropositionalVariable, parseToFormulaObject, isArrayString, parseToFormulaString, buildConjunctionString } from "utils";


/**
 * Class responsible for performing semantic truth-value operations, such as evaluate formulas and generate truth tables.
 */
export class calculator {
  /**
   * Generates a truth table for the given formula.
   *
   * @param formula - The logical formula to generate a truth table for.
   * @param stringfiedFormula - An optional string representation of the formula.
   * @returns The truth table as an array containing headers, truth combinations, and results.
   *
   * @example
   * const output = Calculator.generateTruthTable('P -> Q');
   * console.log(output);
   * // Output:
   * // [
   * //   ['P', 'Q', '(P -> Q)'],
   * //   [
   * //     [0, 0], [0, 1],
   * //     [1, 0], [1, 1]
   * //   ],
   * //   [true, true, false, true]
   * // ]
   */
  public static generateTruthTable(
    formula: Formula | string,
    stringfiedFormula?: string
  ): TruthTable {
    if (typeof formula === 'string' && !isPropositionalVariable(formula)) {
      const tokens = new Lexer(formula).lex();
      const parsedFormula = new Parser(tokens).parse();
      return calculator.generateTruthTable(parsedFormula, formula);
    }

    const variables = new Set<PropositionalVariable>();
    calculator.collectVariables(formula, variables);

    const variableArray = Array.from(variables);

    const truthCombinations = calculator.generateTruthCombinations(
      variableArray.length
    );

    const table: TruthTable = [[], [], []];

    variableArray.forEach((variable) => {
      table[0].push(variable);
    });

    stringfiedFormula = stringfiedFormula || builder.buildFormula(formula);

    table[0].push(stringfiedFormula);

    truthCombinations.forEach((combination) => {
      const values: PropositionalVariableValues =
        {} as PropositionalVariableValues;

      variableArray.forEach((variable, index) => {
        values[variable] =
          combination[index] === 1 || combination[index] === true;
      });

      table[1].push(combination);

      const result = calculator.evaluate(formula, values);

      table[2].push(result);
    });

    return table;
  }

  /**
   * Evaluates the given logical formula with the provided truth values for variables.
   *
   * @param formula - The logical formula to evaluate.
   * @param values - An object representing truth values for propositional variables.
   * @returns The result of the evaluation (true or false).
   *
   * @example
   * const result = Calculator.evaluate('P -> Q', { P: true, Q: false });
   * console.log(result); // Output: false
   */
  public static evaluate<T extends Formula>(
    formula: T | string,
    values: PropositionalVariableValues
  ): boolean {
    if (typeof formula === 'string' && formula.length > 1) {
      const tokens = new Lexer(formula).lex();
      const parsedFormula = new Parser(tokens).parse();
      return calculator.evaluate(parsedFormula as T, values);
    }

    if (typeof formula === 'string') return values[`${formula}`];

    if (formula.operation === 'Implication') {
      return calculator.evaluateImplication(formula, values);
    }

    if (formula.operation === 'Biconditional') {
      return calculator.evaluateBiconditional(formula, values);
    }

    if (formula.operation === 'Conjunction') {
      return calculator.evaluateConjunction(formula, values);
    }

    if (formula.operation === 'Disjunction') {
      return calculator.evaluateDisjunction(formula, values);
    }

    if (formula.operation === 'Negation') {
      return calculator.evaluateNegation(formula, values);
    }

    throw new Error('Invalid formula operation');
  }

  /**
   * Checks if a given formula is a semantic consequence of the given premises.
   * A semantic consequence holds if, in every possible truth assignment to the propositional variables,
   * when all premises are true, the conclusion is also true.
   *
   * @param premises - An array of logical formulas or strings representing the premises.
   * @param A - The conclusion formula to check as a semantic consequence.
   * @returns True if the conclusion is a semantic consequence of the premises, false otherwise.
   *
   * @example
   * const output = Calculator.isSemanticConsequence(['P->Q', 'P'], 'Q');
   * console.log(output); // Output: true
   */
  public static isSemanticConsequence(
    premises: Formula[] | string[],
    A: Formula | string
  ): boolean {
    const variables = new Set<PropositionalVariable>();
    let finalFormula: Formula;

    if (typeof A === 'string' && !isPropositionalVariable(A))
      A = parseToFormulaObject(A);

    if (premises.length === 1) {
      finalFormula =
        typeof premises[0] === 'object'
          ? premises[0]
          : parseToFormulaObject(premises[0]);
    } else {
      if (!isArrayString(premises)) {
        premises = premises.map((premise) => parseToFormulaString(premise));
      }

      let conjunctionFormulaString: string = buildConjunctionString(premises);
      finalFormula = parseToFormulaObject(conjunctionFormulaString);
    }

    calculator.collectVariables(finalFormula, variables);
    const variableArray = Array.from(variables);
    const truthCombinations = calculator.generateTruthCombinations(
      variableArray.length
    );

    for (const combination of truthCombinations) {
      const values: PropositionalVariableValues =
        {} as PropositionalVariableValues;

      variableArray.forEach((variable, index) => {
        values[variable] =
          combination[index] === 1 || combination[index] === true;
      });

      const finalFormulaTrue = calculator.evaluate(finalFormula, values);

      if (finalFormulaTrue && !calculator.evaluate(A as Formula, values)) {
        return false;
      }
    }

    return true;
  }

  private static evaluateImplication(
    formula: Implication,
    values: PropositionalVariableValues
  ): boolean {
    const left = calculator.evaluate(formula.left, values);
    const right = calculator.evaluate(formula.right, values);
    return !left || right;
  }

  private static evaluateBiconditional(
    formula: Biconditional,
    values: PropositionalVariableValues
  ): boolean {
    const left = calculator.evaluate(formula.left, values);
    const right = calculator.evaluate(formula.right, values);
    return (left && right) || (!left && !right);
  }

  private static evaluateConjunction(
    formula: Conjunction,
    values: PropositionalVariableValues
  ): boolean {
    const left = calculator.evaluate(formula.left, values);
    const right = calculator.evaluate(formula.right, values);
    return left && right;
  }

  private static evaluateDisjunction(
    formula: Disjunction,
    values: PropositionalVariableValues
  ): boolean {
    const left = calculator.evaluate(formula.left, values);
    const right = calculator.evaluate(formula.right, values);
    return left || right;
  }

  private static evaluateNegation(
    formula: Negation,
    values: PropositionalVariableValues
  ): boolean {
    const value = calculator.evaluate(formula.value, values);
    return !value;
  }

  protected static generateTruthCombinations(
    numVariables: number
  ): TruthValue[][] {
    const combinations: TruthValue[][] = [];
    const totalCombinations = 2 ** numVariables;

    for (let i = 0; i < totalCombinations; i++) {
      const binaryString = i.toString(2).padStart(numVariables, '0');
      const combination: TruthValue[] = binaryString
        .split('')
        .map(Number) as TruthValue[];
      combinations.push(combination);
    }

    return combinations;
  }

  private static collectVariables<T extends Formula>(
    formula: T,
    variables: Set<PropositionalVariable>
  ) {
    if (typeof formula === 'string') {
      variables.add(formula as PropositionalVariable);
    } else if (formula.operation === 'Negation') {
      calculator.collectVariables(formula.value, variables);
    } else {
      calculator.collectVariables(formula.left, variables);
      calculator.collectVariables(formula.right, variables);
    }
  }
}
