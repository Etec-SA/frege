import { Formula } from "src/types/formulas/formula";
import { Lexer } from "src/lexer/Lexer";
import { Parser } from "src/parser/Parser";
import { builder } from "src/builder/Builder";

export function parseToFormulaObject(formula: string): Formula{
    const tokens = new Lexer(formula).lex();
    return new Parser(tokens).parse();
}

export function parseToFormulaString(formula: Formula): string{
    return builder.buildFormula(formula);
}