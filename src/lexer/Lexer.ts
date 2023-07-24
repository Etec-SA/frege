/* 
  Lexer is a modified version of the llang by Petr Nevyhoštěný (@pnevyk on github/twitter).
  "llang is MIT licensed. Feel free to use it, contribute or spread the word. Created with love by Petr Nevyhoštěný."
*/

import { UnrecognizedTokenException } from "src/exceptions/unrecognized-token.exception";
import { PropositionalVariable } from "src/types/operations/propositional-variable";
import { Token, TokenType, Boundary, Operator } from "src/types/tokens/tokens";

export class Lexer {
  public input: string;
  private tokens: Token[] = [];
  private pointer: number = 0;
  private c: string;
  private operator: string = '';

  constructor(input: string) {
    this.input = input;
  }

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
    return /[¬∧v\-><->]/.test(c);
  }

  private isExpressionBoundary(c: string): c is Boundary {
    return /[\(\)]/.test(c);
  }

  private operatorExists(op: string): op is Operator {
    return ['¬', '∧', 'v', '->', '<->'].indexOf(op) !== -1;
  }

  throwTokenException(token: string, position: number) {
    throw new UnrecognizedTokenException(
      `Unrecognized token "${token}" on position ${position}`
    );
  }
}