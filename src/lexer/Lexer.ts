/* 
  Lexer is a modified version of the llang by Petr Nevyhoštěný (@pnevyk on github/twitter).
  "llang is MIT licensed. Feel free to use it, contribute or spread the word. Created with love by Petr Nevyhoštěný."
*/

import { UnrecognizedTokenException } from 'exceptions';
import { Token, PropositionalVariable, Boundary, Operator } from 'types';

/**
 * Lexer class for tokenizing propositional logic formulas.
 */
export class Lexer {
  public input: string;
  private tokens: Token[] = [];
  private pointer: number = 0;
  private c: string;
  private operator: string = '';

  /**
   * Creates a new Lexer instance.
   * @param formula The propositional logic formula to tokenize.
   */
  constructor(formula: string) {
    this.input = formula;
  }

  /**
   * Tokenizes the propositional logic formula.
   * @returns An array of tokens representing the formula.
   */
  public lex(): Token[] {
    while (this.next()) {
      if (this.isSpecial(this.c)) {
        this.operator += this.c;
        if (this.operatorExists(this.operator)) {
          this.push({
            type: 'operator',
            value: this.operator,
          });
          this.operator = '';
        }
      } else {
        if (this.operator)
          this.throwTokenException(
            this.operator,
            this.pointer - this.operator.length - 1
          );
        else if (this.isWhiteSpace(this.c)) continue;
        else if (this.isVariable(this.c))
          this.push({ type: 'variable', value: this.c });
        else if (this.isExpressionBoundary(this.c))
          this.push({ type: 'boundary', value: this.c });
        else this.throwTokenException(this.c, this.pointer - 2);
      }
    }

    return this.tokens;
  }

  private next() {
    return (this.c = this.input[this.pointer++]);
  }

  private push(token: Token) {
    this.tokens.push({
      type: token.type,
      value: token.value,
    } as Token);
  }

  private isWhiteSpace(c: string) {
    return /\s/.test(c);
  }

  private isVariable(c: string): c is PropositionalVariable {
    return /[A-Z]/.test(c);
  }

  private isSpecial(c: string) {
    return /[¬∧∨&!|\-><->]/.test(c);
  }

  private isExpressionBoundary(c: string): c is Boundary {
    return /[\(\)]/.test(c);
  }

  private operatorExists(op: string): op is Operator {
    return ['¬', '!', '∧', '&', '∨', '|', '->', '<->'].indexOf(op) !== -1;
  }

  private throwTokenException(token: string, position: number) {
    throw new UnrecognizedTokenException(
      `Unrecognized token "${token}" on position ${position}`
    );
  }
}
