import { builder } from "src/builder/Builder";
import { Lexer } from "src/lexer/Lexer";
import { Parser } from "src/parser/Parser";
import { reducer } from "src/reducer/Reducer";
import { Formula } from "src/types/formulas/formula";

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
      toFormulaObject: <T extends Formula>(formula: string)=>{
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
      toFormulaString: (formula: Formula)=>{
        return this.builder.buildFormula(formula);
      }
    } 

    public reduce = (formula: string | Formula, options?: {toString: boolean})=>{
        let formulaObject: Formula;
        
        if(typeof formula == "string"){
          formulaObject = this.parse.toFormulaObject(formula);
          formulaObject = this.reducer['reduceFormula'](formulaObject);
        }else{
          formulaObject = this.reducer[formula.operation.toLocaleLowerCase()](formula);
        }

        if(!options?.toString) return formulaObject;
        return this.parse.toFormulaString(formulaObject);
    }
  }


