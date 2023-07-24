import assert from 'assert';
import { describe, it, beforeEach } from 'node:test';
import { Lexer } from '../Lexer';
import { TokenType } from 'src/types/tokens/tokens';
import { Token } from 'src/types/tokens/tokens';

let lexer: Lexer;

describe('Lexer', () => {
  beforeEach(() => {
    lexer = new Lexer('');
  });

  it('should be defined', () => {
    assert.ok(lexer);
  });

  it('should lex ¬P', () => {
    const expected: Token[] = [
      { type: 'operator', value: '¬' },
      { type: 'variable', value: 'P' },
    ];

    lexer.input = '¬P';
    const result = lexer.lex();
    assert.equal(result.length, 2);
    assert.deepEqual(result, expected);
  });

  it('should lex (P)', () => {
    const expected: Token[] = [
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'P' },
      { type: 'boundary', value: ')' },
    ];

    lexer.input = '(P)';
    const result = lexer.lex();
    assert.equal(result.length, 3);
    assert.deepEqual(result, expected);
  });

  it('should lex P -> (Q -> P)', () => {
    const expected: Token[] = [
      { type: 'variable', value: 'P' },
      { type: 'operator', value: '->' },
      { type: 'boundary', value: '(' },
      { type: 'variable', value: 'Q' },
      { type: 'operator', value: '->' },
      { type: 'variable', value: 'P' },
      { type: 'boundary', value: ')' },
    ];

    lexer.input = 'P -> (Q -> P)'
    const result = lexer.lex();
    assert.equal(result.length, 7);
    assert.deepEqual(result, expected);
  });
});
