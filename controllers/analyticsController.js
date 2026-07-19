import Product from '../models/product.js';
import Order from '../models/order.js';
import axios from 'axios';

export const getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Phase A: Collate User Metrics Pipeline
    const baseOrders = await Order.find({ user: userId });
    const userPurchasedCategories = baseOrders.flatMap(o => o.orderItems.map(i => i.product));

    let recommendedProducts = [];

    // Phase B: Query RapidMiner Analytical Integration Layer
    if (process.env.RAPIDMINER_URL && process.env.RAPIDMINER_URL !== 'https://rapidminer-server.example.com/api/rest/process/RecommendationEngine') {
      try {
        const rapidMinerResponse = await axios.post(
          process.env.RAPIDMINER_URL,
          { userId: userId.toString(), purchaseHistory: userPurchasedCategories },
          { headers: { Authorization: process.env.RAPIDMINER_AUTH, 'Content-Type': 'application/json' }, timeout: 4000 }
        );
        if (rapidMinerResponse.data && rapidMinerResponse.data.recommendedIds) {
          recommendedProducts = await Product.find({ _id: { $in: rapidMinerResponse.data.recommendedIds } });
        }
      } catch (rmErr) {
        console.warn('RapidMiner Gateway Timeout/Issue. Moving to Fallback Analytics Matrix Routing.');
      }
    }

    // Phase C: Fallback Context-Aware Engine Logic
    if (recommendedProducts.length === 0) {
      if (userPurchasedCategories.length > 0) {
        const structuralAnchor = await Product.find({ _id: { $in: userPurchasedCategories } });
        const internalCategories = [...new Set(structuralAnchor.map(p => p.category))];
        recommendedProducts = await Product.find({
          category: { $in: internalCategories },
          _id: { $nin: userPurchasedCategories }
        }).limit(4);
      }
      if (recommendedProducts.length === 0) {
        recommendedProducts = await Product.find({}).sort({ price: -1 }).limit(4);
      }
    }

    res.json(recommendedProducts);
  } catch (error) {
    next(error);
  }
};