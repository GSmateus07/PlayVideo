export abstract class Filter {
    green: number;
    blue: number;
    
    constructor() {
        this.green = 0;
        this.blue = 0;
    }

    abstract calc(green: number, blue:number): void;
}

export class FazNadaFilter extends Filter {
    calc(green: number, blue: number): void {
        this.green = green;
        this.blue = blue;
    }
}


export class GreenFilter extends Filter {
    calc(green: number, blue: number): void {
        this.green = green;
        this.blue = 0;
    }
}

export class BlueFilter extends Filter {
    calc(green: number, blue: number): void {
        this.green = 0;
        this.blue = blue;
    }
}

export const filters: Filter[] = [
    new FazNadaFilter(),
    new GreenFilter(),
    new BlueFilter(),
]