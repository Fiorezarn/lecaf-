const request = require("supertest");
const app = require("@/app");
const { User } = require("@/models");
const bcrypt = require("bcrypt");
const { sendEmail } = require("@/utils/sendEmail");
const { generateToken } = require("@/utils/token");

jest.mock("@/models", () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("@/utils/sendEmail", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("@/utils/token", () => ({
  generateToken: jest.fn(),
}));

describe("Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    const mockBody = {
      username: "testuser",
      fullname: "Test User",
      email: "test@example.com",
      phonenumber: "1234567890",
      password: "password123",
    };

    const mockUser = {
      us_id: 1,
      us_username: mockBody.username,
      us_fullname: mockBody.fullname,
      us_email: mockBody.email,
      us_phonenumber: mockBody.phonenumber,
      us_password: bcrypt.hashSync(mockBody.password, 10),
      us_role: "user",
    };

    User.create.mockResolvedValue(mockUser);
    generateToken.mockReturnValue("mockVerificationToken");
    sendEmail.mockResolvedValue(true);

    const response = await request(app).post("/auth/register").send(mockBody);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("code", 201);
    expect(response.body).toHaveProperty("message", "Register success!");
    expect(response.body.data).toMatchObject({
      us_username: mockBody.username,
      us_fullname: mockBody.fullname,
      us_email: mockBody.email,
      us_phonenumber: mockBody.phonenumber,
    });

    expect(User.create).toHaveBeenCalledWith({
      us_username: mockBody.username,
      us_fullname: mockBody.fullname,
      us_email: mockBody.email,
      us_phonenumber: mockBody.phonenumber,
      us_password: expect.any(String),
    });
    expect(generateToken).toHaveBeenCalledWith(
      mockUser.us_id,
      mockUser.us_email,
      mockUser.us_role,
      "VERIFICATION",
      process.env.JWT_EXPIRES_IN
    );
    expect(sendEmail).toHaveBeenCalledWith(
      mockBody.username,
      mockBody.email,
      "Verify Your Email Address",
      "Verification Email",
      "mockVerificationToken",
      `${process.env.BASE_URL}/auth/verify-email`
    );
  });

  it("should return 400 if email already exists", async () => {
    const mockBody = {
      username: "testuser",
      fullname: "Test User",
      email: "test@example.com",
      phonenumber: "1234567890",
      password: "password123",
    };

    User.findOne.mockResolvedValue({ us_email: mockBody.email });
    const response = await request(app).post("/auth/register").send(mockBody);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", "error");
    expect(response.body).toHaveProperty("code", 400);
    expect(response.body).toHaveProperty("message", "Email already exists!");

    expect(User.findOne).toHaveBeenCalledWith({
      where: { us_email: mockBody.email },
    });
    expect(User.create).not.toHaveBeenCalled();
  });

  it("should return 500 if an error occurs", async () => {
    const mockBody = {
      username: "testuser",
      fullname: "Test User",
      email: "test@example.com",
      phonenumber: "1234567890",
      password: "password123",
    };
    User.create.mockRejectedValue(new Error("Database Error"));

    const response = await request(app).post("/auth/register").send(mockBody);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", "error");
    expect(response.body).toHaveProperty("code", 500);
    expect(response.body).toHaveProperty("message", "Database Error");

    expect(User.create).toHaveBeenCalledWith({
      us_username: mockBody.username,
      us_fullname: mockBody.fullname,
      us_email: mockBody.email,
      us_phonenumber: mockBody.phonenumber,
      us_password: expect.any(String),
    });
  });
});
