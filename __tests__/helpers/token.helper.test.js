const request = require("supertest");
const jwt = require("jsonwebtoken");
const { User } = require("@/models");
const app = require("@/app");

jest.mock("jsonwebtoken");
jest.mock("@/models", () => ({
  User: {
    update: jest.fn(),
  },
}));

describe("verifyEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
    process.env.BASE_URL_FRONTEND = "http://frontend.test";
  });

  it("should verify email and redirect to success page when token is valid", async () => {
    const mockToken = "valid_token";
    const mockUserId = 1;

    jwt.verify.mockReturnValue({ us_id: mockUserId });
    User.update.mockResolvedValue([1]);

    const response = await request(app).get(`/verify-email?token=${mockToken}`);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, "test_secret");
    expect(User.update).toHaveBeenCalledWith(
      { us_active: true },
      { where: { us_id: mockUserId } }
    );
    expect(response.status).toBe(302);
    expect(response.header.location).toBe(
      "http://frontend.test/verify-success"
    );
  });

  it("should redirect to failed page when token is invalid", async () => {
    const mockToken = "invalid_token";

    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const response = await request(app).get(`/verify-email?token=${mockToken}`);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, "test_secret");
    expect(User.update).not.toHaveBeenCalled();
    expect(response.status).toBe(302);
    expect(response.header.location).toBe("http://frontend.test/verify-failed");
  });

  it("should redirect to failed page when token is missing", async () => {
    const response = await request(app).get("/verify-email");

    expect(jwt.verify).not.toHaveBeenCalled();
    expect(User.update).not.toHaveBeenCalled();
    expect(response.status).toBe(302);
    expect(response.header.location).toBe("http://frontend.test/verify-failed");
  });
});
