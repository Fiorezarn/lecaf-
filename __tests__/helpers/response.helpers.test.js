const { successResponseData } = require("@/helpers/response.helper");

describe("successResponseData Function", () => {
  it("should return a success response with the given data", async () => {
    // Mock the response object
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Call the successResponseData function
    successResponseData(mockResponse, "Request successful", {
      id: 1,
      name: "Test Item",
    });

    // Check if response status was called with correct status code
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    // Check if response send was called with correct data
    expect(mockResponse.send).toHaveBeenCalledWith({
      status: "success",
      code: 201,
      message: "Request successful",
      data: { id: 1, name: "Test Item" },
    });
  });

  it("should handle custom status code", async () => {
    // Mock the response object
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Call with custom code
    successResponseData(
      mockResponse,
      "Custom message",
      { id: 2, name: "Another Item" },
      202
    );

    expect(mockResponse.status).toHaveBeenCalledWith(202);

    expect(mockResponse.send).toHaveBeenCalledWith({
      status: "success",
      code: 202,
      message: "Custom message",
      data: { id: 2, name: "Another Item" },
    });
  });
});
