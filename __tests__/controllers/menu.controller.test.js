const request = require("supertest");
const app = require("@/app");
const { Menu } = require("@/models");

jest.mock("@/models", () => ({
  Menu: {
    findAndCountAll: jest.fn(),
  },
}));

describe("Menu Controllers", () => {
  describe("Get All Menu", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("it should return 200 and get all menu", async () => {
      Menu.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [
          {
            mn_id: 1,
            mn_name: "Cafe Latte",
            mn_image:
              "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/caffelate_wsytuw.jpg",
            mn_desc:
              "Cafe Latte is a coffee-based drink prepared by diluting coffee with steamed milk, typically in a 3:1 or 4:1 ratio.",
            mn_price: 30000,
            mn_category: "coffee",
            is_deleted: false,
            createdAt: "2024-11-15T06:39:29.000Z",
            updatedAt: "2024-11-15T06:39:29.000Z",
          },
        ],
      });
      const response = await request(app).get("/menu");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "Success");
      expect(response.body).toHaveProperty("totalItems", 1);
      expect(response.body).toHaveProperty("totalPages", 1);
      expect(response.body).toHaveProperty("currentPage", 1);
      expect(response.body).toHaveProperty("data", [
        {
          mn_id: 1,
          mn_name: "Cafe Latte",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/caffelate_wsytuw.jpg",
          mn_desc:
            "Cafe Latte is a coffee-based drink prepared by diluting coffee with steamed milk, typically in a 3:1 or 4:1 ratio.",
          mn_price: 30000,
          mn_category: "coffee",
          is_deleted: false,
          createdAt: "2024-11-15T06:39:29.000Z",
          updatedAt: "2024-11-15T06:39:29.000Z",
        },
      ]);
    });
    it("it should return 200 and get all menu with search query param", async () => {
      Menu.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [
          {
            mn_id: 1,
            mn_name: "Cafe Latte",
            mn_image:
              "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/caffelate_wsytuw.jpg",
            mn_desc:
              "Cafe Latte is a coffee-based drink prepared by diluting coffee with steamed milk, typically in a 3:1 or 4:1 ratio.",
            mn_price: 30000,
            mn_category: "coffee",
            is_deleted: false,
            createdAt: "2024-11-15T06:39:29.000Z",
            updatedAt: "2024-11-15T06:39:29.000Z",
          },
        ],
      });
      const response = await request(app).get("/menu?search=Cafe Latte");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "Success");
      expect(response.body).toHaveProperty("totalItems", 1);
      expect(response.body).toHaveProperty("totalPages", 1);
      expect(response.body).toHaveProperty("currentPage", 1);
      expect(response.body).toHaveProperty("data", [
        {
          mn_id: 1,
          mn_name: "Cafe Latte",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/caffelate_wsytuw.jpg",
          mn_desc:
            "Cafe Latte is a coffee-based drink prepared by diluting coffee with steamed milk, typically in a 3:1 or 4:1 ratio.",
          mn_price: 30000,
          mn_category: "coffee",
          is_deleted: false,
          createdAt: "2024-11-15T06:39:29.000Z",
          updatedAt: "2024-11-15T06:39:29.000Z",
        },
      ]);
    });
    it("it should return 200 and get all menu with category query param", async () => {
      Menu.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [
          {
            mn_id: 1,
            mn_name: "Cafe Latte",
            mn_image:
              "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/caffelate_wsytuw.jpg",
            mn_desc:
              "Cafe Latte is a coffee-based drink prepared by diluting coffee with steamed milk, typically in a 3:1 or 4:1 ratio.",
            mn_price: 30000,
            mn_category: "coffee",
            is_deleted: false,
            createdAt: "2024-11-15T06:39:29.000Z",
            updatedAt: "2024-11-15T06:39:29.000Z",
          },
        ],
      });
      const response = await request(app).get("/menu?category=coffee");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "Success");
      expect(response.body).toHaveProperty("totalItems", 1);
      expect(response.body).toHaveProperty("totalPages", 1);
      expect(response.body).toHaveProperty("currentPage", 1);
      expect(response.body).toHaveProperty("data", [
        {
          mn_id: 1,
          mn_name: "Cafe Latte",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/caffelate_wsytuw.jpg",
          mn_desc:
            "Cafe Latte is a coffee-based drink prepared by diluting coffee with steamed milk, typically in a 3:1 or 4:1 ratio.",
          mn_price: 30000,
          mn_category: "coffee",
          is_deleted: false,
          createdAt: "2024-11-15T06:39:29.000Z",
          updatedAt: "2024-11-15T06:39:29.000Z",
        },
      ]);
    });
    it("it should return 500 when error occurs", async () => {
      Menu.findAndCountAll.mockImplementation(() => {
        throw new Error("Failed To Find All Menu");
      });
      const response = await request(app).get("/menu");
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });
});
