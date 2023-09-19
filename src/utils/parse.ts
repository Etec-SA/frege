import { Formula } from 'types/formulas/formula';
import { Lexer } from 'lexer/Lexer';
import { Parser } from 'parser/Parser';
import { Builder } from 'builder/Builder';

export function parseToFormulaObject(formula: string): Formula {
  const tokens = new Lexer(formula).lex();
  return new Parser(tokens).parse();
}

export function parseToFormulaString(formula: Formula): string {
  return Builder.buildFormula(formula);
}
