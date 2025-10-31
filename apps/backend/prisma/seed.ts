import {
  PrismaClient,
  Occasion,
  Season,
  Mood,
  Color,
  ProductType,
  PriceRange,
} from '@prisma/client';

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: 'Red Rose Bouquet',
    description: 'A classic bouquet of red roses — bold, timeless, and the ultimate expression of love.',
    longDescription: 'This striking bouquet features deep red roses wrapped in vintage newspaper-style paper with elegant black ribbons — a perfect blend of romance and sophistication. Each rose symbolizes love, passion, and admiration, making it ideal for anniversaries, Valentine\’s Day, or heartfelt surprises. The rich crimson tones evoke winter warmth and timeless devotion, creating a bouquet that speaks louder than words — elegant, dramatic, and eternally romantic.',
    priceCents: 4599, // $45.99
    priceRange: PriceRange.RANGE_25_50,
    imageUrl: '/images/Roses.jpg',
    stockCount: 25,
    occasions: [Occasion.VALENTINES_DAY, Occasion.ANNIVERSARY],
    seasons: [Season.ALL_SEASON],
    moods: [Mood.ROMANTIC],
    colors: [Color.RED],
    type: ProductType.BOUQUET,
  },
  {
    name: 'Spring Tulip Arrangement',
    description: 'Soft pink tulip bouquet — elegant, fresh, and full of spring\’s gentle promise and renewal.',
    longDescription: 'This graceful bouquet features delicate pink tulips paired with tiny blue forget-me-nots, beautifully wrapped in soft beige paper and finished with a pastel blue ribbon. Perfect for spring, when tulips bloom in abundance, it symbolizes new beginnings, love, and hope. Whether for birthdays, anniversaries, or heartfelt gestures, this arrangement captures the essence of spring — pure, romantic, and effortlessly elegant, just like the season itself.',
    priceCents: 3250, // $32.50
    priceRange: PriceRange.RANGE_25_50,
    imageUrl: '/images/Tulips.jpg',
    stockCount: 18,
    occasions: [Occasion.MOTHERS_DAY, Occasion.BIRTHDAY, Occasion.JUST_BECAUSE],
    seasons: [Season.SPRING],
    moods: [Mood.CHEERFUL, Mood.VIBRANT],
    colors: [Color.MIXED, Color.PASTEL],
    type: ProductType.TULIP,
  },
  {
    name: 'White Orchid Plant',
    description: ' A modern tropical bouquet — bold anthuriums and white blooms exuding elegance and summer energy.',
    longDescription: ' This striking bouquet blends tropical flair with modern sophistication. Featuring pink-tipped anthuriums, pure white gladiolus, and soft carnations, it creates a sculptural arrangement full of contrast and movement. Perfect for summer, when exotic blooms flourish, it symbolizes confidence, grace, and vitality. Ideal for stylish events, weddings, or thoughtful gifts, this bouquet captures the warmth and bold spirit of a tropical summer breeze.',
    priceCents: 6800, // $68.00
    priceRange: PriceRange.RANGE_50_75,
    imageUrl: '/images/Orchids.jpg',
    stockCount: 12,
    occasions: [Occasion.CONGRATULATIONS, Occasion.JUST_BECAUSE],
    seasons: [Season.ALL_SEASON],
    moods: [Mood.ELEGANT, Mood.SOPHISTICATED],
    colors: [Color.WHITE],
    type: ProductType.ORCHID,
  },
  {
    name: 'Sunny Joy Bouquet',
    description: 'A cheerful sunflower bouquet — bright, warm, and full of summer sunshine and positive energy.',
    longDescription: 'Radiating pure happiness, this bouquet features a stunning sunflower surrounded by white daisies, baby\'s breath, and fresh greenery, wrapped in sunny yellow paper for a joyful touch. Perfect for summer, the sunflower symbolizes warmth, optimism, and strength — just like the season itself. Whether it\'s a birthday, congratulations, or a simple gesture of cheer, this bouquet captures the golden glow of summer days and the beauty of heartfelt positivity.',
    priceCents: 3875, // $38.75
    priceRange: PriceRange.RANGE_25_50,
    imageUrl: '/images/Sunflowers.jpg',
    stockCount: 22,
    occasions: [
      Occasion.GET_WELL_SOON,
      Occasion.CONGRATULATIONS,
      Occasion.BIRTHDAY,
    ],
    seasons: [Season.SUMMER, Season.FALL],
    moods: [Mood.CHEERFUL, Mood.VIBRANT],
    colors: [Color.YELLOW],
    type: ProductType.SUNFLOWER,
  },
  {
    name: 'White Lily Arrangement',
    description: 'A pure white lily bouquet — elegant, serene, and perfect for heartfelt spring and summer moments.',
    longDescription: 'Timeless and graceful, this bouquet features pristine white lilies paired with soft greenery, wrapped in rustic kraft paper for a natural finish. Each bloom radiates purity and calm, symbolizing renewal and sincerity — making it ideal for weddings, anniversaries, or meaningful gestures. Inspired by early summer mornings, when lilies open under gentle sunlight, this arrangement captures peace, elegance, and the quiet beauty of the season.',
    priceCents: 5500, // $55.00
    priceRange: PriceRange.RANGE_50_75,
    imageUrl: '/images/Lilys.jpg',
    stockCount: 15,
    occasions: [Occasion.MOTHERS_DAY, Occasion.SYMPATHY, Occasion.ANNIVERSARY],
    seasons: [Season.SPRING, Season.SUMMER],
    moods: [Mood.ELEGANT, Mood.PEACEFUL],
    colors: [Color.PINK],
    type: ProductType.LILY,
  },
  {
    name: 'Delicate Anemone Bouquet',
    description: 'An elegant winter bouquet of white anemones and ranunculus — pure, timeless, and graceful.',
    longDescription: 'This bouquet captures the serene beauty of winter in bloom. Featuring ivory anemones with deep black centers, layered white ranunculus, and soft accents of lamb\’s ear and delicate blue forget-me-nots, it embodies purity and quiet elegance. Flowing satin ribbons add a romantic touch, perfect for modern weddings or minimalist spaces. Inspired by crisp winter mornings and frosted petals, this arrangement symbolizes grace, peace, and everlasting love.',
    priceCents: 3499, // $34.99
    priceRange: PriceRange.RANGE_25_50,
    imageUrl: '/images/Anemones.jpg',
    stockCount: 16,
    occasions: [Occasion.BIRTHDAY, Occasion.JUST_BECAUSE, Occasion.CONGRATULATIONS],
    seasons: [Season.SPRING, Season.WINTER],
    moods: [Mood.VIBRANT, Mood.CHEERFUL],
    colors: [Color.MIXED, Color.PURPLE],
    type: ProductType.BOUQUET,
  },
  {
    name: 'Sweet Carnation Mix',
    description: 'A cheerful bouquet of pink-edged carnations — sweet, charming, and perfect for any celebration.',
    longDescription: 'Bright and playful, this bouquet features bi-colored pink carnations wrapped in a red gingham sleeve, finished with a satin ribbon for a charming vintage touch. Each carnation symbolizes love, gratitude, and admiration — perfect for birthdays, thank-yous, or simply to brighten someone\’s day. With its soft petals and lively color palette, this bouquet captures the heart of spring and summer, evoking warmth, joy, and a timeless sense of affection.',
    priceCents: 2899, // $28.99
    priceRange: PriceRange.RANGE_25_50,
    imageUrl: '/images/Carnation.jpg',
    stockCount: 28,
    occasions: [Occasion.MOTHERS_DAY, Occasion.BIRTHDAY, Occasion.JUST_BECAUSE],
    seasons: [Season.ALL_SEASON],
    moods: [Mood.CHEERFUL, Mood.PEACEFUL],
    colors: [Color.PINK, Color.PASTEL],
    type: ProductType.BOUQUET,
  },
  {
    name: 'Cheerful Daffodil Bundle',
    description: 'Bright yellow daffodils celebrating spring',
    longDescription: 'Daffodils, the heart of this bouquet, are nature\'s timeless symbol of new beginnings and hope. Paired with daisies and airy accents, this arrangement celebrates the season of growth, when the world awakens from winter\'s rest and blossoms with possibility.\n\nPerfect for brightening your home, office, or loved one, or celebrating a fresh chapter, this bouquet isn\'t just flowers—it\'s a reminder that every season brings renewal and light.',
    priceCents: 2650, // $26.50
    priceRange: PriceRange.RANGE_25_50,
    imageUrl: '/images/Daffodil.jpg',
    stockCount: 24,
    occasions: [Occasion.BIRTHDAY, Occasion.JUST_BECAUSE, Occasion.GET_WELL_SOON],
    seasons: [Season.SPRING],
    moods: [Mood.CHEERFUL, Mood.VIBRANT],
    colors: [Color.YELLOW],
    type: ProductType.BOUQUET,
  },
  {
    name: 'Fresh Daisy Bouquet',
    description: 'A pure and delicate bouquet of daisies and baby\’s breath — timeless, light, and full of charm.',
    longDescription: 'Simple yet captivating, this bouquet features a dreamy mix of white daisies and baby\’s breath tied with a satin ribbon. Its soft textures and airy form evoke the freshness of early summer meadows in full bloom. Perfect for minimalist weddings, graduations, or thoughtful gifts, it symbolizes innocence, purity, and heartfelt joy. This arrangement celebrates the effortless beauty of the season — light, natural, and eternally elegant.',
    priceCents: 2299, // $22.99
    priceRange: PriceRange.UNDER_25,
    imageUrl: '/images/Daisies.jpg',
    stockCount: 32,
    occasions: [Occasion.JUST_BECAUSE, Occasion.BIRTHDAY],
    seasons: [Season.SPRING, Season.SUMMER],
    moods: [Mood.CHEERFUL, Mood.PEACEFUL],
    colors: [Color.WHITE],
    type: ProductType.BOUQUET,
  },
  {
    name: 'Fragrant Gardenia Plant',
    description: 'A timeless white bouquet — elegant tulips, gerberas, and baby\’s breath for serene spring beauty.',
    longDescription: 'This elegant bouquet captures the purity and calm of spring mornings. Featuring pristine white tulips, classic white gerberas, and delicate baby\’s breath, it radiates grace and simplicity. Wrapped in neutral kraft paper for a natural touch, it\’s perfect for weddings, anniversaries, or heartfelt gifts. Symbolizing new beginnings and sincerity, this bouquet embodies the peaceful spirit of early spring — fresh, pure, and beautifully understated.',
    priceCents: 5899, // $58.99
    priceRange: PriceRange.RANGE_50_75,
    imageUrl: '/images/Gardenia.jpg',
    stockCount: 10,
    occasions: [Occasion.JUST_BECAUSE, Occasion.CONGRATULATIONS],
    seasons: [Season.SPRING, Season.SUMMER],
    moods: [Mood.ELEGANT, Mood.ROMANTIC],
    colors: [Color.WHITE],
    type: ProductType.PLANT,
  },
  {
    name: 'Golden Marigold Bunch',
    description: 'A radiant bouquet of orange blooms — fresh, warm, and glowing with the spirit of early summer.',
    longDescription: 'This bright and modern bouquet bursts with the warmth of early summer. Featuring vivid orange tulips, soft apricot blossoms, and sunny yellow buds, it celebrates joy, creativity, and optimism. The flowing greenery adds a touch of freshness, creating perfect balance and movement. Wrapped simply to highlight its natural beauty, this bouquet is ideal for graduations, celebrations, or any moment that calls for sunshine and cheer.',
    priceCents: 1999, // $19.99
    priceRange: PriceRange.UNDER_25,
    imageUrl: '/images/Merigold.jpg',
    stockCount: 35,
    occasions: [Occasion.JUST_BECAUSE, Occasion.BIRTHDAY],
    seasons: [Season.SUMMER, Season.FALL],
    moods: [Mood.VIBRANT, Mood.CHEERFUL],
    colors: [Color.ORANGE, Color.YELLOW],
    type: ProductType.BOUQUET,
  },
  {
    name: 'Romantic Peony Bouquet',
    description: 'Soft pink peony bouquet — romantic, lush, and the perfect expression of spring\’s gentle beauty.',
    longDescription: 'This elegant bouquet showcases the timeless charm of spring peonies, delicately wrapped in neutral kraft paper. Featuring full, fragrant blooms in shades of blush and soft pink, complemented by airy baby\’s breath, it exudes romance and grace. Peonies symbolize love, prosperity, and new beginnings — making this bouquet ideal for weddings, birthdays, or heartfelt gestures. A celebration of spring\’s fleeting beauty, it captures tenderness in its purest form.',
    priceCents: 7250, // $72.50
    priceRange: PriceRange.RANGE_50_75,
    imageUrl: '/images/Peonies.jpg',
    stockCount: 14,
    occasions: [Occasion.WEDDING, Occasion.ANNIVERSARY, Occasion.MOTHERS_DAY],
    seasons: [Season.SPRING, Season.SUMMER],
    moods: [Mood.ROMANTIC, Mood.ELEGANT],
    colors: [Color.PINK, Color.PASTEL],
    type: ProductType.BOUQUET,
  },
  {
    name: 'Premium Mixed Bouquet',
    description: 'A joyful spring bouquet bursting with bright wildflowers, perfect for any cheerful occasion.',
    longDescription: 'Celebrate the spirit of spring with this vibrant hand-tied bouquet, a lively mix of seasonal blooms in shades of pink, purple, orange, yellow, and white. Fresh snapdragons, cornflowers, daisies, and carnations come together in a lush green base, capturing the energy of wild meadows after the first warm rains. Ideal for birthdays, thank-yous, or simply brightening a space, this bouquet embodies the freshness and renewal of the spring season.',
    priceCents: 12500, // $125.00
    priceRange: PriceRange.OVER_100,
    imageUrl: '/images/Filler.jpg',
    stockCount: 8,
    occasions: [Occasion.WEDDING, Occasion.ANNIVERSARY, Occasion.GRADUATION],
    seasons: [Season.ALL_SEASON],
    moods: [Mood.SOPHISTICATED, Mood.ELEGANT],
    colors: [Color.MIXED],
    type: ProductType.MIXED_FLOWERS,
  },
  {
    name: 'Succulent Garden Collection',
    description: 'A dreamy dried bouquet with soft pinks and creams, capturing the warmth of late summer fields.',
    longDescription: 'This elegant dried bouquet brings the calm beauty of late summer into your home. Featuring preserved daisies, wheat stems, and soft pink larkspur, it blends rustic textures with delicate pastels for a timeless look. Perfect for long-lasting décor or gifting, each stem is naturally dried to retain its gentle hues and charm. Inspired by golden harvest fields, this bouquet evokes the serenity and warmth of late summer sunsets — effortless, organic, and eternally beautiful.',
    priceCents: 2399, // $23.99
    priceRange: PriceRange.UNDER_25,
    imageUrl: '/images/Filler2.jpg',
    stockCount: 30,
    occasions: [Occasion.JUST_BECAUSE],
    seasons: [Season.ALL_SEASON],
    moods: [Mood.PEACEFUL, Mood.SOPHISTICATED],
    colors: [Color.GREEN],
    type: ProductType.SUCCULENT,
  },
  {
    name: 'Tropical Paradise Mix',
    description: 'A modern autumn bouquet with golden tones and lush greens—warm, bold, and full of seasonal charm.',
    longDescription: 'This striking bouquet captures the golden glow of autumn. Featuring rich eucalyptus leaves, soft beige dried florals, and vibrant orange billy buttons, it blends natural texture with bold seasonal hues. Perfect for adding warmth to your home or gifting with meaning, this arrangement reflects the cozy transition from summer to fall—where crisp air, earthy tones, and golden light create a sense of calm and timeless beauty.',
    priceCents: 6499, // $64.99
    priceRange: PriceRange.RANGE_50_75,
    imageUrl: '/images/Filler3.jpg',
    stockCount: 11,
    occasions: [Occasion.BIRTHDAY, Occasion.CONGRATULATIONS, Occasion.JUST_BECAUSE],
    seasons: [Season.SUMMER, Season.ALL_SEASON],
    moods: [Mood.VIBRANT, Mood.CHEERFUL],
    colors: [Color.MIXED, Color.ORANGE],
    type: ProductType.MIXED_FLOWERS,
  },
  {
    name: 'Zen Garden Plant',
    description: 'A bright burst of yellow blooms symbolizing joy, sunshine, and the vibrant energy of spring.',
    longDescription: 'Bring sunshine indoors with this radiant spring bouquet. A lively mix of golden billy buttons, mimosa, and fresh eucalyptus creates a cheerful, modern arrangement that captures the essence of renewal and optimism. Perfect for celebrating new beginnings or simply brightening someone\’s day, this bouquet embodies the warmth of spring mornings and the happiness of longer, lighter days — a joyful reminder that brighter times are always blooming.',
    priceCents: 4250, // $42.50
    priceRange: PriceRange.RANGE_25_50,
    imageUrl: '/images/Filler4.jpg',
    stockCount: 20,
    occasions: [Occasion.JUST_BECAUSE, Occasion.CONGRATULATIONS],
    seasons: [Season.ALL_SEASON],
    moods: [Mood.PEACEFUL, Mood.SOPHISTICATED],
    colors: [Color.GREEN],
    type: ProductType.PLANT,
  },
  {
    name: 'Autumn Harvest Bouquet',
    description: 'A soft pastel bouquet blooming with spring warmth — elegant, romantic, and effortlessly fresh.',
    longDescription: 'This charming bouquet celebrates the gentle beauty of spring. A harmonious blend of creamy dahlias, blush roses, peach chrysanthemums, and golden daisies evokes the warmth of morning sunlight and the tenderness of new beginnings. Accented with delicate greenery and lilac sprigs, it captures the poetic calm of a spring garden in full bloom. Perfect for birthdays, weddings, or heartfelt gestures — it\’s a timeless expression of grace and renewal.',
    priceCents: 4899, // $48.99
    priceRange: PriceRange.RANGE_25_50,
    imageUrl: '/images/Filler5.jpg',
    stockCount: 17,
    occasions: [Occasion.HOUSEWARMING, Occasion.BIRTHDAY, Occasion.JUST_BECAUSE],
    seasons: [Season.FALL],
    moods: [Mood.CHEERFUL, Mood.VIBRANT],
    colors: [Color.ORANGE, Color.YELLOW, Color.RED],
    type: ProductType.MIXED_FLOWERS,
  },
  {
    name: 'Gentle Spring Symphony',
    description: ' A pastel dream bouquet — soft poppies, daisies, and delphiniums that embody spring\’s tender light.',
    longDescription: ' This whimsical bouquet captures the pure magic of early spring. A poetic blend of pastel poppies, creamy cosmos, blue delphiniums, and petite daisies evokes the freshness of morning sunlight and the softness of new beginnings. The airy colors — peach, lilac, ivory, and baby blue — dance together like a watercolor painting. Perfect for birthdays, weddings, or simply brightening a room, it celebrates renewal, beauty, and the gentle joy of spring in bloom.',
    priceCents: 8999, // $89.99
    priceRange: PriceRange.RANGE_75_100,
    imageUrl: '/images/Filler6.jpg',
    stockCount: 9,
    occasions: [Occasion.ANNIVERSARY, Occasion.WEDDING, Occasion.VALENTINES_DAY],
    seasons: [Season.ALL_SEASON],
    moods: [Mood.ROMANTIC, Mood.ELEGANT],
    colors: [Color.PINK, Color.PASTEL],
    type: ProductType.ROSE,
  },
  {
    name: 'Country Wildflower Mix',
    description: 'A dreamy pastel bouquet bursting with soft poppies and daisies — pure joy in spring form.',
    longDescription: 'This whimsical bouquet captures the essence of early spring, where every bloom feels like a fresh breath of light. Featuring delicate poppies, buttercream cosmos, powder-blue delphiniums, and petite daisies, it blends airy textures with soft pastel tones of peach, lilac, and cream. The arrangement feels effortless yet elegant — a perfect ode to renewal and new beginnings. Ideal for birthdays, weddings, or simply brightening a space with spring\’s gentle joy.',
    priceCents: 3150, // $31.50
    priceRange: PriceRange.RANGE_25_50,
    imageUrl: '/images/Filler7.jpg',
    stockCount: 21,
    occasions: [Occasion.JUST_BECAUSE, Occasion.BIRTHDAY],
    seasons: [Season.SPRING, Season.SUMMER],
    moods: [Mood.CHEERFUL, Mood.PEACEFUL],
    colors: [Color.MIXED, Color.PASTEL],
    type: ProductType.MIXED_FLOWERS,
  },
  {
    name: 'Indoor Fern Collection',
    description: 'A pastel dream of spring blooms — fresh, delicate, and filled with the joy of new beginnings.',
    longDescription: 'This bouquet is a celebration of spring\’s sweetest moments. A soft, airy blend of cosmos, delphiniums, zinnias, scabiosa, and daisies in pastel hues of peach, lilac, blue, and white — each bloom radiates freshness and gentle charm. Designed to evoke the feeling of sunlight after rain, it\’s the perfect choice for birthdays, weddings, or simply to brighten any room. Every stem whispers renewal and joy — the true spirit of spring captured in flowers.',
    priceCents: 3599, // $35.99
    priceRange: PriceRange.RANGE_25_50,
    imageUrl: '/images/Filler8.jpg',
    stockCount: 19,
    occasions: [Occasion.JUST_BECAUSE],
    seasons: [Season.ALL_SEASON],
    moods: [Mood.PEACEFUL, Mood.SOPHISTICATED],
    colors: [Color.GREEN],
    type: ProductType.PLANT,
  },
];

const categories = [
  {
    name: 'Bouquets',
    description: 'Hand-crafted flower bouquets for any occasion',
    imageUrl: '/images/Roses.jpg',
  },
  {
    name: 'Plants',
    description: 'Beautiful plants for home and office',
    imageUrl: '/images/Filler4.jpg',
  },
  {
    name: 'Arrangements',
    description: 'Elegant flower arrangements in vases',
    imageUrl: '/images/Tulips.jpg',
  },
  {
    name: 'Seasonal',
    description: 'Seasonal flowers and plants',
    imageUrl: '/images/Sunflowers.jpg',
  },
];

const collections = [
  {
    name: 'Bundle Up and Save',
    description: 'Get more for less with our curated bundles',
    imageUrl: '/images/Filler.jpg',
    discountPercent: 15,
  },
  {
    name: "Valentine's Special",
    description: "Romantic flowers perfect for Valentine's Day",
    imageUrl: '/images/Roses.jpg',
    discountPercent: 10,
  },
];

// Test users for graduation project demo
// Note: These users have Auth0 IDs that match real test accounts
const testUsers = [
  {
    id: 'user_1_test', // Will be replaced with real Auth0 ID when testing
    email: 'test@flora.com',
    firstName: 'Flora',
    lastName: 'Tester',
    role: 'CUSTOMER',
  },
  {
    id: 'user_2_demo', // For demo purposes
    email: 'demo@flora.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'CUSTOMER',
  }
];

// Test addresses for our test users (Melbourne, Australia)
const testAddresses = [
  // Addresses for test@flora.com
  {
    userId: 'user_1_test',
    label: 'Home',
    firstName: 'Flora',
    lastName: 'Tester',
    street1: '123 Collins Street',
    street2: 'Apt 15B',
    city: 'Melbourne',
    state: 'VIC',
    zipCode: '3000',
    country: 'AU',
    phone: '+61-3-9555-0123',
    isDefault: true,
  },
  {
    userId: 'user_1_test',
    label: 'Work',
    firstName: 'Flora',
    lastName: 'Tester',
    street1: '456 Bourke Street',
    city: 'Melbourne',
    state: 'VIC',
    zipCode: '3000',
    country: 'AU',
    phone: '+61-3-9555-0123',
    isDefault: false,
  },
  // Address for demo@flora.com
  {
    userId: 'user_2_demo',
    label: 'Home',
    firstName: 'Demo',
    lastName: 'User',
    street1: '789 Chapel Street',
    city: 'South Yarra',
    state: 'VIC',
    zipCode: '3141',
    country: 'AU',
    phone: '+61-3-9555-0456',
    isDefault: true,
  },
];

async function main() {
  console.log('🌸 Starting to seed Flora database...');
  console.log('🔄 Using UPSERT pattern - updates existing data, creates new data');

  // Upsert categories (using name as unique key)
  console.log('📂 Upserting categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {
        description: category.description,
        imageUrl: category.imageUrl,
      },
      create: category,
    });
  }

  // Upsert products (name must be unique for this to work)
  console.log('🌺 Upserting products...');
  for (const product of sampleProducts) {
    // Check if product exists by name
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (existing) {
      // Update existing product
      await prisma.product.update({
        where: { id: existing.id },
        data: product,
      });
    } else {
      // Create new product
      await prisma.product.create({
        data: product,
      });
    }
  }

  // Upsert test users (using email as unique identifier)
  console.log('👤 Upserting test users...');
  for (const user of testUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      create: user,
    });
  }

  // Upsert test addresses (find by userId + label combination)
  console.log('🏠 Upserting test addresses...');
  for (const address of testAddresses) {
    const existing = await prisma.address.findFirst({
      where: {
        userId: address.userId,
        label: address.label,
      },
    });

    if (existing) {
      await prisma.address.update({
        where: { id: existing.id },
        data: address,
      });
    } else {
      await prisma.address.create({
        data: address,
      });
    }
  }

  console.log('✅ Seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   ${categories.length} categories`);
  console.log(`   ${sampleProducts.length} products`);
  console.log(`   ${testUsers.length} test users`);
  console.log(`   ${testAddresses.length} test addresses`);
  console.log(`\n🧪 Test Data Ready:`);
  console.log(`   📧 Test User: test@flora.com`);
  console.log(`   📧 Demo User: demo@flora.com`);
  console.log(`   🏠 Addresses: ${testAddresses.length} total (default addresses marked)`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
