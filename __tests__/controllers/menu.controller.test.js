const request = require("supertest");
const app = require("@/app");
const { Menu } = require("@/models");
const { findMenuById } = require("@/controllers/menu.controller");
const { Op } = require("sequelize");

jest.mock("@/models", () => ({
  Menu: {
    findAndCountAll: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
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
  describe("Find Menu By Id", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should return the menu item when a valid ID is provided", async () => {
      const mockMenu = {
        mn_id: 1,
        mn_name: "Cafe Latte",
        mn_image:
          "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/caffelate_wsytuw.jpg",
        mn_desc:
          "Cafe Latte is a coffee-based drink prepared by diluting coffee with steamed milk, typically in a 3:1 or 4:1 ratio.",
        mn_price: 30000,
        mn_category: "coffee",
        is_deleted: 0,
        createdAt: "2024-11-15T06:39:29.000Z",
        updatedAt: "2024-11-15T06:39:29.000Z",
      };

      Menu.findOne.mockResolvedValue(mockMenu);

      const result = await findMenuById(1);
      expect(Menu.findOne).toHaveBeenCalledWith({
        where: { [Op.and]: [{ mn_id: 1 }, { is_deleted: 0 }] },
      });
      expect(result).toEqual(mockMenu);
    });

    it("should return null when no menu is found for the provided ID", async () => {
      Menu.findOne.mockResolvedValue(null);

      const result = await findMenuById(999);
      expect(Menu.findOne).toHaveBeenCalledWith({
        where: { [Op.and]: [{ mn_id: 999 }, { is_deleted: 0 }] },
      });
      expect(result).toBeNull();
    });

    it("should handle errors gracefully and return undefined", async () => {
      Menu.findOne.mockRejectedValue(new Error("Database error"));

      const result = await findMenuById(1);
      expect(Menu.findOne).toHaveBeenCalledWith({
        where: { [Op.and]: [{ mn_id: 1 }, { is_deleted: 0 }] },
      });
      expect(result).toBeUndefined();
    });
  });
  describe("Get Menu By Id", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mocks before each test
    });

    afterEach(() => {
      jest.restoreAllMocks(); // Restore mocks after each test
    });

    it("should return 200 and get menu by id", async () => {
      const id = 1;
      const mockMenu = {
        mn_id: 1,
        mn_name: "Cafe Latte",
        mn_image:
          "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/caffelate_wsytuw.jpg",
        mn_desc:
          "Cafe Latte is a coffee-based drink prepared by diluting coffee with steamed milk, typically in a 3:1 or 4:1 ratio.",
        mn_price: 30000,
        mn_category: "coffee",
        is_deleted: 0,
        createdAt: "2024-11-15T06:39:29.000Z",
        updatedAt: "2024-11-15T06:39:29.000Z",
      };

      Menu.findOne.mockResolvedValue(mockMenu);

      const response = await request(app).get("/menu/1");

      expect(Menu.findOne).toHaveBeenCalledWith({
        where: { [Op.and]: [{ mn_id: "1" }, { is_deleted: 0 }] },
      });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data", mockMenu);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty(
        "message",
        `Success get menu with id ${id}`
      );
    });

    it("should return 404 if menu is not found", async () => {
      Menu.findOne.mockResolvedValue(null);
      const response = await request(app).get("/menu/999");

      expect(Menu.findOne).toHaveBeenCalledWith({
        where: { [Op.and]: [{ mn_id: "999" }, { is_deleted: 0 }] },
      });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty(
        "message",
        `Menu with id 999 not found!`
      );
      expect(response.body).toHaveProperty(
        "message",
        "Menu with id 999 not found!"
      );
    });

    it("should return 500 when an error occurs", async () => {
      Menu.findOne.mockImplementation(() => {
        throw new Error("Database Error");
      });

      const response = await request(app).get("/menu/109");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });
});
