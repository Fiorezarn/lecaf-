"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "menus",
      [
        {
          mn_name: "Cafe Latte",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/caffelate_wsytuw.jpg",
          mn_desc:
            "Cafe Latte is a coffee-based drink prepared by diluting coffee with steamed milk, typically in a 3:1 or 4:1 ratio.",
          mn_price: "30000",
          mn_category: "coffee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Cappucino",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/cappucino_rdewmn.jpg",
          mn_desc:
            "Cappuccino is an espresso-based coffee drink that originated in Italy, and is traditionally styled with steamed milk foam.",
          mn_price: "30000",
          mn_category: "coffee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Espresso Machiato",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/espressomachiato_qbeacw.jpg",
          mn_desc:
            "Espresso Machiato is a shot of espresso 'marked' with a small amount of milk, typically served in a demitasse cup.",
          mn_price: "30000",
          mn_category: "coffee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Cocoa Cappucino",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608583/coccoacappucino_eyxrml.jpg",
          mn_desc:
            "Cocoa Cappucino is a coffee-based drink prepared by diluting coffee with cocoa, topped with steamed milk and cocoa powder.",
          mn_price: "35000",
          mn_category: "coffee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Caramel Machiato",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730608584/caramelmachiato_oyzinx.jpg",
          mn_desc:
            "Caramel Machiato is a shot of espresso 'marked' with a small amount of milk and caramel syrup, served over ice with whipped cream.",
          mn_price: "35000",
          mn_category: "coffee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Sandwich",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641170/Sandwiches_zjsn1k.jpg",
          mn_desc:
            "A sandwich is a food typically consisting of vegetables, meat, or other ingredients, placed between slices of bread.",
          mn_price: "25000",
          mn_category: "food",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Cheese Quiche",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641170/Cheese_Quiche_yjmtzo.jpg",
          mn_desc:
            "A cheese quiche is a baked dish made with cheese, butter, eggs, and sometimes other ingredients.",
          mn_price: "30000",
          mn_category: "food",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Nutella Bombolone",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641170/Nutella_Bombolone_jk3n1z.jpg",
          mn_desc:
            "Nutella Bombolone is a delicious and creamy dessert made with chocolate chips, nuts, and cocoa powder.",
          mn_price: "50000",
          mn_category: "food",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Cheese Bagels",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641169/Cheese_Bagels_zzxana.jpg",
          mn_desc: "A cheese bagel is a type of bagel with cheese on top.",
          mn_price: "20000",
          mn_category: "food",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Passion Frappuccino",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641170/Mango_Passion_Frappuccino_yroy5v.jpg",
          mn_desc: "Mango Passion Frappuccino is a classic drink with a twist.",
          mn_price: "30000",
          mn_category: "non-coffee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Lemonade Tea",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641169/Lemonade_Tea_osi0xi.jpg",
          mn_desc:
            "Lemonade Tea is a refreshing drink made with lemonade and tea.",
          mn_price: "25000",
          mn_category: "non-coffee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Bagel Bites",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641169/Bagel_Bites_ogqjda.jpg",
          mn_desc:
            "Bagel Bites are small bagels topped with various savory ingredients, often served as snacks.",
          mn_price: "15000",
          mn_category: "food",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Beef Filone",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641169/Beef_Filone_ljbhrj.jpg",
          mn_desc:
            "Beef Filone is a hearty sandwich made with tender beef slices, perfect for a filling meal.",
          mn_price: "35000",
          mn_category: "food",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Cinnamon Roll",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641168/Cinnamon_Roll_ej0s9k.jpg",
          mn_desc:
            "A sweet pastry made with cinnamon, sugar, and topped with a creamy glaze.",
          mn_price: "22000",
          mn_category: "food",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Earl Tea",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641168/Earl_Tea_asewsq.jpg",
          mn_desc:
            "Earl Tea is a classic black tea infused with the distinct aroma of bergamot.",
          mn_price: "20000",
          mn_category: "non-coffee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Seeds Cookie",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641168/Seeds_Cookie_mqqdrm.jpg",
          mn_desc:
            "Seeds Cookie is a nutritious cookie packed with a variety of healthy seeds.",
          mn_price: "18000",
          mn_category: "food",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Signature Chocolate",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641168/Signature_Chocolate_rrnx98.jpg",
          mn_desc:
            "A rich and indulgent chocolate drink perfect for chocolate lovers.",
          mn_price: "32000",
          mn_category: "non-coffee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Smoked Beef",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641168/Smoked_Beef_opzgcx.jpg",
          mn_desc:
            "Smoked Beef is a flavorful dish made from slow-smoked, savory beef slices.",
          mn_price: "40000",
          mn_category: "food",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Tuna Puff",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641168/Tuna_Puff_qfnycj.jpg",
          mn_desc:
            "A crispy puff pastry filled with savory tuna filling, perfect as a snack.",
          mn_price: "25000",
          mn_category: "food",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mn_name: "Raspberry Frappuccino",
          mn_image:
            "https://res.cloudinary.com/dsxnvgy7a/image/upload/v1730641169/Raspberry_Currant_Frappuccino_rfrgqq.jpg",
          mn_desc:
            "A fruity and refreshing frappuccino blend with the flavors of raspberry and currant.",
          mn_price: "30000",
          mn_category: "non-coffee",
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
