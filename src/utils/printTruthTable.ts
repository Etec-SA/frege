import { TruthTable } from "types";

export function printTruthTable(truthTable: TruthTable) {
    console.log(`\x1b[36m${truthTable.headers.join('\t')}\x1b[0m`);
  
    for (let i = 0; i < truthTable.truthCombinations.length; i++) {
      const combination = truthTable.truthCombinations[i];
      const values = truthTable.truthValues[i];
  
      const formattedCombination = combination.map((value) => (value ? '\x1b[32mT\x1b[0m' : '\x1b[31mF\x1b[0m')).join('\t');
      const formattedValue = values ? '\x1b[32mT\x1b[0m' : '\x1b[31mF\x1b[0m';
  
      console.log(`${formattedCombination}\t${formattedValue}`);
    }
  }
