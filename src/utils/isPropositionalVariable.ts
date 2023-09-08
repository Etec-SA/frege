import { Formula } from 'types/formulas/formula';
import { PropositionalVariable } from 'types/operations/propositional-variable';

const propositionalVariablesList: string[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

export function isPropositionalVariable(
  formula: Formula | string
): formula is PropositionalVariable {
  return (
    typeof formula === 'string' && propositionalVariablesList.includes(formula)
  );
}
