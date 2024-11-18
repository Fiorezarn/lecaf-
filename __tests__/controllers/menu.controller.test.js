const request = require("supertest");
const app = require("@/app");
const { Menu } = require("@/models");

jest.mock("@/models", () => ({
  Menu: {
    findAndCountAll: jest.fn(),
    findAll: jest.fn(),
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
  describe("Get Menu Recommended", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return 200 and the recommended menus", async () => {
      Menu.findAll.mockResolvedValue([
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
          createdAt: "2024-11-18T12:32:10.000Z",
          updatedAt: "2024-11-18T12:32:10.000Z",
        },
        {
          mn_id: 7,
          mn_name: "Cheese Quiche",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641170/Cheese_Quiche_yjmtzo.jpg",
          mn_desc:
            "A cheese quiche is a baked dish made with cheese, butter, eggs, and sometimes other ingredients.",
          mn_price: 30000,
          mn_category: "food",
          is_deleted: false,
          createdAt: "2024-11-18T12:32:10.000Z",
          updatedAt: "2024-11-18T12:32:10.000Z",
        },
        {
          mn_id: 14,
          mn_name: "Cinnamon Roll",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641168/Cinnamon_Roll_ej0s9k.jpg",
          mn_desc:
            "A sweet pastry made with cinnamon, sugar, and topped with a creamy glaze.",
          mn_price: 22000,
          mn_category: "food",
          is_deleted: false,
          createdAt: "2024-11-18T12:32:10.000Z",
          updatedAt: "2024-11-18T12:32:10.000Z",
        },
        {
          mn_id: 19,
          mn_name: "Tuna Puff",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641168/Tuna_Puff_qfnycj.jpg",
          mn_desc:
            "A crispy puff pastry filled with savory tuna filling, perfect as a snack.",
          mn_price: 25000,
          mn_category: "food",
          is_deleted: false,
          createdAt: "2024-11-18T12:32:10.000Z",
          updatedAt: "2024-11-18T12:32:10.000Z",
        },
      ]);

      const response = await request(app).get("/menu/recommended");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty(
        "message",
        "Success get menu recommended"
      );
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toEqual([
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
          createdAt: "2024-11-18T12:32:10.000Z",
          updatedAt: "2024-11-18T12:32:10.000Z",
        },
        {
          mn_id: 7,
          mn_name: "Cheese Quiche",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641170/Cheese_Quiche_yjmtzo.jpg",
          mn_desc:
            "A cheese quiche is a baked dish made with cheese, butter, eggs, and sometimes other ingredients.",
          mn_price: 30000,
          mn_category: "food",
          is_deleted: false,
          createdAt: "2024-11-18T12:32:10.000Z",
          updatedAt: "2024-11-18T12:32:10.000Z",
        },
        {
          mn_id: 14,
          mn_name: "Cinnamon Roll",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641168/Cinnamon_Roll_ej0s9k.jpg",
          mn_desc:
            "A sweet pastry made with cinnamon, sugar, and topped with a creamy glaze.",
          mn_price: 22000,
          mn_category: "food",
          is_deleted: false,
          createdAt: "2024-11-18T12:32:10.000Z",
          updatedAt: "2024-11-18T12:32:10.000Z",
        },
        {
          mn_id: 19,
          mn_name: "Tuna Puff",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641168/Tuna_Puff_qfnycj.jpg",
          mn_desc:
            "A crispy puff pastry filled with savory tuna filling, perfect as a snack.",
          mn_price: 25000,
          mn_category: "food",
          is_deleted: false,
          createdAt: "2024-11-18T12:32:10.000Z",
          updatedAt: "2024-11-18T12:32:10.000Z",
        },
      ]);
    });

    it("should return 500 when an error occurs", async () => {
      // Mock an error
      Menu.findAll.mockImplementation(() => {
        throw new Error("Database Error");
      });

      const response = await request(app).get("/menu/recommended");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });
});
