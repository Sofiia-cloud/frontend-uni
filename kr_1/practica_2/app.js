const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let products = [
  { id: 1, name: "Сумка Birkin", price: 6500000 },
  { id: 2, name: "Кошелек", price: 450000 },
  { id: 3, name: "Ремень", price: 180000 },
];

app.get("/", (req, res) => {
  res.send("Доступные маршруты: /products");
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ error: "Товар не найден" });
  }

  res.json(product);
});

app.post("/products", (req, res) => {
  const { name, price } = req.body;

  if (!name || price === undefined) {
    return res
      .status(400)
      .json({ error: "Необходимо передать название товара и цену" });
  }
  if (typeof price !== "number" || price < 0) {
    return res
      .status(400)
      .json({ error: "Цена должна быть положительным числом" });
  }

  const newProduct = {
    id: Date.now(),
    name,
    price,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.patch("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ error: "Товар не найден" });
  }

  const { name, price } = req.body;

  if (name !== undefined) product.name = name;
  if (price !== undefined) {
    if (typeof price !== "number" || price < 0) {
      return res
        .status(400)
        .json({ error: "Цена должна быть положительным числом" });
    }
    product.price = price;
  }

  res.json(product);
});

app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = products.length;

  products = products.filter((p) => p.id !== id);

  if (products.length === initialLength) {
    return res.status(404).json({ error: "Товар не найден" });
  }

  res.json({ message: "Товар удалён" });
});

app.listen(port, () => {
  console.log(`Сервер запущен: http://localhost:${port}`);
});
