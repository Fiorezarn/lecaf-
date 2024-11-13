const axios = require("axios");

const serverKey = process.env.SERVER_KEY_MIDTRANS;
const baseUrl = process.env.BASE_URL_MIDTRANS;
const snapUrl = process.env.SNAP_URL_MIDTRANS;

const midtransCreateSnapTransaction = async (transactionDetails) => {
  try {
    const response = await axios.post(
      `${snapUrl}/transactions`,
      transactionDetails,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(serverKey + ":").toString(
            "base64"
          )}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Failed to create snap transaction"
    );
  }
};

const midtransVerifyTransaction = async (orderId) => {
  try {
    const response = await axios.get(`${baseUrl}/${orderId}/status`, {
      headers: {
        Authorization: `Basic ${Buffer.from(serverKey + ":").toString(
          "base64"
        )}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error.response);
    throw new Error(
      error.response.data.message || "Failed to verify transaction"
    );
  }
};
const midtransCancelTransaction = async (orderId) => {
  try {
    const response = await axios.post(
      `${baseUrl}/${orderId}/cancel`,
      {},
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(serverKey + ":").toString(
            "base64"
          )}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Failed to Cancel Transaction"
    );
  }
};

module.exports = {
  midtransCreateSnapTransaction,
  midtransVerifyTransaction,
  midtransCancelTransaction,
};
