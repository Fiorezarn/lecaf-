const request = require("supertest");
const app = require("@/app");
const { Menu } = require("@/models");
const { Op } = require("sequelize");
const { uploadImage } = require("@/services/cloudinary.service");

jest.mock("@/models", () => ({
  Menu: {
    findAndCountAll: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock("@/services/cloudinary.service", () => ({
  uploadImage: jest.fn(),
}));

describe("Menu Controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe("Create Menu", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return 201 and create new menu", async () => {
      const mockMenu = {
        name: "Cafe Latte",
        price: 30000,
        description: "Cafe Latte is a coffee-based drink...",
        category: "coffee",
      };

      const mockImageUpload = {
        secure_url: "https://example.com/image.jpg",
      };

      uploadImage.mockResolvedValue(mockImageUpload);

      Menu.create.mockResolvedValue({
        id: 1,
        mn_name: mockMenu.name,
        mn_price: mockMenu.price,
        mn_desc: mockMenu.description,
        mn_category: mockMenu.category,
        mn_image: mockImageUpload.secure_url,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post("/menu")
        .field("name", mockMenu.name)
        .field("price", mockMenu.price)
        .field("description", mockMenu.description)
        .field("category", mockMenu.category)
        .attach("image", Buffer.from("mock image"), {
          filename: "image.jpg",
          contentType: "image/jpeg",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("code", 201);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message", "Success create menu");
      expect(Menu.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mn_name: mockMenu.name,
          mn_price: mockMenu.price,
          mn_desc: mockMenu.description,
          mn_category: mockMenu.category,
          mn_image: mockImageUpload.secure_url,
        })
      );
    });
    it("should return 400 if menu already exists", async () => {
      const mockMenu = {
        name: "Cafe Latte",
        price: 30000,
        description: "Cafe Latte is a coffee-based drink...",
        category: "coffee",
      };

      Menu.findOne.mockResolvedValue({
        mn_name: "Cafe Latte",
        mn_price: 30000,
      });

      const mockImageUpload = {
        secure_url: "https://example.com/image.jpg",
      };

      uploadImage.mockResolvedValue(mockImageUpload);

      Menu.create.mockResolvedValue({
        id: 1,
        mn_name: mockMenu.name,
        mn_price: mockMenu.price,
        mn_desc: mockMenu.description,
        mn_category: mockMenu.category,
        mn_image: mockImageUpload.secure_url,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post("/menu")
        .field("name", mockMenu.name)
        .field("price", mockMenu.price)
        .field("description", mockMenu.description)
        .field("category", mockMenu.category)
        .attach("image", Buffer.from("mock image"), {
          filename: "image.jpg",
          contentType: "image/jpeg",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty(
        "message",
        "Menu with Cafe Latte already exists"
      );
    });
    it("should return 500 but incorrect file type", async () => {
      const mockMenu = {
        name: "Cafe Latte",
        price: 30000,
        description: "Cafe Latte is a coffee-based drink...",
        category: "coffee",
      };

      const mockImageUpload = {
        secure_url: "https://example.com/image.webp",
      };

      uploadImage.mockResolvedValue(mockImageUpload);

      Menu.create.mockResolvedValue({
        id: 1,
        mn_name: mockMenu.name,
        mn_price: mockMenu.price,
        mn_desc: mockMenu.description,
        mn_category: mockMenu.category,
        mn_image: mockImageUpload.secure_url,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post("/menu")
        .field("name", mockMenu.name)
        .field("price", mockMenu.price)
        .field("description", mockMenu.description)
        .field("category", mockMenu.category)
        .attach("image", Buffer.from("mock image"), {
          filename: "image.webp",
          contentType: "application/octet-stream",
        });

      expect(response.status).toBe(500);
    });
    it("should return 500 if menu body validation fails", async () => {
      const mockMenu = {
        price: 30000,
        description: "Cafe Latte is a coffee-based drink...",
        category: "coffee",
      };

      const response = await request(app)
        .post("/menu")
        .field("price", mockMenu.price)
        .field("description", mockMenu.description)
        .field("category", mockMenu.category)
        .attach("image", Buffer.from("mock image"), {
          filename: "image.jpg",
          contentType: "image/jpeg",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body.message).toBe('"name" is required');
    });

    it("should return 400 if image is not provided", async () => {
      const mockMenu = {
        name: "Cafe Cino",
        price: 30000,
        description: "Cafe Latte is a coffee-based drink...",
        category: "coffee",
      };

      Menu.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/menu")
        .field("name", mockMenu.name)
        .field("price", mockMenu.price)
        .field("description", mockMenu.description)
        .field("category", mockMenu.category);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "image is required");
    });
    it("should return 500 when an error occurs checkDuplicate validation", async () => {
      const mockMenu = {
        name: "Cafe Cincau",
        price: 30000,
        description: "Cafe Latte is a coffee-based drink...",
        category: "coffee",
      };

      Menu.findOne.mockImplementation(() => {
        throw new Error("Database Error");
      });

      const mockImageUpload = {
        secure_url: "https://example.com/image.jpg",
      };

      uploadImage.mockResolvedValue(mockImageUpload);
      Menu.create.mockRejectedValue(new Error("Database Error"));

      const response = await request(app)
        .post("/menu")
        .field("name", mockMenu.name)
        .field("price", mockMenu.price)
        .field("description", mockMenu.description)
        .field("category", mockMenu.category)
        .attach("image", Buffer.from("mock image"), {
          filename: "image.jpg",
          contentType: "image/jpeg",
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
    it("should return 500 when an error occurs", async () => {
      const mockMenu = {
        name: "Cafe Cincau",
        price: 30000,
        description: "Cafe Latte is a coffee-based drink...",
        category: "coffee",
      };

      Menu.findOne.mockResolvedValue(null);

      const mockImageUpload = {
        secure_url: "https://example.com/image.jpg",
      };

      uploadImage.mockResolvedValue(mockImageUpload);
      Menu.create.mockRejectedValue(new Error("Database Error"));

      const response = await request(app)
        .post("/menu")
        .field("name", mockMenu.name)
        .field("price", mockMenu.price)
        .field("description", mockMenu.description)
        .field("category", mockMenu.category)
        .attach("image", Buffer.from("mock image"), {
          filename: "image.jpg",
          contentType: "image/jpeg",
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });
  describe("Update Menu", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return 200 and update the menu without changing the image", async () => {
      const mockMenu = {
        mn_id: 1,
        mn_name: "Cafe Latte",
        mn_price: 30000,
        mn_desc: "Cafe Latte is a coffee-based drink...",
        mn_category: "coffee",
        mn_image: "https://example.com/old-image.jpg",
        is_deleted: 0,
      };

      const updatedData = {
        name: "Updated Cafe Latte",
        price: 35000,
        description: "Updated description",
        category: "hot drinks",
      };

      Menu.findOne.mockResolvedValue(mockMenu);
      Menu.update.mockResolvedValue([1]);

      const response = await request(app).put("/menu/1").send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message", "Success update menu");
    });

    it("should return 200 and update the menu including the image", async () => {
      const mockMenu = {
        mn_id: 1,
        mn_name: "Cafe Latte",
        mn_price: 30000,
        mn_desc: "Cafe Latte is a coffee-based drink...",
        mn_category: "coffee",
        mn_image: "https://example.com/old-image.jpg",
        is_deleted: 0,
      };

      const updatedData = {
        name: "Updated Cafe Latte",
        price: 35000,
        description: "Updated description",
        category: "hot drinks",
      };

      const mockImageUpload = {
        secure_url: "https://example.com/new-image.jpg",
      };

      Menu.findOne.mockResolvedValue(mockMenu);
      Menu.update.mockResolvedValue([1]);
      uploadImage.mockResolvedValue(mockImageUpload);

      const response = await request(app)
        .put("/menu/1")
        .field("name", updatedData.name)
        .field("price", updatedData.price)
        .field("description", updatedData.description)
        .field("category", updatedData.category)
        .attach("image", Buffer.from("mock image"), {
          filename: "new-image.jpg",
          contentType: "image/jpeg",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message", "Success update menu");
      expect(Menu.update).toHaveBeenCalledWith(
        expect.objectContaining({
          mn_name: updatedData.name,
          mn_price: updatedData.price,
          mn_desc: updatedData.description,
          mn_category: updatedData.category,
          mn_image: mockImageUpload.secure_url,
        }),
        { where: { mn_id: "1" } }
      );
    });

    it("should return 404 if the menu is not found", async () => {
      const updatedData = {
        name: "Updated Cafe Latte",
        price: 35000,
        description: "Updated description",
        category: "hot drinks",
      };

      Menu.findOne.mockResolvedValue(null);

      const response = await request(app).put("/menu/999").send(updatedData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty(
        "message",
        "Menu with id 999 not found!"
      );
      expect(Menu.update).not.toHaveBeenCalled();
    });

    it("should return 500 when an error occurs", async () => {
      const mockMenu = {
        mn_id: 1,
        mn_name: "Cafe Latte",
        mn_price: 30000,
        mn_desc: "Cafe Latte is a coffee-based drink...",
        mn_category: "coffee",
        mn_image: "https://example.com/old-image.jpg",
        is_deleted: 0,
      };

      Menu.findOne.mockResolvedValue(mockMenu);
      Menu.update.mockRejectedValue(new Error("Database Error"));

      const response = await request(app).put("/menu/1").send({
        name: "Updated Cafe Latte",
        price: 35000,
        description: "Updated description",
        category: "hot drinks",
      });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });
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
    it("it should return 200 with pagination", async () => {
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
      const response = await request(app).get("/menu?page=1&limit=5");
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
  describe("Get Menu By Id", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
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
    });

    it("should return 500 when an error occurs", async () => {
      jest
        .spyOn(Menu, "findOne")
        .mockRejectedValue(new Error("Database Error"));

      const response = await request(app).get("/menu/1");

      expect(Menu.findOne).toHaveBeenCalledWith({
        where: { [Op.and]: [{ mn_id: "1" }, { is_deleted: 0 }] },
      });
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });
  describe("Delete Menu", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should delete a menu and return a success response", async () => {
      const mockMenu = {
        mn_id: 1,
        name: "Cafe Latte",
        price: 30000,
        description: "A delicious coffee drink",
        is_deleted: 0,
      };

      Menu.findOne = jest.fn().mockResolvedValue(mockMenu);
      Menu.update = jest.fn().mockResolvedValue([1]);

      const response = await request(app).patch("/menu/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message", "Success delete menu");
    });

    it("should return 404 if the menu is not found", async () => {
      Menu.findOne = jest.fn().mockResolvedValue(null);
      const response = await request(app).patch("/menu/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty(
        "message",
        "Menu with id 999 not found!"
      );
    });

    it("should return 500 on server error", async () => {
      Menu.findOne = jest.fn().mockRejectedValue(new Error("Database error"));

      const response = await request(app).patch("/menu/1");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database error");
      expect(Menu.update).not.toHaveBeenCalled();
    });
  });
});
