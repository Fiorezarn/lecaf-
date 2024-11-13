const { errorServerResponse } = require("./response.helper");
const axios = require("axios");

const generateLatLongFromAddress = async (address) => {
  try {
    const response = await axios.get(`${process.env.GEOCODE_URL}`, {
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
      throw new Error("Address not found, Please insert valid address.");
    }
  } catch (error) {
    throw new Error(error);
  }
};

const generatePolyline = async (data) => {
  try {
    const promises = [];
    const coordinates = [];
    data.map((d) => {
      promises.push(
        (async () => {
          const response = await axios.get(
            `${process.env.ROUTER_OSRM_URL}/${Number(
              d["originLongitude"]
            )},${Number(d["originLatitude"])};${Number(
              d["destinationLongitude"]
            )},${Number(
              d["destinationLatitude"]
            )}?overview=full&geometries=geojson`
          );
          const coordinate = response.data.routes[0].geometry.coordinates;
          coordinates.push({ id: d.id, coord: coordinate });
        })()
      );
    });
    await Promise.all(promises);
    return coordinates;
  } catch (error) {
    throw new Error();
  }
};

module.exports = { generateLatLongFromAddress, generatePolyline };
