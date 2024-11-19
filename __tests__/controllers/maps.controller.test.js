const { createPolyline } = require("@/controllers/maps.controller");
const { generatePolyline } = require("@/helpers/maps.helper");
const {
  successResponseData,
  errorServerResponse,
} = require("@/helpers/response.helper");

jest.mock("@/helpers/maps.helper");
jest.mock("@/helpers/response.helper");

describe("createPolyline", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        origin: "New York",
        destination: "Los Angeles",
      },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 201 and polyline data on successful polyline creation", async () => {
    const mockPolylineData = {
      points: "encoded_polyline_string",
      distance: "2,789.5 mi",
      duration: "40 hours 20 mins",
    };

    generatePolyline.mockResolvedValue(mockPolylineData);
    successResponseData.mockImplementation((res, message, data, statusCode) => {
      res.status(statusCode).json({
        status: "success",
        message,
        data,
      });
    });

    await createPolyline(mockReq, mockRes);

    expect(generatePolyline).toHaveBeenCalledWith(mockReq.body);
    expect(successResponseData).toHaveBeenCalledWith(
      mockRes,
      "Success get polyline",
      mockPolylineData,
      201
    );
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: "success",
      message: "Success get polyline",
      data: mockPolylineData,
    });
  });

  it("should return 500 and error message when polyline creation fails", async () => {
    const errorMessage = "Failed to generate polyline";
    generatePolyline.mockRejectedValue(new Error(errorMessage));
    errorServerResponse.mockImplementation((res, message) => {
      res.status(500).json({
        status: "error",
        message,
      });
    });

    await createPolyline(mockReq, mockRes);

    expect(generatePolyline).toHaveBeenCalledWith(mockReq.body);
    expect(errorServerResponse).toHaveBeenCalledWith(mockRes, errorMessage);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: "error",
      message: errorMessage,
    });
  });
});
