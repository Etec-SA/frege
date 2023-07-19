import { Formula } from "./interfaces/formula";

export class Builder {
  static disjunction(x: Formula, y: Formula) {
    return `${x.toUpperCase()} ∨ ${y.toUpperCase()}`;
  }

  static conjunction(x: Formula, y: Formula) {
    return `${x.toUpperCase()} ∧ ${y.toUpperCase()}`;
  }
}
