import { Builder } from 'builder/Builder';
import { Calculator } from 'calculator/Calculator';
import { Lexer } from 'lexer/Lexer';
import { Parser } from 'parser/Parser';
import { ProofChecker } from 'proof-checker/ProofChecker';
import { Reducer } from 'reducer/Reducer';
import { Formula, BinaryOperationFormula, Negation, TruthValue } from 'types';
import { ReducedFormula } from 'types/conditional-types/reduced-formula';

export class Frege {
  private builder = Builder;
  private reducer = Reducer;
  private calculator = Calculator;
  private proofChecker = ProofChecker;

  /**
   * The `parse` property provides functions to build and parse formulas in propositional logic.
   * @public
   */
  public parse = {
    /**
     * Builds a formula object from a string, which contains a well-formed formula of the propositional logic.
     * @param formula - The logical formula to build.
     * @returns The built formula object.
     * @throws {UnrecognizedTokenException} If the provided formula contains unrecognized tokens.
     *
     * @example
     *
     * // Input: "P->Q"
     * // Output: { operation: 'Implication', left: 'P', right: 'Q' }
     * const parsedFormula = frege.parse.toFormulaObject<Implication>("P->Q");
     * console.log(parsedFormula);
     */
    toFormulaObject: <T extends Formula>(formula: string) => {
      const tokens = new Lexer(formula).lex();
      const parsedFormula = new Parser(tokens).parse();
      return parsedFormula as T;
    },

    /**
     * Builds a logical formula string from a formula object using the syntax of propositional logic.
     * @param formula - The formula object to build the string from.
     * @returns The built logical formula string.
     * @throws {InvalidFormulaException} If the provided formula object is invalid or incomplete.
     *
     * @example
     *
     * // Input: { operation: 'Implication', left: 'P', right: 'Q' }
     * // Output: "(P->Q)"
     * const implication: Implication = {
     *    operation: 'Implication',
     *    left: 'P',
     *    right: 'Q'
     * };
     *
     * const parsedFormula = frege.parse.toFormulaString(implication);
     * console.log(parsedFormula); // => "(P->Q)"
     */
    toFormulaString: (formula: Formula) => {
      return this.builder.buildFormula(formula);
    },
  };

  public verifyConsequence = {
    semantic: this.calculator.isSemanticConsequence,
    syntactic: () => {},
  };
  /**
   * Reduces a formula object or a formula string to its reduced form.
   * @param formula - The formula object or formula string to reduce.
   * @returns The reduced formula in its string representation or as a formula object.
   *
   * @example
   * // Input: { operation: 'Implication', left: 'P', right: ' Q' }
   * // Output: { operation: 'Disjunction' left: { operation: 'Negation', value: 'P'}, right: 'Q' };
   *
   * const formulaObject: Implication = {
   *    operation: 'Implication',
   *    left: 'P',
   *    right: 'Q'
   * };
   *
   * const reducedFormula = frege.reduce(formulaObject);
   * console.log(reducedFormula); // => { operation: 'Disjunction' left: { operation: 'Negation', value: 'P'}, right: 'Q' };
   *
   *
   * // Input: "P<->Q"
   * // Output: '((¬(P) ∨ Q) ∧ (¬(Q) ∨ P))'
   *
   * const formulaString = "P<->Q";
   *
   * const reducedFormula = frege.reduce(formulaString);
   * console.log(reducedFormula); // => '((¬(P) ∨ Q) ∧ (¬(Q) ∨ P))'
   */
  public reduce = <T extends string | (BinaryOperationFormula | Negation)>(
    formula: T
  ): ReducedFormula<T> => {
    if (typeof formula === 'string') {
      let formulaObject = this.parse.toFormulaObject(formula);
      formulaObject = this.reducer['reduceFormula'](formulaObject);
      return this.parse.toFormulaString(formulaObject) as ReducedFormula<T>;
    }

    let operation = formula.operation.toLocaleLowerCase();
    const reducedFormula = this.reducer[operation](formula) as Formula;

    return reducedFormula as ReducedFormula<T>;
  };

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
  public evaluate = this.calculator.evaluate;

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
   * {
   *    headers: ['P', 'Q', '(P -> Q)'],
   *    truthCombinations: [
   *      [false, false], [false, true],
   *      [true, false], [true, true]
   *    ],
   *    truthValues: [true, true, false, true]
   *  }
   */
  public generateTruthTable = this.calculator.generateTruthTable;

  /**
   * Checks the given proof for validity.
   * 
   * @param {Proof} proof - The proof to be checked.
   * @returns {boolean} - `true` if the proof is valid, `InferenceError` or `Error` otherwise.
   * @example
   * ```
   * const proof = {
    // ... (Your proof object)
    };

    const isProofValid = ProofChecker.check(proof);
    console.log(`The proof is valid: ${isProofValid}`);
   * ```
   */
  public checkProof = this.proofChecker.check;

  /**
   * Checks if the given formula is a tautology.
   *
   * @param {Formula | string} formula - The formula to check.
   */
  public isTautology = (formula: Formula | string) => {
    const { truthValues } = this.calculator.generateTruthTable(formula);

    for (let i = 0; i < truthValues.length; i++) {
      if (!truthValues[i]) return false;
    }

    return true;
  };
  /**
   * Checks if the given formula is a contradiction.
   *
   * @param {Formula | string} formula - The formula to check.
   */
  public isContradiction = (formula: Formula | string) => {
    const { truthValues } = this.calculator.generateTruthTable(formula);

    for (let i = 0; i < truthValues.length; i++) {
      if (truthValues[i]) return false;
    }

    return true;
  };

  /**
   * Checks if the given formula is a contingency.
   *
   * @param {Formula | string} formula - The formula to check.
   */
  public isContingency = (formula: Formula | string) => {
    let firstTruthValue: TruthValue;
    const { truthValues } = this.calculator.generateTruthTable(formula);

    firstTruthValue = truthValues[0];

    for (let i = 1; i < truthValues.length; i++) {
      if (truthValues[i] != firstTruthValue) return true;
    }

    return false;
  };
}
