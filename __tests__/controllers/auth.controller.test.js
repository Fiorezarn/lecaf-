const request = require("supertest");
const app = require("@/app");
const { User } = require("@/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("@/utils/firebase");

jest.mock("@/models", () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hashSync: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock("@/utils/firebase", () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn(),
  }),
}));

const generateToken = jest.fn();

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Register User", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should register a new user successfully", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        dataValues: {
          us_id: 1,
          us_username: "testuser",
          us_fullname: "Test User",
          us_email: "test@example.com",
          us_phonenumber: "085282810339",
          us_role: "USER",
          us_active: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const mockBody = {
        username: "testuser",
        fullname: "Test User",
        email: "test@example.com",
        phonenumber: "085282810339",
        password: "Password123!",
      };
      const response = await request(app).post("/auth/register").send(mockBody);

      generateToken.mockReturnValue("mockVerificationToken");
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("code", 201);
      expect(response.body).toHaveProperty("message", "Register success!");
    });

    it("should return 400", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        dataValues: {
          us_id: 1,
          us_username: "testuser",
          us_fullname: "Test User",
          us_email: "test@example.com",
          us_phonenumber: "085282810339",
          us_role: "USER",
          us_active: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const mockBody = {
        username: "testuser",
        fullname: "Test User",
        email: "test@example.com",
        phonenumber: "085282810339",
      };
      const response = await request(app).post("/auth/register").send(mockBody);

      generateToken.mockReturnValue("mockVerificationToken");
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty(
        "message",
        "Password is a required field."
      );
    });

    it("Should return 400 if username already exist", async () => {
      User.findOne.mockResolvedValue({
        us_id: 1,
        us_username: "testuser",
      });

      User.create.mockResolvedValue({
        dataValues: {
          us_id: 1,
          us_username: "testuser",
          us_fullname: "Test User",
          us_email: "test@example.com",
          us_phonenumber: "085282810339",
          us_role: "USER",
          us_active: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const mockBody = {
        username: "testuser",
        fullname: "Test User",
        email: "test@example.com",
        phonenumber: "085282810339",
        password: "Password123!",
      };
      const response = await request(app).post("/auth/register").send(mockBody);

      generateToken.mockReturnValue("mockVerificationToken");
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty(
        "message",
        "User with testuser already exists"
      );
    });

    it("Should return 400 if email already exist", async () => {
      User.findOne.mockResolvedValueOnce(null);
      User.findOne.mockResolvedValue({
        us_id: 1,
      });
      User.create.mockResolvedValue({
        dataValues: {
          us_id: 1,
          us_username: "testuser",
          us_fullname: "Test User",
          us_email: "test@example.com",
          us_phonenumber: "085282810339",
          us_role: "USER",
          us_active: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const mockBody = {
        username: "testuser",
        fullname: "Test User",
        email: "test@example.com",
        phonenumber: "085282810339",
        password: "Password123!",
      };
      const response = await request(app).post("/auth/register").send(mockBody);

      generateToken.mockReturnValue("mockVerificationToken");
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty(
        "message",
        "Email test@example.com is already taken"
      );
    });

    it("should return 500 if an error occurs in validations", async () => {
      User.findOne.mockImplementation(() => {
        throw new Error("Database Error");
      });
      const mockBody = {
        username: "dianti",
        fullname: "Test User",
        email: "test123@example.com",
        phonenumber: "085282810339",
        password: "Password123!",
      };

      const response = await request(app).post("/auth/register").send(mockBody);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("message", "Database Error");
    });

    it("should return 500 if an error occurs in controllers", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockImplementation(() => {
        throw new Error("Error Create User");
      });
      const mockBody = {
        username: "dianti",
        fullname: "Test User",
        email: "test123@example.com",
        phonenumber: "085282810339",
        password: "Password123!",
      };

      const response = await request(app).post("/auth/register").send(mockBody);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("message", "Error Create User");
    });
  });

  describe("Login User", () => {
    it("should login successfully", async () => {
      User.findOne.mockResolvedValue({
        us_active: 1,
        dataValues: {
          us_id: 1,
          us_username: "testuser",
          us_fullname: "Test User",
          us_email: "test@example.com",
          us_phonenumber: "085282810339",
          us_role: "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
          token: "helloword",
        },
      });

      bcrypt.compare.mockResolvedValue(true);

      const mockBody = {
        username: "testuser",
        password: "Password123!",
      };

      const response = await request(app).post("/auth/login").send(mockBody);
      generateToken.mockReturnValue("mockVerificationToken");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("message", "Login success!");
    });
    it("should set cookies expired 30 days", async () => {
      User.findOne.mockResolvedValue({
        us_active: 1,
        dataValues: {
          us_id: 1,
          us_username: "testuser",
          us_fullname: "Test User",
          us_email: "test@example.com",
          us_phonenumber: "085282810339",
          us_role: "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
          token: "helloword",
        },
      });

      bcrypt.compare.mockResolvedValue(true);

      const mockBody = {
        username: "testuser",
        password: "Password123!",
        rememberme: true,
      };

      const response = await request(app).post("/auth/login").send(mockBody);
      generateToken.mockReturnValue("mockVerificationToken");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("message", "Login success!");
    });
    it("should return 404 user not found", async () => {
      User.findOne.mockResolvedValue(null);

      bcrypt.compare.mockResolvedValue(false);

      const mockBody = {
        username: "testuserssss",
        password: "Password123!",
      };

      const response = await request(app).post("/auth/login").send(mockBody);
      generateToken.mockReturnValue("mockVerificationToken");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty(
        "message",
        "User not found, please register first"
      );
    });
    it("should return 401 user not verify", async () => {
      User.findOne.mockResolvedValue({
        us_active: 0,
        dataValues: {
          us_id: 1,
          us_username: "testuser",
          us_fullname: "Test User",
          us_email: "test@example.com",
          us_phonenumber: "085282810339",
          us_role: "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
          token: "helloword",
        },
      });

      bcrypt.compare.mockResolvedValue(true);

      const mockBody = {
        username: "testuser",
        password: "Password123!",
      };

      const response = await request(app).post("/auth/login").send(mockBody);

      generateToken.mockReturnValue("mockVerificationToken");
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 401);
      expect(response.body).toHaveProperty(
        "message",
        "Please Verify Your Email!"
      );
    });
    it("should return 401 invalid password", async () => {
      User.findOne.mockResolvedValue({
        us_active: 1,
        dataValues: {
          us_id: 1,
          us_username: "testuser",
          us_fullname: "Test User",
          us_email: "test@example.com",
          us_phonenumber: "085282810339",
          us_role: "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
          token: "helloword",
        },
      });

      bcrypt.compare.mockResolvedValue(false);

      const mockBody = {
        username: "testuser",
        password: "Password124!",
      };

      const response = await request(app).post("/auth/login").send(mockBody);
      generateToken.mockReturnValue("mockVerificationToken");
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 401);
      expect(response.body).toHaveProperty("message", "Invalid Password");
    });
    it("should return 500 if an error occurs in validations", async () => {
      User.findOne.mockRejectedValue(new Error("Database Error"));

      const mockBody = {
        username: "testuser",
        password: "Password124!",
      };

      const response = await request(app).post("/auth/login").send(mockBody);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("message", "Database Error");
    });
    it("should return 500 if an error occurs undefined message", async () => {
      User.findOne.mockRejectedValue(new Error());

      const mockBody = {
        username: "testuser",
        password: "Password124!",
      };

      const response = await request(app).post("/auth/login").send(mockBody);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("message", "Internal Server Error");
    });
  });

  describe("Login with google", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully login a returning user", async () => {
      admin.auth().verifyIdToken.mockResolvedValue({
        email: "test@example.com",
        name: "Test User",
      });

      User.findAll.mockResolvedValue([
        {
          us_id: 1,
          us_email: "test@example.com",
          us_fullname: "Test User",
          us_username: "testuser",
          us_role: "GUEST",
          dataValues: {
            us_id: 1,
            us_email: "test@example.com",
            us_fullname: "Test User",
            us_username: "testuser",
            us_role: "GUEST",
            token: "mocked-token",
          },
        },
      ]);

      jwt.sign.mockReturnValue("mocked-token");

      const response = await request(app)
        .post("/auth/google")
        .send({ idToken: "mocked-google-token" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Login success!");
      expect(response.body.data.dataValues.token).toBe("mocked-token");
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should create a new user if not exists", async () => {
      admin.auth().verifyIdToken.mockResolvedValue({
        email: "newuser@example.com",
        name: "New User",
      });

      User.findAll.mockResolvedValue([
        {
          us_id: 2,
          us_email: "newuse@example.com",
          us_fullname: "New User",
          us_username: "newuser",
        },
      ]);

      User.create.mockResolvedValue({
        us_id: 2,
        us_email: "newuser@example.com",
        us_fullname: "New User",
        us_username: "newuser",
        us_role: "GUEST",
        dataValues: {
          us_id: 2,
          us_email: "newuser@example.com",
          us_fullname: "New User",
          us_username: "newuser",
          us_role: "GUEST",
          token: "mocked-token-new-user",
        },
      });

      bcrypt.hashSync.mockReturnValue("hashed-password");

      jwt.sign.mockReturnValue("mocked-token-new-user");

      const response = await request(app)
        .post("/auth/google")
        .send({ idToken: "mocked-google-token-new-user" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Login success!");
      expect(response.body.data.dataValues.token).toBe("mocked-token-new-user");
      expect(User.create).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      admin.auth().verifyIdToken.mockRejectedValue(new Error("Invalid token"));

      const response = await request(app)
        .post("/auth/google")
        .send({ idToken: "invalid-token" });

      expect(response.status).toBe(500);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Invalid token");
    });
  });

  describe("Send Email Forgot Password", () => {
    it("Should return 200 Link have been send to your email!", async () => {
      User.findOne.mockResolvedValue({
        us_email: "reza@gmail.com",
      });

      const mockBody = {
        email: "reza@gmail.com",
      };
      const response = await request(app)
        .post("/auth/send-forgot-password")
        .send(mockBody);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty(
        "message",
        "Link have been send to your email!"
      );
    });
    it("Should return 404 User not found", async () => {
      User.findOne.mockResolvedValue(null);

      const mockBody = {
        email: "reza@gmail.com",
      };
      const response = await request(app)
        .post("/auth/send-forgot-password")
        .send(mockBody);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty(
        "message",
        "User with email reza@gmail.com not found"
      );
    });
    it("Should return 500 if an error occurs", async () => {
      User.findOne.mockRejectedValue(new Error("Database Error"));
      const mockBody = {
        email: "reza@gmail.com",
      };
      const response = await request(app)
        .post("/auth/send-forgot-password")
        .send(mockBody);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });

  describe("Send Email Verification Manual", () => {
    it("Should return 200 Link have been send to your email!", async () => {
      User.findOne.mockResolvedValue({
        us_email: "reza@gmail.com",
      });

      const mockBody = {
        email: "reza@gmail.com",
      };
      const response = await request(app)
        .post("/auth/send-email")
        .send(mockBody);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty(
        "message",
        "Link have been send to your email!"
      );
    });
    it("Should return 404 User not found", async () => {
      User.findOne.mockResolvedValue(null);

      const mockBody = {
        email: "reza@gmail.com",
      };
      const response = await request(app)
        .post("/auth/send-email")
        .send(mockBody);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty(
        "message",
        "User with email reza@gmail.com not found"
      );
    });
    it("Should return 500 if an error occurs", async () => {
      User.findOne.mockRejectedValue(new Error("Database Error"));
      const mockBody = {
        email: "reza@gmail.com",
      };
      const response = await request(app)
        .post("/auth/send-email")
        .send(mockBody);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });

  describe("Forgot Password", () => {
    it("should return 200 password changed", async () => {
      jwt.verify.mockReturnValue({ us_id: 1 });
      bcrypt.hashSync.mockResolvedValue("Password123!");
      const requestBody = { password: "Password123!" };

      User.update.mockResolvedValue(true);
      const query = { token: "valid_token" };

      const response = await request(app)
        .put(`/auth/forgot-password`)
        .query(query)
        .send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("message", "Password changed!");
    });

    it("should return 500 if an error occurs", async () => {
      jwt.verify.mockReturnValue({ us_id: 1 });
      bcrypt.hashSync.mockResolvedValue("Password123!");
      const requestBody = { password: "Password123!" };

      User.update.mockRejectedValue(new Error("Database Error"));
      const query = { token: "valid_token" };

      const response = await request(app)
        .put(`/auth/forgot-password`)
        .query(query)
        .send(requestBody);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });

  describe("Logout User", () => {
    it("should clear the cookie and return logout success", async () => {
      const response = await request(app).get("/auth/logout");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("message", "Logout success!");

      const cookies = response.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain("user_leecafe=;");
    });

    it("should return 500 if an error occurs", async () => {
      const mockClearCookie = jest
        .spyOn(require("express").response, "clearCookie")
        .mockImplementation(() => {
          throw new Error("Cookie clearing failed");
        });
      const response = await request(app).get("/auth/logout");
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("message", "Cookie clearing failed");
      mockClearCookie.mockRestore();
    });
  });
});
