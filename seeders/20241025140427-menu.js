"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "menus",
      [
        {
          mn_name: "Cafe Latte",
          mn_image: "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/caffelate_wsytuw.jpg",
          mn_desc:
            "Cafe Latte is a coffee-based drink prepared by diluting coffee with steamed milk, typically in a 3:1 or 4:1 ratio.",
          mn_price: "30000",
          mn_category: "coffee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Cappucino",
          mn_image: "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/cappucino_rdewmn.jpg",
          mn_desc:
            "Cappuccino is an espresso-based coffee drink that originated in Italy, and is traditionally styled with steamed milk foam.",
          mn_price: "30000",
          mn_category: "coffee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Espresso Machiato",
          mn_image: "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/espressomachiato_qbeacw.jpg",
          mn_desc:
            "Espresso Machiato is a shot of espresso 'marked' with a small amount of milk, typically served in a demitasse cup.",
          mn_price: "30000",
          mn_category: "coffee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Cocoa Cappucino",
          mn_image: "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/coccoacappucino_eyxrml.jpg",
          mn_desc:
            "Cocoa Cappucino is a coffee-based drink prepared by diluting coffee with cocoa, topped with steamed milk and cocoa powder.",
          mn_price: "35000",
          mn_category: "coffee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Caramel Machiato",
          mn_image: "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608584/caramelmachiato_oyzinx.jpg",
          mn_desc:
            "Caramel Machiato is a shot of espresso 'marked' with a small amount of milk and caramel syrup, served over ice with whipped cream.",
          mn_price: "35000",
          mn_category: "coffee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("menus", null, {});
  },
};
