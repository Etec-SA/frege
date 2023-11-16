/* 
  Parser is a modified version of the llang by Petr Nevyhoštěný (@pnevyk on github/twitter).
  "llang is MIT licensed. Feel free to use it, contribute or spread the word. Created with love by Petr Nevyhoštěný."
*/

import { SyntaxException } from 'exceptions/syntax-error.exception';
import {
  Token,
  Formula,
  Operator,
  Negation,
  Disjunction,
  Conjunction,
  Implication,
  Biconditional,
  PropositionalVariable,
} from 'types';

/**
 * Parser class for analyzing tokens and creating a logical formula tree.
 */
export class Parser {
  public tokens: Token[];
  private token: Token;
  private lastIsVariable: boolean = false;

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
      if (this.lastIsVariable && this.token?.type === 'variable')
        throw new SyntaxException(
          `Token "${this.token.value}": Expected one variable, but received more than 1.`
        );

      if (this.token === undefined) break;
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

      this.lastIsVariable =
        this.token?.type === 'variable' ||
        (this.lastIsVariable && this.token?.type === 'boundary');
    }

    return this.node(operation, args);
  }

  private next() {
    /*if (this.token?.type === 'variable' && this.tokens[0]?.type === 'variable')
      throw new Error();*/

    return (this.token = this.tokens.shift());
  }

  private node(operator: Operator, args: Formula[]): Formula {
    if (['->', '<->', '&', '|', '∧', '∨'].includes(operator)) {
      if (args.length !== 2)
        throw new SyntaxException(`
        Token "${operator}": expected 2 variables, but received 1.
      `);
    }

    if (operator === '¬' || operator === '!')
      return { operation: 'Negation', value: args[0] } as Negation;

    if (operator === '∨' || operator === '|')
      return {
        operation: 'Disjunction',
        left: args[0],
        right: args[1],
      } as Disjunction;

    if (operator === '∧' || operator === '&')
      return {
        operation: 'Conjunction',
        left: args[0],
        right: args[1],
      } as Conjunction;

    if (operator === '->')
      return {
        operation: 'Implication',
        left: args[0],
        right: args[1],
      } as Implication;

    if (operator === '<->')
      return {
        operation: 'Biconditional',
        left: args[0],
        right: args[1],
      } as Biconditional;

    return args[0] as PropositionalVariable;
  }

  private isUnary(operator: Operator) {
    return operator === '¬' || operator === '!';
  }
}
