const request = require("supertest");
const app = require("@/app");
const { Order, User, OrderDetail, Cart } = require("@/models");
const generateLatLongFromAddress = require("@/helpers/maps.helper");

jest.mock("@/models", () => ({
  Order: {
    findAll: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  User: {
    findOne: jest.fn(),
  },
  OrderDetail: {
    create: jest.fn(),
  },
  Cart: {
    destroy: jest.fn(),
  },
}));

// jest.mock("@/helpers/maps.helper", () => ({
//   generateLatLongFromAddress: jest.fn(),
// }));

describe("Order Controllers", () => {
  describe("Get All Orders", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return 200 and get all orders with the ongoing status", async () => {
      const mockOrder = [
        {
          or_id: 1,
          or_us_id: 2,
          or_site: "2",
          or_longitude: null,
          or_latitude: null,
          or_type_order: "Dine-in",
          or_total_price: 470000,
          or_status_payment: "settlement",
          or_status_shipping: "delivered",
          or_platform_id: "LeCafe-1732068343557",
          or_payment_info: {
            currency: "IDR",
            order_id: "LeCafe-1732068343557",
            va_numbers: [
              {
                bank: "bca",
                va_number: "99416228906431453172619",
              },
            ],
            expiry_time: "2024-11-21 09:05:45",
            merchant_id: "G031499416",
            status_code: "200",
            fraud_status: "accept",
            gross_amount: "470000.00",
            payment_type: "bank_transfer",
            signature_key:
              "2c1053b7ca318341ff26f63e5c89090ded533e8f205f80c7c08020b80fc98fa8fae0b4475757c9944c36f24cc6561209c96026e441f0519217df6311e1fc15c3",
            status_message: "Success, transaction is found",
            transaction_id: "ea5e4604-c284-4e32-89ab-76df1e73e583",
            payment_amounts: [],
            settlement_time: "2024-11-20 09:06:10",
            transaction_time: "2024-11-20 09:05:45",
            transaction_status: "settlement",
          },
          createdAt: "2024-11-20T02:05:29.000Z",
          User: {
            us_id: 2,
            us_fullname: "Rezskuy 1992",
          },
          OrderDetail: [
            {
              od_id: 1,
              od_or_id: 1,
              od_mn_json:
                '[{"id":2,"name":"Cappucino","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/cappucino_rdewmn.jpg","price":30000,"quantity":1},{"id":3,"name":"Espresso Machiato","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/espressomachiato_qbeacw.jpg","price":30000,"quantity":1},{"id":6,"name":"Sandwich","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641170/Sandwiches_zjsn1k.jpg","price":25000,"quantity":1},{"id":5,"name":"Caramel Machiato","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608584/caramelmachiato_oyzinx.jpg","price":35000,"quantity":1},{"id":4,"name":"Cocoa Cappucino","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/coccoacappucino_eyxrml.jpg","price":35000,"quantity":10}]',
            },
          ],
        },
      ];

      Order.findAll.mockResolvedValue(mockOrder);

      const response = await request(app).get("/order?status=ordered");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty(
        "message",
        "Success get all order ordered"
      );
      expect(response.body.data).toEqual(mockOrder);
    });
    it("should return 200 and get all orders with the ordered status", async () => {
      const mockOrder = [
        {
          or_id: 1,
          or_us_id: 2,
          or_site: "2",
          or_longitude: null,
          or_latitude: null,
          or_type_order: "Dine-in",
          or_total_price: 470000,
          or_status_payment: "settlement",
          or_status_shipping: "delivered",
          or_platform_id: "LeCafe-1732068343557",
          or_payment_info: {
            currency: "IDR",
            order_id: "LeCafe-1732068343557",
            va_numbers: [
              {
                bank: "bca",
                va_number: "99416228906431453172619",
              },
            ],
            expiry_time: "2024-11-21 09:05:45",
            merchant_id: "G031499416",
            status_code: "200",
            fraud_status: "accept",
            gross_amount: "470000.00",
            payment_type: "bank_transfer",
            signature_key:
              "2c1053b7ca318341ff26f63e5c89090ded533e8f205f80c7c08020b80fc98fa8fae0b4475757c9944c36f24cc6561209c96026e441f0519217df6311e1fc15c3",
            status_message: "Success, transaction is found",
            transaction_id: "ea5e4604-c284-4e32-89ab-76df1e73e583",
            payment_amounts: [],
            settlement_time: "2024-11-20 09:06:10",
            transaction_time: "2024-11-20 09:05:45",
            transaction_status: "settlement",
          },
          createdAt: "2024-11-20T02:05:29.000Z",
          User: {
            us_id: 2,
            us_fullname: "Rezskuy 1992",
          },
          OrderDetail: [
            {
              od_id: 1,
              od_or_id: 1,
              od_mn_json:
                '[{"id":2,"name":"Cappucino","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/cappucino_rdewmn.jpg","price":30000,"quantity":1},{"id":3,"name":"Espresso Machiato","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/espressomachiato_qbeacw.jpg","price":30000,"quantity":1},{"id":6,"name":"Sandwich","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641170/Sandwiches_zjsn1k.jpg","price":25000,"quantity":1},{"id":5,"name":"Caramel Machiato","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608584/caramelmachiato_oyzinx.jpg","price":35000,"quantity":1},{"id":4,"name":"Cocoa Cappucino","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/coccoacappucino_eyxrml.jpg","price":35000,"quantity":10}]',
            },
          ],
        },
      ];

      Order.findAll.mockResolvedValue(mockOrder);

      const response = await request(app).get("/order?status=delivered");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty(
        "message",
        "Success get all order delivered"
      );
      expect(response.body.data).toEqual(mockOrder);
    });
    it("should return 200 and get all orders", async () => {
      const mockOrder = [
        {
          or_id: 1,
          or_us_id: 2,
          or_site: "2",
          or_longitude: null,
          or_latitude: null,
          or_type_order: "Dine-in",
          or_total_price: 470000,
          or_status_payment: "settlement",
          or_status_shipping: "delivered",
          or_platform_id: "LeCafe-1732068343557",
          or_payment_info: {
            currency: "IDR",
            order_id: "LeCafe-1732068343557",
            va_numbers: [
              {
                bank: "bca",
                va_number: "99416228906431453172619",
              },
            ],
            expiry_time: "2024-11-21 09:05:45",
            merchant_id: "G031499416",
            status_code: "200",
            fraud_status: "accept",
            gross_amount: "470000.00",
            payment_type: "bank_transfer",
            signature_key:
              "2c1053b7ca318341ff26f63e5c89090ded533e8f205f80c7c08020b80fc98fa8fae0b4475757c9944c36f24cc6561209c96026e441f0519217df6311e1fc15c3",
            status_message: "Success, transaction is found",
            transaction_id: "ea5e4604-c284-4e32-89ab-76df1e73e583",
            payment_amounts: [],
            settlement_time: "2024-11-20 09:06:10",
            transaction_time: "2024-11-20 09:05:45",
            transaction_status: "settlement",
          },
          createdAt: "2024-11-20T02:05:29.000Z",
          User: {
            us_id: 2,
            us_fullname: "Rezskuy 1992",
          },
          OrderDetail: [
            {
              od_id: 1,
              od_or_id: 1,
              od_mn_json:
                '[{"id":2,"name":"Cappucino","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/cappucino_rdewmn.jpg","price":30000,"quantity":1},{"id":3,"name":"Espresso Machiato","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/espressomachiato_qbeacw.jpg","price":30000,"quantity":1},{"id":6,"name":"Sandwich","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641170/Sandwiches_zjsn1k.jpg","price":25000,"quantity":1},{"id":5,"name":"Caramel Machiato","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608584/caramelmachiato_oyzinx.jpg","price":35000,"quantity":1},{"id":4,"name":"Cocoa Cappucino","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/coccoacappucino_eyxrml.jpg","price":35000,"quantity":10}]',
            },
          ],
        },
      ];

      Order.findAll.mockResolvedValue(mockOrder);

      const response = await request(app).get("/order");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message", "Success get all order ");
      expect(response.body.data).toEqual(mockOrder);
    });
    it("should return 500 when an error occurs", async () => {
      jest
        .spyOn(Order, "findAll")
        .mockRejectedValue(new Error("Database Error"));

      const response = await request(app).get("/order");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });
  describe("Get Order By ID", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return 200 and the order details for a valid user ID", async () => {
      const mockOrder = {
        orders: {
          us_id: 2,
          us_fullname: "Rezskuy 1992",
          Order: [
            {
              or_id: 1,
              or_us_id: 2,
              or_site: "2",
              or_longitude: null,
              or_latitude: null,
              or_type_order: "Dine-in",
              or_total_price: 470000,
              or_status_payment: "settlement",
              or_status_shipping: "delivered",
              or_platform_id: "LeCafe-1732068343557",
              or_payment_info: {
                currency: "IDR",
                order_id: "LeCafe-1732068343557",
                va_numbers: [
                  {
                    bank: "bca",
                    va_number: "99416228906431453172619",
                  },
                ],
                expiry_time: "2024-11-21 09:05:45",
                merchant_id: "G031499416",
                status_code: "200",
                fraud_status: "accept",
                gross_amount: "470000.00",
                payment_type: "bank_transfer",
                signature_key:
                  "2c1053b7ca318341ff26f63e5c89090ded533e8f205f80c7c08020b80fc98fa8fae0b4475757c9944c36f24cc6561209c96026e441f0519217df6311e1fc15c3",
                status_message: "Success, transaction is found",
                transaction_id: "ea5e4604-c284-4e32-89ab-76df1e73e583",
                payment_amounts: [],
                settlement_time: "2024-11-20 09:06:10",
                transaction_time: "2024-11-20 09:05:45",
                transaction_status: "settlement",
              },
              createdAt: "2024-11-20T02:05:29.000Z",
              OrderDetail: [
                {
                  od_id: 1,
                  od_or_id: 1,
                  od_mn_json:
                    '[{"id":2,"name":"Cappucino","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/cappucino_rdewmn.jpg","price":30000,"quantity":1},{"id":3,"name":"Espresso Machiato","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/espressomachiato_qbeacw.jpg","price":30000,"quantity":1},{"id":6,"name":"Sandwich","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641170/Sandwiches_zjsn1k.jpg","price":25000,"quantity":1},{"id":5,"name":"Caramel Machiato","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608584/caramelmachiato_oyzinx.jpg","price":35000,"quantity":1},{"id":4,"name":"Cocoa Cappucino","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/coccoacappucino_eyxrml.jpg","price":35000,"quantity":10}]',
                },
              ],
              payment_method: "BCA",
            },
          ],
        },
        origins: {
          latitude: "-6.2443009",
          longitude: "106.7803626",
        },
      };

      User.findOne.mockResolvedValue(mockOrder);

      const response = await request(app).get(`/order/2`);

      console.log("Response:", response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty(
        "message",
        `Success get all order  with user id 2`
      );
    });
    it("should return 200 with status pending", async () => {
      const mockOrder = {
        orders: {
          us_id: 2,
          us_fullname: "Rezskuy 1992",
          Order: [
            {
              or_id: 2,
              or_us_id: 2,
              or_site: "9",
              or_longitude: null,
              or_latitude: null,
              or_type_order: "Dine-in",
              or_total_price: 30000,
              or_status_payment: "pending",
              or_status_shipping: "delivered",
              or_platform_id: null,
              or_payment_info: null,
              createdAt: "2024-11-20T03:12:15.000Z",
              OrderDetail: [
                {
                  od_id: 2,
                  od_or_id: 2,
                  od_mn_json:
                    '[{"id":2,"name":"Cappucino","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/cappucino_rdewmn.jpg","price":30000,"quantity":1}]',
                },
              ],
              payment_method: "Unknown",
            },
          ],
        },
        origins: {
          latitude: "-6.2443009",
          longitude: "106.7803626",
        },
      };

      User.findOne.mockResolvedValue(mockOrder);

      const response = await request(app).get(`/order/2/?status=pending`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty(
        "message",
        `Success get all order pending with user id 2`
      );
    });
    it("should return 200 with status ongoing", async () => {
      const mockOrder = {
        orders: {
          us_id: 2,
          us_fullname: "Rezskuy 1992",
          Order: [
            {
              or_id: 1,
              or_us_id: 2,
              or_site: "2",
              or_longitude: null,
              or_latitude: null,
              or_type_order: "Dine-in",
              or_total_price: 470000,
              or_status_payment: "settlement",
              or_status_shipping: "delivered",
              or_platform_id: "LeCafe-1732068343557",
              or_payment_info: {
                currency: "IDR",
                order_id: "LeCafe-1732068343557",
                va_numbers: [
                  {
                    bank: "bca",
                    va_number: "99416228906431453172619",
                  },
                ],
                expiry_time: "2024-11-21 09:05:45",
                merchant_id: "G031499416",
                status_code: "200",
                fraud_status: "accept",
                gross_amount: "470000.00",
                payment_type: "bank_transfer",
                signature_key:
                  "2c1053b7ca318341ff26f63e5c89090ded533e8f205f80c7c08020b80fc98fa8fae0b4475757c9944c36f24cc6561209c96026e441f0519217df6311e1fc15c3",
                status_message: "Success, transaction is found",
                transaction_id: "ea5e4604-c284-4e32-89ab-76df1e73e583",
                payment_amounts: [],
                settlement_time: "2024-11-20 09:06:10",
                transaction_time: "2024-11-20 09:05:45",
                transaction_status: "settlement",
              },
              createdAt: "2024-11-20T02:05:29.000Z",
              OrderDetail: [
                {
                  od_id: 1,
                  od_or_id: 1,
                  od_mn_json:
                    '[{"id":2,"name":"Cappucino","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/cappucino_rdewmn.jpg","price":30000,"quantity":1},{"id":3,"name":"Espresso Machiato","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/espressomachiato_qbeacw.jpg","price":30000,"quantity":1},{"id":6,"name":"Sandwich","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641170/Sandwiches_zjsn1k.jpg","price":25000,"quantity":1},{"id":5,"name":"Caramel Machiato","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608584/caramelmachiato_oyzinx.jpg","price":35000,"quantity":1},{"id":4,"name":"Cocoa Cappucino","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/coccoacappucino_eyxrml.jpg","price":35000,"quantity":10}]',
                },
              ],
              payment_method: "BCA",
            },
          ],
        },
        origins: {
          latitude: "-6.2443009",
          longitude: "106.7803626",
        },
      };

      User.findOne.mockResolvedValue(mockOrder);

      const response = await request(app).get(`/order/2/?status=ongoing`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty(
        "message",
        `Success get all order ongoing with user id 2`
      );
    });
    it("should return 200 with status ordered", async () => {
      const mockOrder = {
        orders: {
          us_id: 2,
          us_fullname: "Rezskuy 1992",
          Order: [
            {
              or_id: 1,
              or_us_id: 2,
              or_site: "2",
              or_longitude: null,
              or_latitude: null,
              or_type_order: "Dine-in",
              or_total_price: 470000,
              or_status_payment: "settlement",
              or_status_shipping: "delivered",
              or_platform_id: "LeCafe-1732068343557",
              or_payment_info: {
                currency: "IDR",
                order_id: "LeCafe-1732068343557",
                va_numbers: [
                  {
                    bank: "bca",
                    va_number: "99416228906431453172619",
                  },
                ],
                expiry_time: "2024-11-21 09:05:45",
                merchant_id: "G031499416",
                status_code: "200",
                fraud_status: "accept",
                gross_amount: "470000.00",
                payment_type: "bank_transfer",
                signature_key:
                  "2c1053b7ca318341ff26f63e5c89090ded533e8f205f80c7c08020b80fc98fa8fae0b4475757c9944c36f24cc6561209c96026e441f0519217df6311e1fc15c3",
                status_message: "Success, transaction is found",
                transaction_id: "ea5e4604-c284-4e32-89ab-76df1e73e583",
                payment_amounts: [],
                settlement_time: "2024-11-20 09:06:10",
                transaction_time: "2024-11-20 09:05:45",
                transaction_status: "settlement",
              },
              createdAt: "2024-11-20T02:05:29.000Z",
              OrderDetail: [
                {
                  od_id: 1,
                  od_or_id: 1,
                  od_mn_json:
                    '[{"id":2,"name":"Cappucino","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/cappucino_rdewmn.jpg","price":30000,"quantity":1},{"id":3,"name":"Espresso Machiato","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/espressomachiato_qbeacw.jpg","price":30000,"quantity":1},{"id":6,"name":"Sandwich","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641170/Sandwiches_zjsn1k.jpg","price":25000,"quantity":1},{"id":5,"name":"Caramel Machiato","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608584/caramelmachiato_oyzinx.jpg","price":35000,"quantity":1},{"id":4,"name":"Cocoa Cappucino","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/coccoacappucino_eyxrml.jpg","price":35000,"quantity":10}]',
                },
              ],
              payment_method: "BCA",
            },
          ],
        },
        origins: {
          latitude: "-6.2443009",
          longitude: "106.7803626",
        },
      };

      User.findOne.mockResolvedValue(mockOrder);

      const response = await request(app).get(`/order/2/?status=ordered`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty(
        "message",
        `Success get all order ordered with user id 2`
      );
    });
    it("should return 200 with status failed", async () => {
      const mockOrder = {
        orders: {
          us_id: 2,
          us_fullname: "Rezskuy 1992",
          Order: [
            {
              or_id: 2,
              or_us_id: 2,
              or_site: "9",
              or_longitude: null,
              or_latitude: null,
              or_type_order: "Dine-in",
              or_total_price: 30000,
              or_status_payment: "cancelled",
              or_status_shipping: "cancelled",
              or_platform_id: null,
              or_payment_info: null,
              createdAt: "2024-11-20T03:12:15.000Z",
              OrderDetail: [
                {
                  od_id: 2,
                  od_or_id: 2,
                  od_mn_json:
                    '[{"id":2,"name":"Cappucino","image":"https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/cappucino_rdewmn.jpg","price":30000,"quantity":1}]',
                },
              ],
              payment_method: "Unknown",
            },
          ],
        },
        origins: {
          latitude: "-6.2443009",
          longitude: "106.7803626",
        },
      };

      User.findOne.mockResolvedValue(mockOrder);

      const response = await request(app).get(`/order/2/?status=failed`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty(
        "message",
        `Success get all order failed with user id 2`
      );
    });

    it("should return 500 when an error occurs", async () => {
      jest
        .spyOn(User, "findOne")
        .mockRejectedValue(new Error("Database Error"));

      const response = await request(app).get("/order/2");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });
  describe("Create Order", () => {
    it("should return 201 and create a new order with order details", async () => {
      const mockBody = {
        userId: 1,
        site: "123 Main St",
        typeOrder: "pickup",
        totalPrice: "100",
        nameRecipient: "lorem ipsum",
        isOrderNow: true,
        phoneNumber: "085282810339",
        menuJson: JSON.stringify([{ menuId: 1, quantity: 2 }]),
      };

      // generateLatLongFromAddress.mockResolvedValue({
      //   latitude: 12.3456,
      //   longitude: 78.9012,
      // });

      Order.create.mockResolvedValue({
        or_id: 1,
        or_us_id: mockBody.userId,
        site: mockBody.site,
        or_latitude: 12.3456,
        or_longitude: 78.9012,
        or_type_order: mockBody.typeOrder,
        or_total_price: 100,
        or_status_shipping: "ongoing",
      });
      OrderDetail.create = jest.fn().mockResolvedValue({
        od_or_id: 1,
        od_mn_json: mockBody.menuJson,
      });
      Cart.destroy = jest.fn().mockResolvedValue(1);

      const response = await request(app).post("/order").send(mockBody);
      console.log(response);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("code", 201);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty(
        "message",
        "Order created successfully"
      );
    });

    it("should return 400 if site address is invalid", async () => {
      const mockBody = {
        userId: 1,
        site: null,
        typeOrder: "pickup",
        totalPrice: "100",
        menuJson: JSON.stringify([{ menuId: 1, quantity: 2 }]),
      };

      const response = await request(app).post("/order").send(mockBody);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Invalid site address");
    });

    it("should return 500 when an unexpected error occurs", async () => {
      const mockBody = {
        userId: 1,
        site: "123 Main St",
        typeOrder: "pickup",
        totalPrice: "100",
        menuJson: JSON.stringify([{ menuId: 1, quantity: 2 }]),
      };

      Order.create = jest.fn().mockRejectedValue(new Error("Database Error"));

      const response = await request(app).post("/order").send(mockBody);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });
  describe("Update Status Order", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return 200 when successfully updating the status", async () => {
      const id = 1;
      const mockBody = {
        status: "delivered",
      };

      Order.findOne = jest.fn().mockResolvedValue({
        cr_id: id,
      });
      Order.update.mockResolvedValue([1]);

      const response = await request(app).patch("/order/1").send(mockBody);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("code", 200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message", "Success update status");
    });

    it("should return 404 when the order is not found", async () => {
      const id = 999;
      const mockBody = {
        status: "delivered",
      };

      Order.findOne = jest.fn().mockResolvedValue(null);
      const response = await request(app).patch(`/order/${id}`).send(mockBody);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty(
        "message",
        `Order with id ${id} not found!`
      );
    });

    it("should return 500 when a database error occurs", async () => {
      const mockBody = {
        status: "delivered",
      };

      Order.findOne = jest.fn().mockRejectedValue(new Error("Database Error"));
      const response = await request(app).patch("/order/1").send(mockBody);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("code", 500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message", "Database Error");
    });
  });
});
