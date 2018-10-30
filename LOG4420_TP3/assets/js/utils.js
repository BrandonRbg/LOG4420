const utils = {
    idEquals: (a, b) => {
        return +a === +b;
    },
    sortNames: (a, b) => {
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        }
        return 0;
    },
    formatCurrency: (value) => {
        return value.toFixed(2).replace(".", ",");
    }
};