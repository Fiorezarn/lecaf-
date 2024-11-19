const request = require("supertest");
const app = require("@/app");
const { Order, User, Menu } = require("@/models");

jest.mock("@/models", () => ({
  Order: {
    count: jest.fn(),
  },
  User: {
    count: jest.fn(),
  },
  Menu: {
    count: jest.fn(),
  },
}));

describe("Count Data Endpoint", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 and counts of order, user, and menu", async () => {
    Order.count.mockResolvedValue(5);
    User.count.mockResolvedValue(10);
    Menu.count.mockResolvedValue(15);

    const response = await request(app).get("/dashboard");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("code", 200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("message", "Success get data");
    expect(response.body).toHaveProperty("data", {
      order: 5,
      user: 10,
      menu: 15,
    });
  });

  it("should return 500 when an error occurs", async () => {
    Order.count.mockImplementation(() => {
      throw new Error("Database Error");
    });

    const response = await request(app).get("/dashboard");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("code", 500);
    expect(response.body).toHaveProperty("status", "error");
    expect(response.body).toHaveProperty("message", "Database Error");
  });
});
