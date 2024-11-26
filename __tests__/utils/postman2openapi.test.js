const fs = require("fs");
const axios = require("axios");
const { transpile } = require("postman2openapi");

jest.mock("fs");
jest.mock("axios");
jest.mock("postman2openapi");
jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

describe("Postman to OpenAPI Conversion", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.POSTMAN_API_URL = "https://api.postman.com";
    process.env.POSTMAN_ACCESS_KEY = "test_access_key";
    process.env.BASE_URL = "https://api.example.com";
  });

  it("should successfully convert Postman collection to OpenAPI", async () => {
    const mockPostmanCollection = {};
    const mockOpenAPISpec = {};

    axios.get.mockResolvedValue({
      data: { collection: mockPostmanCollection },
    });
    transpile.mockResolvedValue(mockOpenAPISpec);

    await require("./postman2openapi.test");

    expect(axios.get).toHaveBeenCalledWith(
      "https://api.postman.com?access_key=test_access_key"
    );
    expect(transpile).toHaveBeenCalledWith(mockPostmanCollection);
    expect(fs.writeFile).toHaveBeenCalledWith(
      "./config/swagger-output.json",
      JSON.stringify(
        {
          ...mockOpenAPISpec,
          servers: [{ url: "https://api.example.com" }],
        },
        null,
        2
      ),
      expect.any(Function)
    );
  });

  it("should handle file writing error", async () => {
    const mockPostmanCollection = {};
    const mockOpenAPISpec = {};

    axios.get.mockResolvedValue({
      data: { collection: mockPostmanCollection },
    });
    transpile.mockResolvedValue(mockOpenAPISpec);
    fs.writeFile.mockImplementation((path, data, callback) => {
      callback(new Error("File write error"));
    });

    console.log = jest.fn();

    await require("./postman2openapi.test");

    expect(console.log).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should handle API request error", async () => {
    axios.get.mockRejectedValue(new Error("API request failed"));

    console.error = jest.fn();

    await require("./postman2openapi.test");

    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should handle transpile error", async () => {
    const mockPostmanCollection = {
      /* mock Postman collection data */
    };

    axios.get.mockResolvedValue({
      data: { collection: mockPostmanCollection },
    });
    transpile.mockRejectedValue(new Error("Transpile error"));

    console.error = jest.fn();

    await require("./postman2openapi.test");

    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
  });
});
