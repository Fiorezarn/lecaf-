const fs = require("fs").promises;
const { transpile } = require("postman2openapi");
const axios = require("axios");
const { generateOpenAPI } = require("@/utils/postman2openapi");

jest.mock("fs", () => ({
  promises: {
    writeFile: jest.fn(),
  },
}));
jest.mock("axios");
jest.mock("postman2openapi", () => ({
  transpile: jest.fn(),
}));
console.log = jest.fn();

describe("generateOpenAPI", () => {
  const mockResponse = {
    data: {
      collection: {
        info: { name: "Test Collection" },
        item: [],
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue(mockResponse);
    transpile.mockReturnValue({
      openapi: "3.0.0",
      info: { title: "Test API", version: "1.0.0" },
      paths: {},
    });
    fs.writeFile.mockResolvedValue();
  });

  it("should fetch Postman collection, transpile to OpenAPI, and write to a file", async () => {
    await generateOpenAPI();
    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.POSTMAN_API_URL}?access_key=${process.env.POSTMAN_ACCESS_KEY}`
    );
    expect(transpile).toHaveBeenCalledWith(mockResponse.data.collection);
    expect(fs.writeFile).toHaveBeenCalledWith(
      "./config/swagger-output.json",
      JSON.stringify(
        {
          openapi: "3.0.0",
          info: { title: "Test API", version: "1.0.0" },
          paths: {},
          servers: [{ url: process.env.BASE_URL }],
        },
        null,
        2
      )
    );
    expect(console.log).toHaveBeenCalledWith(
      "OpenAPI JSON file has been updated successfully."
    );
  });

  it("should throw an error if API call fails", async () => {
    const mockError = new Error("API Error");
    axios.get.mockRejectedValue(mockError);
    await expect(generateOpenAPI()).rejects.toThrow("API Error");
    expect(transpile).not.toHaveBeenCalled();
    expect(fs.writeFile).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.any(String));
  });

  it("should throw an error if transpile fails", async () => {
    const mockError = new Error("Transpile Error");
    transpile.mockImplementation(() => {
      throw mockError;
    });
    await expect(generateOpenAPI()).rejects.toThrow("Transpile Error");
    expect(fs.writeFile).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.any(String));
  });
  it("should throw an error if writing the file fails", async () => {
    const mockError = new Error("Write File Error");
    fs.writeFile.mockRejectedValue(mockError);
    await expect(generateOpenAPI()).rejects.toThrow("Write File Error");
    expect(axios.get).toHaveBeenCalled();
    expect(transpile).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.any(String));
  });
});
