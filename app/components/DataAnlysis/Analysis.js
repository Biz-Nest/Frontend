// Find the most liked idea
export const findMostLikedIdea = (ideas, likes) => {
    const likeCount = {};
  
    // Count likes per idea
    likes.forEach(like => {
      if (like.content_type === 9) {
        likeCount[like.object_id] = (likeCount[like.object_id] || 0) + 1;
      }
    });
  
    // Find the idea with the maximum likes
    const mostLikedIdea = ideas.reduce((max, idea) => {
      if (likeCount[idea.id] > (likeCount[max.id] || 0)) {
        return idea;
      }
      return max;
    }, {});
  
    return mostLikedIdea;
  };
  // Find the most liked report
  export const findMostLikedReport = (reports, likes) => {
    const likeCount = {};
  
    // Count likes per report
    likes.forEach(like => {
      if (like.content_type === 11) {
        likeCount[like.object_id] = (likeCount[like.object_id] || 0) + 1;
      }
    });
  
    // Find the report with the maximum likes
    const mostLikedReport = reports.reduce((max, report) => {
      if (likeCount[report.id] > (likeCount[max.id] || 0)) {
        return report;
      }
      return max;
    }, {});
  
    return mostLikedReport;
  };


// Find the most repeated product in the cart
export const findMostRepeatedProduct = (cartItems = []) => {
    const productCount = {};
  
    // Ensure cartItems is an array before processing
    if (!Array.isArray(cartItems)) {
      return [];
    }
  
    // Count occurrences of each product
    cartItems.forEach(item => {
      const productId = item.product?.id; // Use optional chaining to handle potential undefined values
      if (productId) {
        productCount[productId] = (productCount[productId] || 0) + item.quantity;
      }
    });
  
    // Convert productCount to an array of product objects
    const productsWithCounts = Object.entries(productCount).map(([productId, count]) => ({
      id: productId,
      count,
      name: `Product ${productId}` 
    }));
  
    // Sort by count in descending order
    productsWithCounts.sort((a, b) => b.count - a.count);
  
    return productsWithCounts;
  };
  
  
  
  
  // Find the most viewed store
  export const findMostViewedStore = (stores) => {
    return stores.reduce((max, store) => (store.views > max.views ? store : max), stores[0]);
  };