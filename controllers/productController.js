import Product from '../models/product.js';

export const getProducts = async (req, res, next) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    let sortOptions = {};
    if (sort === 'low') sortOptions.price = 1;
    else if (sort === 'high') sortOptions.price = -1;
    else sortOptions.createdAt = -1;

    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else {
      res.status(404);
      throw new Error('Product Resource Mapping Failed.');
    }
  } catch (error) {
    next(error);
  }
};

export const createProductAdmin = async (req, res, next) => {
  try {
    const { name, price, description, image, category, countInStock } = req.body;
    const product = new Product({
      name: name || 'Placeholder Blueprint',
      price: price || 0,
      description: description || 'Operational outline definition',
      imageUrl: image || 'https://via.placeholder.com/300',
      category: category || 'General Utilities',
      stock: countInStock || 0,
    });
    const generatedProduct = await product.save();
    res.status(201).json(generatedProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProductAdmin = async (req, res, next) => {
  try {
    const { name, price, description, image, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.imageUrl = image || product.imageUrl;
      product.category = category || product.category;
      product.stock = countInStock !== undefined ? countInStock : product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product Mutation target missing.');
    }
  } catch (error) {
    next(error);
  }
};

export const deleteProductAdmin = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Target inventory block components terminated.' });
    } else {
      res.status(404);
      throw new Error('Product component removal failure.');
    }
  } catch (error) {
    next(error);
  }
};