import { Frege } from './frege/Frege';
import { inferenceRulesMap } from 'types';

const frege: Frege = new Frege();

export type * from 'types';
export * from 'utils';
export * from 'exceptions';

export { frege, Frege, inferenceRulesMap };
