import { builder } from 'src/builder/Builder';
import { Lexer } from 'src/lexer/Lexer';
import { Parser } from 'src/parser/Parser';
import { reducer } from 'src/reducer/Reducer';
import { BinaryOperationFormula } from 'src/types/formulas/binary-operation-formula';
import { Formula } from 'src/types/formulas/formula';
import { Negation } from 'src/types/operations/unary-operation';
import { ReducedFormula } from 'src/types/conditional-types/reduced-formula';

export class Frege {
  private builder = builder;
  private reducer = reducer;

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
}
