/* 
  Parser is a modified version of the llang by Petr Nevyhoštěný (@pnevyk on github/twitter).
  "llang is MIT licensed. Feel free to use it, contribute or spread the word. Created with love by Petr Nevyhoštěný."
*/

import { Token, Formula, Operator, Negation, Disjunction, Conjunction, Implication, Biconditional, PropositionalVariable } from "types";


/**
 * Parser class for analyzing tokens and creating a logical formula tree.
 */
export class Parser {
  public tokens: Token[];
  private token: Token;

  /**
   * Constructor of the Parser class.
   * @param tokens Array of tokens to be analyzed.
   */
  constructor(tokens: Token[]) {
    this.tokens = JSON.parse(JSON.stringify(tokens));
  }

  /**
   * Performs the analysis of the tokens and returns the logical formula tree.
   * @returns The logical formula resulting from the analysis of the tokens.
   */
  public parse(): Formula {
    return this.process();
  }

  private process(operation?: Operator): Formula {
    operation = operation || null;
    const args: Formula[] = [];
    
    while (this.next()) {
      if(this.token === undefined) break;
      if (this.token?.type === 'boundary') {
        if (this.token.value === ')') return this.node(operation, args);

        args.push(this.process());
      }
      
      if (this.token?.type === 'variable') {
        args.push(this.token.value);
        if (this.isUnary(operation)) return this.node(operation, args);
      }

      if (this.token?.type === 'operator') {
        if (this.isUnary(this.token.value)) {
          args.push(this.process(this.token.value));
          continue;
        }

        if (operation) {
          const tmp = args.slice(0);
          args.length = 0;
          args.push(this.node(operation, tmp));
        }

        operation = this.token.value;
      }
    }

    return this.node(operation, args);
  }

  private next() {
    return (this.token = this.tokens.shift());
  }

  private node(operator: Operator, args: Formula[]): Formula {
    switch (operator) {
      case '¬':
        return { operation: 'Negation', value: args[0] } as Negation;
      case '∨':
        return {
          operation: 'Disjunction',
          left: args[0],
          right: args[1],
        } as Disjunction;
      case '∧':
        return {
          operation: 'Conjunction',
          left: args[0],
          right: args[1],
        } as Conjunction;
      case '->':
        return {
          operation: 'Implication',
          left: args[0],
          right: args[1],
        } as Implication;
      case '<->':
        return {
          operation: 'Biconditional',
          left: args[0],
          right: args[1],
        } as Biconditional;
      default:
        return args[0] as PropositionalVariable;
    }
  }

  private isUnary(operator: Operator) {
    return operator === '¬';
  }
}
