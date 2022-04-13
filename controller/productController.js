const { validationResult } = require("express-validator");
const {
  getProducts,
  getProductById,
  addProduct,
  editProduct,
} = require("../models/products.model");

module.exports.getAllProducts = async (req, res) => {
  const Products = await getProducts();
  res.render("products", {
    active: "products",
    title: "Products",
    user: req.user,
    products: Products,
  });
};
module.exports.getaddProducts = async (req, res) => {
  res.render("add-editProduct", {
    active: "products",
    title: "add product",
    user: req.user,
    errors: [],
    product: false,
  });
};

module.exports.geteditProducts = async (req, res) => {
  const product = await getProductById(req.params.id);
  res.render("add-editProduct", {
    active: "products",
    title: "Edit product",
    user: req.user,
    errors: [],
    product: product[0],
  });
};

module.exports.postaddProducts = async (req, res) => {
  const { errors } = validationResult(req);
  if (errors.length == 0) {
    const product = req.body;
    await addProduct(product);
    res.redirect("/products");
  } else {
    res.render("add-editProduct", {
      active: "products",
      title: "add product",
      user: req.user,
      errors: errors,
      product: req.body,
    });
  }
};

module.exports.posteditProducts = async (req, res) => {
  const itemID = req.params.id;
  const { errors } = validationResult(req);
  if (errors.length == 0) {
    const product = req.body;
    await editProduct(itemID, product);
    res.redirect("/products");
  } else {
    const product = await getProductById(itemID);
    console.log(product);
    res.render("add-editProduct", {
      active: "products",
      title: "Edit product",
      user: req.user,
      errors: errors,
      product: product[0],
    });
  }
};
