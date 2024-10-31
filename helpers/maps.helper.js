const { errorServerResponse } = require("./response.helper");
const axios = require("axios");
const geocodeUrl = process.env.GEOCODE_URL;

const generateLatLongFromAddres = async (address) => {
  try {
    const response = await axios.get(`${geocodeUrl}`, {
      params: {
        f: "json",
        SingleLine: address,
        maxLocations: 1,
        outFields: "Match_addr,Addr_type",
      },
    });

    if (response.data.candidates.length > 0) {
      const location = response.data.candidates[0].location;
      return {
        latitude: location.y,
        longitude: location.x,
        address: response.data.candidates[0].address,
      };
    } else {
      res.status(404).json({ message: "Alamat tidak ditemukan." });
    }
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

module.exports = { generateLatLongFromAddres };
