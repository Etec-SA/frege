export class UnrecognizedTokenException extends Error{}

import { PropositionalVariable } from "src/builder/interfaces/propositional-variable";

type Operator = '¬' | '∧' | 'v' | '->' | '<->'
type Boundary = '(' | ')';
type TokenType = 'variable' | 'operator' | 'boundary';

type TokenMap = {
    variable: PropositionalVariable
    operator: Operator
    boundary: Boundary
}

type Token<T extends TokenType> = {
    type: T;
    value: TokenMap[T];
};

function lex(input: string): Token<TokenType>[] {
    const tokens: Token<TokenType>[] = [];
    let pointer = 0;
    let c: string;
    let operator = '';

    while (next()) {
        if (isSpecial(c)) {
            operator += c;
            if (operatorExists(operator)) {
                push('operator', {
                    type: 'operator',
                    value: operator
                });
                operator = '';
            }
        }

        else {
            if (operator) unrecognizedToken(operator, pointer - operator.length - 1);
            
            if (isWhiteSpace(c)) continue;
            else if (isVariable(c)) push('variable', {type: 'variable', value: c});
            else if (isExpressionBoundary(c)) push('boundary', {type: 'boundary', value: c});
            else unrecognizedToken(c, pointer - 2);
        }
    }

    return tokens;

    function next() {
        return (c = input[pointer++]);
    }

    function push<T extends TokenType>(type: T, token: Token<T>) {
        tokens.push({
            type: type,
            value: token.value,
        });
    }

    function isWhiteSpace(c: string) {
        return /\s/.test(c);
    }

    function isVariable(c: string): c is PropositionalVariable {
        return /[A-Z]/.test(c);
    }

    function isSpecial(c: string) {
        return /[¬∧v\-><->]/.test(c);
      }
      
    function isExpressionBoundary(c: string): c is Boundary {
        return /[\(\)]/.test(c);
    }

    function operatorExists(op: string): op is Operator {
        return ['¬','∧','v','->','<->'].indexOf(op) !== -1;
    }

    function unrecognizedToken(token: string, position: number) {
        throw new UnrecognizedTokenException(`Unrecognized token "${token}" on position ${position}`);
    }
}

console.log(lex('(P ->¬(Q->P)'));