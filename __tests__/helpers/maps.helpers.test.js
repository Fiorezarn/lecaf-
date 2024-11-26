const axios = require("axios");
const haversine = require("haversine-distance");
const {
  generateLatLongFromAddress,
  generatePolyline,
  generateDistance,
} = require("@/helpers/maps.helper");

jest.mock("axios");
jest.mock("haversine-distance");

describe("Geocoding Utilities", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.GEOCODE_URL =
      "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates";
    process.env.ROUTER_OSRM_URL =
      "https://router.project-osrm.org/route/v1/driving";
    process.env.STORE_LATITUDE = "40.7128";
    process.env.STORE_LONGITUDE = "-74.0060";
  });

  describe("generateLatLongFromAddress", () => {
    it("should return latitude, longitude and address when successful", async () => {
      const mockResponse = {
        data: {
          candidates: [
            {
              location: { x: -74.006, y: 40.7128 },
              address: "123 Test St, Test City, Test Country",
            },
          ],
        },
      };
      axios.get.mockResolvedValue(mockResponse);

      const result = await generateLatLongFromAddress("123 Test St");
      expect(result).toEqual({
        latitude: 40.7128,
        longitude: -74.006,
        address: "123 Test St, Test City, Test Country",
      });
      expect(axios.get).toHaveBeenCalledWith(
        process.env.GEOCODE_URL,
        expect.any(Object)
      );
    });

    it("should throw an error when address is not found", async () => {
      const mockResponse = { data: { candidates: [] } };
      axios.get.mockResolvedValue(mockResponse);

      await expect(
        generateLatLongFromAddress("Invalid Address")
      ).rejects.toThrow("Address not found, Please insert valid address.");
    });

    it("should throw an error when API call fails", async () => {
      axios.get.mockRejectedValue(new Error("API Error"));

      await expect(generateLatLongFromAddress("123 Test St")).rejects.toThrow(
        "API Error"
      );
    });
  });

  describe("generatePolyline", () => {
    it("should return coordinates for multiple routes", async () => {
      const mockData = [
        {
          id: 1,
          originLatitude: 40.7128,
          originLongitude: -74.006,
          destinationLatitude: 40.7484,
          destinationLongitude: -73.9857,
        },
        {
          id: 2,
          originLatitude: 40.7484,
          originLongitude: -73.9857,
          destinationLatitude: 40.7829,
          destinationLongitude: -73.9654,
        },
      ];
      const mockResponse = {
        data: {
          routes: [
            {
              geometry: {
                coordinates: [
                  [-74.006, 40.7128],
                  [-73.9857, 40.7484],
                ],
              },
            },
          ],
        },
      };
      axios.get.mockResolvedValue(mockResponse);

      const result = await generatePolyline(mockData);
      expect(result).toEqual([
        {
          id: 1,
          coord: [
            [-74.006, 40.7128],
            [-73.9857, 40.7484],
          ],
        },
        {
          id: 2,
          coord: [
            [-74.006, 40.7128],
            [-73.9857, 40.7484],
          ],
        },
      ]);
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    it("should throw an error when API call fails", async () => {
      const mockData = [
        {
          id: 1,
          originLatitude: 40.7128,
          originLongitude: -74.006,
          destinationLatitude: 40.7484,
          destinationLongitude: -73.9857,
        },
      ];
      axios.get.mockRejectedValue(new Error("API Error"));

      await expect(generatePolyline(mockData)).rejects.toThrow();
    });
  });

  describe("generateDistance", () => {
    it("should calculate distance between two points", () => {
      const mockData = {
        data: { latitude: 40.7484, longitude: -73.9857 },
      };
      haversine.mockReturnValue(5000); // 5 km in meters

      const result = generateDistance(mockData);
      expect(result).toBe("5.00");
      expect(haversine).toHaveBeenCalledWith(
        { latitude: "40.7128", longitude: "-74.0060" },
        { latitude: 40.7484, longitude: -73.9857 }
      );
    });

    it("should handle errors and return the error object", () => {
      const mockData = {
        data: { latitude: 40.7484, longitude: -73.9857 },
      };
      haversine.mockImplementation(() => {
        throw new Error("Calculation Error");
      });

      const result = generateDistance(mockData);
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe("Calculation Error");
    });
  });
});
