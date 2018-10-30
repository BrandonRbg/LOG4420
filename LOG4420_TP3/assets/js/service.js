const service = {
    getAllProducts: async () => {
        const data = await fetch("http://localhost:8000/data/products.json");
        return await data.json();
    },
    getProductById: async (id) => {
        const products = await service.getAllProducts();
        return products.find(x => +x.id === +id);
    }
};