// Seed script: populates the Menu table with sample Hawaiian menu items.
// Run via:  npx prisma db seed
//       or: npm run db:seed   (from apps/backend/)

require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const { databaseUrl } = require("../src/config/databaseUrl");

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const menuData = [
  // ALOHA FRIDAY SPECIAL
  { name: "Hawaiian Luau Plate", category: "Aloha Friday Special", price: 24.59, description: "Traditional Hawaiian feast plate.", isAvailable: true },

  // BUY DA POUND
  { name: "1/2 lb Lomi Salmon", category: "Buy Da Pound", price: 7.99, description: "Salted salmon massaged with diced tomatoes and onions.", isAvailable: true },
  { name: "1/2 lb poke", category: "Buy Da Pound", price: 11.99, description: "Sashimi-grade ahi tuna with Hawaiian salt, inamona, and shoyu.", isAvailable: true },
  { name: "1/2 Mac Salad", category: "Buy Da Pound", price: 4.99, description: "Island favorite macaroni salad.", isAvailable: true },
  { name: "1lb Kalua Pig", category: "Buy Da Pound", price: 17.99, description: "Slow-roasted smoky shredded pork.", isAvailable: true },
  { name: "1lb Mac Salad", category: "Buy Da Pound", price: 9.99, description: "Large portion of macaroni salad.", isAvailable: true },
  { name: "1lb Poke", category: "Buy Da Pound", price: 22.99, description: "Full pound of fresh ahi poke.", isAvailable: true },
  { name: "1 Lb Lomi Lomi Salmon", category: "Buy Da Pound", price: 14.99, description: "Traditional side with salted salmon and tomatoes.", isAvailable: true },

  // MINI PLATES
  { name: "MINI TERI BEEF", category: "Mini Plates", price: 9.99, description: "Small portion of teriyaki beef.", isAvailable: true },
  { name: "MINI CHICKEN CUTLET", category: "Mini Plates", price: 10.35, description: "Small portion of breaded chicken cutlet.", isAvailable: true },
  { name: "MINI MEAT JUN", category: "Mini Plates", price: 9.99, description: "Small portion of egg-battered beef.", isAvailable: true },
  { name: "MINI SHOYU CHICKEN", category: "Mini Plates", price: 8.99, description: "Small portion of braised shoyu chicken.", isAvailable: true },
  { name: "MINI MOCHIKO", category: "Mini Plates", price: 9.99, description: "Small portion of mochiko chicken.", isAvailable: true },

  // GRAB N GO'Z
  { name: "DELUXE (Spam, Portuguese Sausage And Scrambled Eggs)", category: "Grab N Go'Z", price: 12.99, description: "Spam, Portuguese sausage, and scrambled eggs.", isAvailable: true },
  { name: "Loco Moco", category: "Grab N Go'Z", price: 14.99, description: "Beef patty, rice, egg, and brown gravy.", isAvailable: true },
  { name: "Spam Scrambled Eggs and Rice", category: "Grab N Go'Z", price: 9.99, description: "Classic breakfast/lunch combo.", isAvailable: true },
  { name: "Chicken Cutlet Loco Moco w/mac salad", category: "Grab N Go'Z", price: 15.99, description: "Crispy chicken cutlet loco moco with mac salad.", isAvailable: true },
  { name: "Hamburger Steak Loco Moco", category: "Grab N Go'Z", price: 15.99, description: "Grilled hamburger steak loco moco with gravy.", isAvailable: true },

  // PLATES
  { name: "Chicken Katsu Curry", category: "Plates", price: 18.99, description: "Fried chicken cutlet with Japanese-style curry.", isAvailable: true },
  { name: "Chicken Katsu", category: "Plates", price: 18.99, description: "Crispy fried chicken cutlet with rice.", isAvailable: true },
  { name: "Kalbi Lunch Plate", category: "Plates", price: 23.99, description: "Tender Korean-style BBQ short ribs.", isAvailable: true },
  { name: "Mochiko Chicken", category: "Plates", price: 17.99, description: "Japanese-style sweet and salty fried chicken.", isAvailable: true },
  { name: "Mochiko/Kalua Pig Combo", category: "Plates", price: 19.99, description: "Mochiko chicken and kalua pig combo.", isAvailable: true },
  { name: "Mochiko/Meat Jun Combo", category: "Plates", price: 19.99, description: "Mochiko chicken and meat jun combo.", isAvailable: true },
  { name: "Poke Bowl", category: "Plates", price: 17.99, description: "Fresh poke served over rice.", isAvailable: true },
  { name: "Spicy Ahi Tuna Bowl", category: "Plates", price: 18.99, description: "Spicy version of our fresh poke bowl.", isAvailable: true },
  { name: "Teriyaki Beef Plate", category: "Plates", price: 18.99, description: "Grilled beef with house teriyaki sauce.", isAvailable: true },
  { name: "Beef Teriyaki and Shoyu Chicken mixed plate", category: "Plates", price: 19.99, description: "Beef teriyaki and shoyu chicken mixed plate.", isAvailable: true },
  { name: "Kalua Pig Plate", category: "Plates", price: 17.99, description: "Traditional slow-roasted smoky pork.", isAvailable: true },
  { name: "Kalua Pig and Shoyu Chicken Combo", category: "Plates", price: 19.99, description: "Kalua pig and shoyu chicken combo.", isAvailable: true },
  { name: "Laulau Plate", category: "Plates", price: 18.99, description: "Pork wrapped in taro leaves.", isAvailable: true },
  { name: "Shoyu Chicken Plate", category: "Plates", price: 17.99, description: "Braised shoyu chicken with rice.", isAvailable: true },
  { name: "Meat Jun", category: "Plates", price: 17.99, description: "Egg-battered thin sliced beef.", isAvailable: true },

  // PUPU'S
  { name: "Spam Musubi", category: "Pupu's", price: 3.99, description: "Marinated spam and rice wrapped in nori.", isAvailable: true },
  { name: "Fried Spam Musubi", category: "Pupu's", price: 4.99, description: "Crispy fried spam musubi.", isAvailable: true },
  { name: "Katsu Musubi", category: "Pupu's", price: 4.99, description: "Crispy chicken katsu with rice and seaweed.", isAvailable: true },
  { name: "Shrimp Lumpia", category: "Pupu's", price: 7.99, description: "Filipino-style shrimp spring rolls.", isAvailable: true },
  { name: "Kimchee Cucumber", category: "Pupu's", price: 5.76, description: "Spicy pickled cucumber.", isAvailable: true },

  // SANDWICHES
  { name: "Shaka TERIYAKI Beef sandwich W/FRENCH FRIES", category: "Sandwiches", price: 14.99, description: "Teriyaki beef sandwich with crispy french fries.", isAvailable: true },
  { name: "Shaka TERI Beef sandwich ONLY", category: "Sandwiches", price: 10.99, description: "Teriyaki beef sandwich without fries.", isAvailable: true },

  // NOODLES & RICE
  { name: "Saimin (noodles with broth) char Siu, green onion", category: "Noodles", price: 12.99, description: "Traditional Hawaiian noodle soup with char siu and green onion.", isAvailable: true },
  { name: "Da Sumo", category: "Noodles", price: 13.99, description: "Large bowl of ramen with toppings.", isAvailable: true },

  // DRINKS
  { name: "Coke/Sprite", category: "Drinks", price: 2.5, description: "Chilled canned soda.", isAvailable: true },
  { name: "Hawaiian Sun Drink", category: "Drinks", price: 3.37, description: "Assorted island fruit flavors.", isAvailable: true },
  { name: "Water", category: "Drinks", price: 1.99, description: "Bottled water.", isAvailable: true },

  // DESSERTS
  { name: "Butter Mochi", category: "Desserts", price: 3.25, description: "Gluten-free chewy rice flour cake with coconut.", isAvailable: true },
  { name: "Apple Turnover", category: "Desserts", price: 4.99, description: "Sweet apple pastry.", isAvailable: true },
  { name: "Guava Cake Slices", category: "Desserts", price: 4.99, description: "Slices of tropical guava cake.", isAvailable: true },

  // UNAVAILABLE ITEMS
  { name: "Coconut Water", category: "Drinks", price: 0.00, description: "Fresh coconut water.", isAvailable: false },
  { name: "Sparkling Water", category: "Uncategorized", price: 0.00, description: "Carbonated water.", isAvailable: false }
];

async function main() {
  console.log("🌺 Seeding menu items...");

  for (const item of menuData) {
    const existing = await prisma.menu.findFirst({
      where: { name: item.name },
    });
    if (existing) {
      console.log(`  ⏭  Skipped (already exists): ${item.name}`);
    } else {
      await prisma.menu.create({ data: item });
      console.log(`  ✅ Created: ${item.name}`);
    }
  }
  async function seedModifiers() {
  // 1. Create global modifiers
  const noOnions = await prisma.modifier.create({
    data: { name: "No Green Onions", price: 0.0 }
  });
  
  const extraGravy = await prisma.modifier.create({
    data: { name: "Extra Gravy", price: 1.50 }
  });

  const allMac = await prisma.modifier.create({
    data: { name: "All Mac Salad no rice", price: 2.99 }
  });

  // 2. Connect them to a specific Menu item (e.g., the Combo Plate)
  await prisma.menu.update({
    where: { name: "Kalua Pig and Shoyu Chicken Combo" },
    data: {
      modifiers: {
        connect: [
          { id: noOnions.id },
          { id: extraGravy.id },
          { id: allMac.id }
        ]
      }
    }
  });
}
  console.log("🌺 Seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
