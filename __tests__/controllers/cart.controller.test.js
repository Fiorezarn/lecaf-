const request = require("supertest");
const { User, Cart } = require("@/models");
const app = require("@/app");

jest.mock("@/models", () => ({
  User: {
    findOne: jest.fn(),
  },
  Cart: {
    count: jest.fn(),
  },
}));

describe("Cart Controllers", () => {
  describe("Find Cart By User Id", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return 200 and get cart by user id", async () => {
      const id = 2;
      const mockMenu = {
        us_id: 2,
        Menu: [
          {
            mn_id: 2,
            mn_name: "Cappucino",
            mn_image:
              "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/cappucino_rdewmn.jpg",
            mn_desc:
              "Cappuccino is an espresso-based coffee drink that originated in Italy, and is traditionally styled with steamed milk foam.",
            mn_price: 30000,
            mn_category: "coffee",
            is_deleted: false,
            createdAt: "2024-11-19T09:11:08.000Z",
            updatedAt: "2024-11-19T09:11:08.000Z",
            Cart: {
              cr_id: 1,
              cr_quantity: 1,
            },
          },
        ],
      };

      User.findOne.mockResolvedValue(mockMenu);

      const response = await request(app).get(`/cart/${id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data", mockMenu);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message", `Success get cart`);
    });

    it("should return 200 but data is null", async () => {
      User.findOne.mockResolvedValue(null);
      const response = await request(app).get("/cart/999");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data", null);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message", `Success get cart`);
    });

    it("should return 500 when an error occurs", async () => {
      jest
        .spyOn(User, "findOne")
        .mockRejectedValue(new Error("Database Error"));

      const response = await request(app).get("/cart/99");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });

  describe("Count Cart", () => {
    it("should return 200 and count cart items", async () => {
      const id = 2;

      User.findOne = jest.fn().mockResolvedValue({ us_id: id });

      const mockCart = [
        { cr_id: 1, cr_quantity: 2 },
        { cr_id: 2, cr_quantity: 3 },
      ];
      Cart.findAll = jest.fn().mockResolvedValue(mockCart);

      const response = await request(app).get(`/cart/count/${id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data", 5);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message", "Success get cart");
    });

    it("should return 404 if user is not found", async () => {
      User.findOne.mockResolvedValue(null);
      const response = await request(app).get("/cart/count/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", `User not found!`);
    });

    it("should return 500 when an error occurs", async () => {
      jest
        .spyOn(User, "findOne")
        .mockRejectedValue(new Error("Database Error"));

      const response = await request(app).get("/cart/count/99");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });

  describe("Delete Cart", () => {
    it("should return 200 and delete cart successfully", async () => {
      const mockBody = { userId: 1, menuId: 10 };
      Cart.findOne = jest.fn().mockResolvedValue({
        cr_us_id: mockBody.userId,
        cr_mn_id: mockBody.menuId,
      });

      Cart.destroy = jest.fn().mockResolvedValue(1);
      const response = await request(app).delete("/cart").send(mockBody);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty(
        "message",
        "Cart successfully deleted!"
      );
    });

    it("should return 404 if cart not found", async () => {
      const mockBody = { userId: 1, menuId: 10 };

      Cart.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete("/cart").send(mockBody);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Cart not found!");
    });

    it("should return 500 when an error occurs", async () => {
      const mockBody = { userId: 1, menuId: 10 };

      Cart.findOne = jest.fn().mockRejectedValue(new Error("Database Error"));

      const response = await request(app).delete("/cart").send(mockBody);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });

  describe("Add to Cart", () => {
    it("should return 201 and add a new item to the cart", async () => {
      const mockBody = { userId: 1, menuId: 10, quantity: 2 };

      // Mock User.findOne to return a valid user
      User.findOne = jest.fn().mockResolvedValue({ us_id: mockBody.userId });

      // Mock Cart.findOne to return null (indicating no existing cart)
      Cart.findOne = jest.fn().mockResolvedValue(null);

      // Mock Cart.create to simulate adding a new item to the cart
      Cart.create = jest.fn().mockResolvedValue({
        cr_us_id: mockBody.userId,
        cr_mn_id: mockBody.menuId,
        cr_quantity: mockBody.quantity,
      });

      const response = await request(app).post("/cart").send(mockBody);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("code", 201);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty(
        "message",
        "Successfully added to cart"
      );
      expect(response.body.data).toEqual(
        expect.objectContaining({
          cr_us_id: mockBody.userId,
          cr_mn_id: mockBody.menuId,
          cr_quantity: mockBody.quantity,
        })
      );
    });

    it("should return 201 and update the quantity of an existing cart item", async () => {
      const mockBody = { userId: 1, menuId: 10, quantity: 2 };
      User.findOne = jest.fn().mockResolvedValue({ us_id: mockBody.userId });
      Cart.findOne = jest.fn().mockResolvedValue({
        cr_id: 1,
        cr_quantity: 3,
      });
      Cart.update = jest.fn().mockResolvedValue([1]);
      const response = await request(app).post("/cart").send(mockBody);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("code", 201);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty(
        "message",
        "Successfully added to cart"
      );
      expect(response.body.data).toBeDefined();
    });

    it("should return 404 if user is not found", async () => {
      const mockBody = { userId: 999, menuId: 10, quantity: 2 };

      User.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app).post("/cart").send(mockBody);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "User not found!");
    });

    it("should return 500 when an error occurs", async () => {
      const mockBody = { userId: 1, menuId: 10, quantity: 2 };
      User.findOne = jest.fn().mockRejectedValue(new Error("Database Error"));
      const response = await request(app).post("/cart").send(mockBody);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });

  describe("Update Cart Quantity", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should return 200 and update the quantity successfully", async () => {
      id = 5;
      const mockBody = { quantity: 10 };

      Cart.findOne = jest.fn().mockResolvedValue({
        cr_id: id,
        cr_quantity: 3,
      });
      Cart.update = jest.fn().mockResolvedValue([1]);
      const response = await request(app).patch(`/cart/${id}`).send(mockBody);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty(
        "message",
        "Cart successfully updated!"
      );
    });

    it("should return 404 if cart not found", async () => {
      const id = 5;
      const mockBody = { quantity: 5 };
      Cart.findOne = jest.fn().mockResolvedValue(null);
      const response = await request(app).patch(`/cart/${id}`).send(mockBody);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Cart not found!");
    });

    it("should return 500 when an error occurs", async () => {
      const id = 5;
      const mockBody = { quantity: 5 };

      Cart.findOne = jest.fn().mockRejectedValue(new Error("Database Error"));

      const response = await request(app).patch(`/cart/${id}`).send(mockBody);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });
});
