const axios = require("axios");
const { environment } = require("../../environment");
// const logger = require("../../logger");

const cmcApi = async (url) => {
  try {
    const client = await axios({
      baseURL: environment.CMC_BASE_URL,
      url,
      method: "GET",
      headers: { "X-CMC_PRO_API_KEY": environment.CMC_API_KEY },
    });

    return client.data;
  } catch (error) {
    // logger.error({
    //   error,
    //   inputs: url,
    // });
    return {
      error: "Error Converting Price",
      error,
    };
  }
};

module.exports = {
  cmcApi,
};
