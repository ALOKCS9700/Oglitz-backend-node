import fetch from "node-fetch";

const getStockPriceByOther = (symbol, optionType, identifier) => {
  return new Promise(async (resolve, reject) => {
    try {
  const indexes = ['NIFTY', 'FINNIFTY', 'BANKNIFTY', 'MIDCPNIFTY'];

      const isIndexSelected = indexes.includes(symbol);
     
      const url = `https://option-chain-data.onrender.com/chain?${isIndexSelected?'index':'symbol'}=${symbol}`;

      const response = await fetch(url);
      const data = await response.json();

      // Filter the data based on optionType and identifier
      const optionData = data?.records?.data?.find(item => {
      console.log("item: ",item[optionType]?.identifier,item[optionType]?.identifier === identifier)
        return item[optionType]?.identifier === identifier;
      });

      if (optionData) {
        // Resolve the lastPrice of the filtered option
        resolve(optionData[optionType].lastPrice);
      } else {
        // If no matching data found, resolve with an appropriate message
        resolve(`No data found for symbol: ${symbol}, optionType: ${optionType}, identifier: ${identifier}`);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default getStockPriceByOther