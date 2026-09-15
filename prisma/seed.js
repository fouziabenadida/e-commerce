/* eslint-disable no-console */
const { PrismaClient, Role, OrderStatus } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const categoryData = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Cutting-edge gadgets and devices for modern living.",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Timeless styles for every season.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description: "Beautiful pieces to make your space feel like home.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Beauty",
    slug: "beauty",
    description: "Premium self-care and beauty essentials.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Gear up for your next adventure.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Toys & Games",
    slug: "toys-games",
    description: "Fun for the whole family.",
    image:
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=1200&auto=format&fit=crop",
  },
];

const productData = [
  // Electronics
  {
    name: "Aurora Wireless Headphones",
    slug: "aurora-wireless-headphones",
    description:
      "Immersive over-ear wireless headphones with active noise cancellation, 40-hour battery life, and plush memory-foam ear cushions.",
    price: 24999,
    compareAtPrice: 29999,
    category: "electronics",
    stock: 25,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Pulse Smart Watch",
    slug: "pulse-smart-watch",
    description:
      "Track your health with precision. Heart rate, SpO2, sleep tracking, and 7-day battery in a stunning AMOLED display.",
    price: 19999,
    compareAtPrice: null,
    category: "electronics",
    stock: 40,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Nimbus Pro Camera",
    slug: "nimbus-pro-camera",
    description:
      "A mirrorless camera with a 33MP sensor, 4K 60fps video, and lightning-fast autofocus for creators who never miss a moment.",
    price: 129900,
    compareAtPrice: 149900,
    category: "electronics",
    stock: 10,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Arc Bluetooth Speaker",
    slug: "arc-bluetooth-speaker",
    description:
      "360° room-filling sound with deep bass, 24-hour playtime, and IPX7 waterproofing for adventures anywhere.",
    price: 12999,
    compareAtPrice: 15999,
    category: "electronics",
    stock: 50,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Levi Mechanical Keyboard",
    slug: "levi-mechanical-keyboard",
    description:
      "A premium 75% mechanical keyboard with hot-swappable switches, gasket mounting, and vibrant per-key RGB.",
    price: 15999,
    compareAtPrice: null,
    category: "electronics",
    stock: 30,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Glide Wireless Mouse",
    slug: "glide-wireless-mouse",
    description:
      "Ultra-light ergonomic mouse with a 25K DPI sensor, silent click switches, and 70-hour battery life.",
    price: 7999,
    compareAtPrice: 9999,
    category: "electronics",
    stock: 60,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1200&auto=format&fit=crop",
    ],
  },

  // Fashion
  {
    name: "Heritage Denim Jacket",
    slug: "heritage-denim-jacket",
    description:
      "A timeless denim jacket cut from 13oz Japanese selvedge denim. Ages beautifully with every wear.",
    price: 10999,
    compareAtPrice: 12999,
    category: "fashion",
    stock: 20,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Oxblood Leather Backpack",
    slug: "oxblood-leather-backpack",
    description:
      "Full-grain leather backpack big enough for a 16\" laptop, with brass hardware and a padded laptop sleeve.",
    price: 18999,
    compareAtPrice: null,
    category: "fashion",
    stock: 15,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Merino Crew Sweater",
    slug: "merino-crew-sweater",
    description:
      "Feather-soft 100% merino wool crewneck sweater. Naturally breathable, odor-resistant, and endlessly versatile.",
    price: 8999,
    compareAtPrice: 10999,
    category: "fashion",
    stock: 35,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Stride Trail Runners",
    slug: "stride-trail-runners",
    description:
      "Grippy, breathable, and built to last. Trail runners with a cushioned midsole for all-day comfort.",
    price: 13999,
    compareAtPrice: null,
    category: "fashion",
    stock: 45,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Aviator Sunglasses",
    slug: "aviator-sunglasses",
    description:
      "Classic aviator frames with polarized lenses and 100% UV protection. Lightweight and timeless.",
    price: 12999,
    compareAtPrice: 15999,
    category: "fashion",
    stock: 55,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Classic White Sneakers",
    slug: "classic-white-sneakers",
    description:
      "Minimalist low-top sneakers in premium white leather. Pairs with everything in your wardrobe.",
    price: 9499,
    compareAtPrice: 11999,
    category: "fashion",
    stock: 38,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1200&auto=format&fit=crop",
    ],
  },

  // Home & Living
  {
    name: "Eclipse Floor Lamp",
    slug: "eclipse-floor-lamp",
    description:
      "A sculptural floor lamp with a warm dimmable glow. The perfect mood-setter for cozy evenings.",
    price: 21999,
    compareAtPrice: 25999,
    category: "home-living",
    stock: 12,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Linen Throw Blanket",
    slug: "linen-throw-blanket",
    description:
      "A generously sized stonewashed linen throw. Naturally soft, breathable, and gets better with age.",
    price: 7499,
    compareAtPrice: null,
    category: "home-living",
    stock: 40,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1580301762395-24ce84d00cb0?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Nordic Ceramic Vase",
    slug: "nordic-ceramic-vase",
    description:
      "Hand-thrown ceramic vase with a soft matte glaze. A minimalist statement piece for any shelf.",
    price: 5499,
    compareAtPrice: 6999,
    category: "home-living",
    stock: 28,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Oak Tray Table",
    slug: "oak-tray-table",
    description:
      "Solid oak tray table that doubles as a serving or lap tray. Finished with natural, food-safe oil.",
    price: 9999,
    compareAtPrice: null,
    category: "home-living",
    stock: 18,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1526025954276-3f6a1e05f17b?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Cloud Nine Cushion",
    slug: "cloud-nine-cushion",
    description:
      "A plush velvet cushion with feather filling. The kind of soft you sink into and never want to leave.",
    price: 3999,
    compareAtPrice: 4999,
    category: "home-living",
    stock: 65,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Evergreen Artificial Plant",
    slug: "evergreen-artificial-plant",
    description:
      "Lush, realistic potted plant that needs zero watering. Instant life for any corner of your home.",
    price: 4699,
    compareAtPrice: 5999,
    category: "home-living",
    stock: 50,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1200&auto=format&fit=crop",
    ],
  },

  // Beauty
  {
    name: "Rose Ritual Face Serum",
    slug: "rose-ritual-face-serum",
    description:
      "A vitamin-rich facial serum with rosehip oil, hyaluronic acid, and niacinamide for a radiant glow.",
    price: 4999,
    compareAtPrice: 5999,
    category: "beauty",
    stock: 70,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1629384017449-4f89946b56ab?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Velvet Matte Lipstick",
    slug: "velvet-matte-lipstick",
    description:
      "Weightless, transfer-proof matte lipstick in a universally flattering rosewood shade.",
    price: 2499,
    compareAtPrice: null,
    category: "beauty",
    stock: 80,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Botanical Shampoo Bar",
    slug: "botanical-shampoo-bar",
    description:
      "A plastic-free shampoo bar with nourishing botanicals. Lasts up to 80 washes and smells divine.",
    price: 1499,
    compareAtPrice: 1999,
    category: "beauty",
    stock: 100,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Silk Pillowcase Duo",
    slug: "silk-pillowcase-duo",
    description:
      "Two 100% mulberry silk pillowcases. Gentle on hair and skin while you sleep.",
    price: 5999,
    compareAtPrice: 7499,
    category: "beauty",
    stock: 32,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Amber Eau de Parfum",
    slug: "amber-eau-de-parfum",
    description:
      "A warm, woody fragrance with amber, vanilla, and sandalwood. Long-lasting and unforgettable.",
    price: 8999,
    compareAtPrice: null,
    category: "beauty",
    stock: 22,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Overnight Repair Cream",
    slug: "overnight-repair-cream",
    description:
      "Rich overnight cream with ceramides and peptides that works while you sleep to restore your skin barrier.",
    price: 6999,
    compareAtPrice: 8499,
    category: "beauty",
    stock: 44,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?q=80&w=1200&auto=format&fit=crop",
    ],
  },

  // Sports & Outdoors
  {
    name: "Summit Hiking Backpack",
    slug: "summit-hiking-backpack",
    description:
      "A 40L ultralight backpack with breathable mesh suspension, rain cover included. Built for the trail.",
    price: 15999,
    compareAtPrice: 18999,
    category: "sports-outdoors",
    stock: 14,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1502980426475-b83966705988?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622260614153-03223fb72052?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "TrailBlaze Water Bottle",
    slug: "trailblaze-water-bottle",
    description:
      "A 1L insulated stainless-steel bottle that keeps drinks cold 24 hours or hot 12. Leak-proof lid.",
    price: 3499,
    compareAtPrice: 4499,
    category: "sports-outdoors",
    stock: 90,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Flex Yoga Mat",
    slug: "flex-yoga-mat",
    description:
      "A 5mm non-slip yoga mat with alignment lines. Lightweight enough to carry, thick enough for comfort.",
    price: 5299,
    compareAtPrice: 6499,
    category: "sports-outdoors",
    stock: 48,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Pulse Resistance Bands",
    slug: "pulse-resistance-bands",
    description:
      "A 5-piece set of premium latex resistance bands with clips and handles. Customizable workouts anywhere.",
    price: 2999,
    compareAtPrice: 3999,
    category: "sports-outdoors",
    stock: 75,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Apex Camping Tent",
    slug: "apex-camping-tent",
    description:
      "A weatherproof 2-person tent that sets up in 5 minutes. Freestanding, lightweight, and ventilated.",
    price: 24999,
    compareAtPrice: null,
    category: "sports-outdoors",
    stock: 16,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Trail GPS Smartwatch",
    slug: "trail-gps-smartwatch",
    description:
      "Rugged GPS watch with altimeter, compass, and 14-day battery. Your compass for every adventure.",
    price: 29999,
    compareAtPrice: 34999,
    category: "sports-outdoors",
    stock: 20,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
    ],
  },

  // Toys & Games
  {
    name: "Constellation Puzzle (1000 pcs)",
    slug: "constellation-puzzle-1000",
    description:
      "A mesmerizing 1000-piece puzzle of the night sky. Glow-in-the-dark pieces reveal the constellations.",
    price: 2999,
    compareAtPrice: 3499,
    category: "toys-games",
    stock: 55,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746d?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Classic Wooden Building Blocks",
    slug: "classic-wooden-blocks",
    description:
      "A 100-piece set of beautifully finished wooden blocks, crafted from sustainably sourced maple.",
    price: 4999,
    compareAtPrice: null,
    category: "toys-games",
    stock: 30,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1588271012883-1bcc3a7b1cbf?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Zen Garden Kit",
    slug: "zen-garden-kit",
    description:
      "Everything you need to build your own peaceful desk garden: sand, stones, rake, and tray.",
    price: 3499,
    compareAtPrice: 4499,
    category: "toys-games",
    stock: 42,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Retro Arcade Controller",
    slug: "retro-arcade-controller",
    description:
      "A 2-player arcade fight-stick with tactile joystick and responsive buttons for PC, Switch, and more.",
    price: 7499,
    compareAtPrice: 8999,
    category: "toys-games",
    stock: 24,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Board Game Night Bundle",
    slug: "board-game-night-bundle",
    description:
      "Five best-selling strategy and party games curated for unforgettable game nights.",
    price: 12999,
    compareAtPrice: 15999,
    category: "toys-games",
    stock: 18,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    name: "Robo-Buddy STEM Kit",
    slug: "robo-buddy-stem-kit",
    description:
      "A build-and-code robot kit for kids aged 8+. Learn robotics, block coding, and problem-solving.",
    price: 8999,
    compareAtPrice: null,
    category: "toys-games",
    stock: 26,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?q=80&w=1200&auto=format&fit=crop",
    ],
  },
];

const reviewComments = [
  "Exceeded my expectations. The quality is outstanding!",
  "Great value for the price. Would definitely buy again.",
  "Shipping was fast and the product is exactly as described.",
  "Beautiful design and it works flawlessly. Highly recommend!",
  "Good product overall, but I wish it came in more colors.",
  "Perfect gift! The recipient absolutely loved it.",
  "Solid build quality. Feels premium and durable.",
  "Very happy with this purchase. Three weeks in and still great.",
  "Customer service was fantastic when I had a question.",
  "Looks even better in person than in the photos!",
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Store Admin",
      email: "admin@shopdemo.com",
      password: adminPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop",
    },
  });

  const demo = await prisma.user.create({
    data: {
      name: "Demo Shopper",
      email: "demo@shopdemo.com",
      password: userPassword,
      role: Role.USER,
      emailVerified: new Date(),
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    },
  });

  // Categories
  const categories = new Map();
  for (const c of categoryData) {
    const created = await prisma.category.create({ data: c });
    categories.set(created.slug, created);
    console.log(`  ✓ Category: ${created.name}`);
  }

  // Products
  for (const p of productData) {
    const category = categories.get(p.category);
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        categoryId: category.id,
        images: JSON.stringify(p.images),
        stock: p.stock,
        featured: p.featured,
      },
    });
    console.log(`  ✓ Product: ${p.name}`);
  }

  // Reviews
  const products = await prisma.product.findMany();
  const users = [admin, demo];
  const reviewsPerProduct = Math.floor(products.length / 2);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const count = i < reviewsPerProduct ? 1 : 0;
    if (count === 0) continue;

    const user = users[i % users.length];
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId: product.id,
        rating: 4 + (i % 2),
        comment: reviewComments[i % reviewComments.length],
      },
    });

    // Update product aggregate rating
    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
    });
    const average =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await prisma.product.update({
      where: { id: product.id },
      data: { rating: average, reviewCount: reviews.length },
    });
    console.log(`  ✓ Review on: ${product.name} (${review.rating}★)`);
  }

  // A sample order for the demo user so account page isn't empty
  const firstProducts = products.slice(0, 3);
  let total = 0;
  const orderItems = firstProducts.map((product, idx) => {
    const price = product.price * (idx + 1);
    total += price;
    return {
      productId: product.id,
      quantity: idx + 1,
      price,
    };
  });

  await prisma.order.create({
    data: {
      userId: demo.id,
      status: OrderStatus.DELIVERED,
      total,
      shippingAddress: JSON.stringify({
        name: "Demo Shopper",
        line1: "123 Market Street",
        city: "Austin",
        state: "TX",
        postalCode: "78701",
        country: "US",
      }),
      items: { create: orderItems },
    },
  });
  console.log("  ✓ Sample order for demo user");

  console.log("✅ Seeding complete!");
  console.log("──────────────────────────────");
  console.log("Admin login:  admin@shopdemo.com / admin123");
  console.log("Demo login:   demo@shopdemo.com  / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });