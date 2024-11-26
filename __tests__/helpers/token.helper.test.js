const request = require("supertest");
const jwt = require("jsonwebtoken");
const { User } = require("@/models");
const app = require("@/app");
const { verifyEmail } = require("@/helpers/token.helper");

jest.mock("jsonwebtoken");
jest.mock("@/models", () => ({
  User: {
    update: jest.fn(),
  },
}));

describe("verifyEmail", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
    process.env.BASE_URL_FRONTEND = "http://frontend.test";

    req = {
      query: {
        token: "valid_token",
      },
    };
    res = {
      redirect: jest.fn(),
    };
  });

  it("should verify email and redirect to success page when token is valid", async () => {
    const mockUserId = 1;

    jwt.verify.mockReturnValue({ us_id: mockUserId });
    User.update.mockResolvedValue([1]);

    await verifyEmail(req, res);

    expect(jwt.verify).toHaveBeenCalledWith("valid_token", "test_secret");
    expect(User.update).toHaveBeenCalledWith(
      { us_active: true },
      { where: { us_id: mockUserId } }
    );
    expect(res.redirect).toHaveBeenCalledWith(
      "http://frontend.test/verify-success"
    );
  });

  it("should redirect to error page when token is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await verifyEmail(req, res);

    expect(jwt.verify).toHaveBeenCalledWith("valid_token", "test_secret");
    expect(User.update).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(
      "http://frontend.test/verify-failed"
    );
  });
});
