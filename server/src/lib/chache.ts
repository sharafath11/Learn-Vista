import NodeCache from "node-cache";
//NodeCache is better for this 
export const cache = new NodeCache({
  stdTTL: 86400,
  checkperiod: 600, 
});
