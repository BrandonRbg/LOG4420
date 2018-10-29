const storage = {
    write(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    read(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    addProductToCard(id, quantity) {
        const data = this.read("products");
        const existingProduct = data.find(p => p.id === id);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            data.push({id, quantity});
        }
        this.write("products", data);
    },

    getProductsInCard() {
        return this.read("products");
    },

    createOrder(firstName, lastName) {
        const orders = this.read("orders");
        let id = orders.length + 1;
        orders.push({
            id,
            firstName,
            lastName
        });
        this.write("orders", orders);
    },

    clearCart() {
        localStorage.removeItem("products");
    }
};
