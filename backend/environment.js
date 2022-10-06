const environment = {
  MONGOOSE_URL:
    "mongodb://test:test123@cluster0-shard-00-00.1cezz.mongodb.net:27017,cluster0-shard-00-01.1cezz.mongodb.net:27017,cluster0-shard-00-02.1cezz.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-yvux9g-shard-0&authSource=admin&retryWrites=true&w=majority",
  ADMIN_TOKEN: "_secuRe@walLetStakingon&apI2coNnect_4",
  RPC_URL: "https://api.avax.network/ext/bc/C/rpc",
  CMC_BASE_URL: "https://pro-api.coinmarketcap.com",
  CMC_API_KEY: "aa739a85-8a33-4567-8e5c-8f99f07559b7",
};

/*
if (process.env.NODE_ENV === "development") {
    environment.MONGOOSE_URL = "mongodb+srv://test:test123@cluster0.1cezz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    environment.ADMIN_TOKEN = "_secuRe@walLeton&apI2coNnect_4"
    environment.RPC_URL = "https://api.avax.network/ext/bc/C/rpc"
}


if (process.env.NODE_ENV === "production") {
    environment.MONGOOSE_URL = "mongodb+srv://owl:owl123@cluster0.8cms0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    environment.ADMIN_TOKEN = "_secuRe@walLeton&apI2coNnect_4"
    environment.RPC_URL = "https://api.avax.network/ext/bc/C/rpc"
}


if (process.env.NODE_ENV === "staging") {
    environment.MONGOOSE_URL = "mongodb+srv://test:test123@cluster0.1cezz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    environment.ADMIN_TOKEN = "_secuRe@walLeton&apI2coNnect_4"
    environment.RPC_URL = "https://api.avax.network/ext/bc/C/rpc"
}

*/
module.exports = { environment };
