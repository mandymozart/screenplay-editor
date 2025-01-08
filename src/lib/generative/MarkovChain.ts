type TokenValue = {
    next: string;
    count: number;
};

type ChainEntry = {
    key: string;
    values: TokenValue[];
    total: number;
};

export default class MarkovChain<T> {
    private table: ChainEntry[];
    private textLength: number;

    constructor(textLength: number = 140) {
        this.table = [];
        this.textLength = textLength;
    }

    /**
     * Sets the approximate text length for generation.
     * @param length - The desired text length.
     */
    setTextLength(length: number): void {
        this.textLength = length;
    }

    /**
     * Adds data to the Markov chain.
     * @param input - The input data array.
     * @param textExtractor - A function to extract the string from the generic data type.
     */
    addToText(input: T[], textExtractor: (item: T) => string): void {
        input.forEach(item => {
            const text = textExtractor(item);
            this.tokenizeAndAdd(text);
        });
    }

    private tokenizeAndAdd(text: string): void {
        const tokens = text.split(/\s+/).map(t => t.toLowerCase());

        tokens.forEach((currentToken, index) => {
            const nextToken = index + 1 < tokens.length ? tokens[index + 1] : null;
            if (currentToken && nextToken) {
                this.buildChain(currentToken, nextToken);
            }
        });
    }

    private buildChain(currentToken: string, nextToken: string): void {
        let found = false;

        for (const row of this.table) {
            if (row.key === currentToken) {
                found = true;
                const existingToken = row.values.find(value => value.next === nextToken);

                if (existingToken) {
                    existingToken.count++;
                } else {
                    row.values.push({ next: nextToken, count: 1 });
                }

                row.total++;
                break;
            }
        }

        if (!found) {
            this.table.push({
                key: currentToken,
                values: [{ next: nextToken, count: 1 }],
                total: 1
            });
        }
    }

    buildText(): string {
        const randomIndex = Math.floor(Math.random() * this.table.length);
        let text = this.table[randomIndex].key;
        let nextState = this.addToGeneratedText(randomIndex);

        while (text.length < this.textLength) {
            const selectionIndex = this.findIndex(nextState);
            nextState = this.addToGeneratedText(selectionIndex);

            if (nextState === "-1") {
                break;
            }

            text += " " + nextState;
        }

        return text.trim();
    }

    private addToGeneratedText(rowIndex: number): string {
        const currentRow = this.table[rowIndex];

        if (!currentRow) {
            return "-1";
        }

        const totalChoices = currentRow.total;
        const random = Math.floor(Math.random() * totalChoices);
        let selection = 0;
        let index = 0;

        while (selection <= random) {
            selection += currentRow.values[index].count;
            if (selection > random) {
                break;
            }
            index++;
        }

        return currentRow.values[index].next;
    }

    private findIndex(key: string): number {
        return this.table.findIndex(row => row.key === key);
    }
}
