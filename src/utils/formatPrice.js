export const formatPriceShort = (price) => {
  if (!price || isNaN(price)) return "Price on Request";

  if (price >= 10000000) {
    return (price / 10000000).toFixed(2).replace(/\.00$/, "") + "Cr";
  }

  if (price >= 100000) {
    return (price / 100000).toFixed(2).replace(/\.00$/, "") + "L";
  }

  if (price >= 1000) {
    return (price / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  return price.toString();
};
