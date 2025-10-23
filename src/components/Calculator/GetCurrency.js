 export const getUserCurrency = async () => {
  try {
    const response = await fetch(
      "https://api.ipdata.co?api-key=6253f2d2c19ce49193b868d2938c4eaba98b34a97b24b484d922930d&fields=currency"
    );
    const data = await response.json();
    if (data.currency) {
      return {
        code: data.currency.code,
        symbol: data.currency.symbol,
        name: data.currency.name,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching currency:", error);
    return null;
  }
};
