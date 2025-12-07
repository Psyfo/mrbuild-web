/**
 * Seed Contact Database
 * This script generates sample contact data for testing and development
 *
 * Run with: node scripts/seed-contacts.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'mrbuild';
const COLLECTION_NAME = 'contacts';

// Sample data generators
const firstNames = [
  'Thabo',
  'Sipho',
  'Lerato',
  'Nomsa',
  'Mandla',
  'Zanele',
  'Bongani',
  'Ntombi',
  'Kagiso',
  'Palesa',
  'Tshepo',
  'Refilwe',
  'Jabulani',
  'Thandiwe',
  'Sizwe',
  'Lindiwe',
  'Mpho',
  'Nkosi',
  'Precious',
  'Themba',
  'Sarah',
  'John',
  'Maria',
  'David',
  'Grace',
  'Peter',
  'Elizabeth',
  'Michael',
  'Anna',
  'James',
];

const lastNames = [
  'Mokoena',
  'Nkosi',
  'Dlamini',
  'Khumalo',
  'Sithole',
  'Ndlovu',
  'Mthembu',
  'Mahlangu',
  'Naidoo',
  'Pillay',
  'Van der Merwe',
  'Botha',
  'Pretorius',
  'Muller',
  'Steyn',
  'Nel',
  'Fourie',
  'Venter',
  'De Wet',
  'Smit',
];

const cities = [
  'Tzaneen',
  'Louis Trichardt',
  'Musina',
  'Giyani',
  'Sibasa',
  'Thohoyandou',
  'Polokwane',
  'Phalaborwa',
  'Mokopane',
  'Lephalale',
];

const messageTemplates = [
  {
    subject: 'Building Materials Quote',
    body: 'Hi, I need a quote for {quantity} bags of cement and {quantity2} bricks for my construction project in {city}. Please send me your best price.',
    priority: 'MEDIUM',
    tags: ['quote', 'cement', 'bricks'],
  },
  {
    subject: 'Roof Sheeting Inquiry',
    body: 'Good day, I am building a 3-bedroom house and need IBR roof sheeting. Can you provide pricing and availability? My project is in {city}.',
    priority: 'MEDIUM',
    tags: ['quote', 'roofing', 'construction'],
  },
  {
    subject: 'Urgent - Need Sand Delivery',
    body: 'I urgently need {quantity} loads of building sand delivered to {city}. Can you deliver tomorrow? Please call me ASAP.',
    priority: 'URGENT',
    tags: ['delivery', 'sand', 'urgent'],
  },
  {
    subject: 'Plumbing Materials',
    body: 'Hello, I need PVC pipes, fittings, and a geyser for my new house. Do you have stock? I can collect from your {city} branch.',
    priority: 'MEDIUM',
    tags: ['quote', 'plumbing', 'collection'],
  },
  {
    subject: 'Tiles and Flooring',
    body: 'I am looking for ceramic floor tiles for a {quantity}sqm area. What options do you have available? Also need tile adhesive and grout.',
    priority: 'LOW',
    tags: ['quote', 'tiles', 'flooring'],
  },
  {
    subject: 'Electrical Supplies',
    body: 'Need electrical cables, DB board, circuit breakers for a house wiring project. Can you assist with quantities and pricing?',
    priority: 'MEDIUM',
    tags: ['quote', 'electrical', 'wiring'],
  },
  {
    subject: 'Paint and Painting Supplies',
    body: 'I need exterior and interior paint for a 4-room house. What brands do you stock? Also need brushes, rollers, and masking tape.',
    priority: 'LOW',
    tags: ['quote', 'paint', 'painting-supplies'],
  },
  {
    subject: 'Doors and Windows',
    body: 'Looking for quotes on steel doors and aluminum windows. I need {quantity} doors and {quantity2} windows. Do you install as well?',
    priority: 'HIGH',
    tags: ['quote', 'doors', 'windows', 'installation'],
  },
  {
    subject: 'Cement and Building Sand',
    body: 'Hi, can I get pricing for bulk cement (50 bags) and 3 loads of building sand? Project starting next week in {city}.',
    priority: 'MEDIUM',
    tags: ['quote', 'cement', 'sand', 'bulk-order'],
  },
  {
    subject: 'Expert Advice Needed',
    body: 'I am planning to build a boundary wall. Can someone advise on materials needed and quantities? The wall will be about 30 meters long.',
    priority: 'LOW',
    tags: ['advice', 'consultation', 'boundary-wall'],
  },
  {
    subject: 'Hardware Items',
    body: 'Need nails, screws, hammer, spade, wheelbarrow, and other general building tools. Do you have a starter kit or package deal?',
    priority: 'LOW',
    tags: ['quote', 'tools', 'hardware'],
  },
  {
    subject: 'Delivery Charges Inquiry',
    body: 'What are your delivery charges to {city}? I need materials delivered for a small renovation project.',
    priority: 'LOW',
    tags: ['delivery', 'pricing'],
  },
  {
    subject: 'Account Application',
    body: 'I am a contractor and would like to open a business account with your company. What documents do I need? I work mainly in {city} area.',
    priority: 'MEDIUM',
    tags: ['account', 'business', 'contractor'],
  },
  {
    subject: 'Steel and Reinforcement',
    body: 'Need reinforcement steel (Y12 and Y16) for foundation work. Approximately {quantity} tons. Can you deliver to {city}?',
    priority: 'HIGH',
    tags: ['quote', 'steel', 'reinforcement', 'delivery'],
  },
  {
    subject: 'Bathroom Fixtures',
    body: 'Looking for complete bathroom suite - toilet, basin, bath, shower, taps. Do you have package deals? Quality brands preferred.',
    priority: 'MEDIUM',
    tags: ['quote', 'bathroom', 'fixtures', 'package'],
  },
  {
    subject: 'Compliment - Excellent Service',
    body: 'I want to thank your {city} branch staff for excellent service yesterday. Very helpful and knowledgeable. Will definitely come back!',
    priority: 'LOW',
    tags: ['feedback', 'compliment', 'service'],
  },
  {
    subject: 'Complaint - Wrong Items Delivered',
    body: 'I ordered {quantity} bags of cement but received plaster instead. Please arrange to collect and deliver correct items urgently. Order #{orderNumber}.',
    priority: 'URGENT',
    tags: ['complaint', 'delivery', 'wrong-order'],
  },
  {
    subject: 'Timber and Wood Products',
    body: 'Need timber for roof trusses. Approximately {quantity} pieces of 50x114mm. Also need ceiling boards. Available in {city}?',
    priority: 'MEDIUM',
    tags: ['quote', 'timber', 'roofing'],
  },
  {
    subject: 'Paving and Landscaping',
    body: 'Looking for paving bricks, kerbs, and topsoil for landscaping project. About {quantity}sqm area to pave. Delivery available?',
    priority: 'LOW',
    tags: ['quote', 'paving', 'landscaping'],
  },
  {
    subject: 'Special Order Request',
    body: 'I need a special item not in your regular stock - {specialItem}. Can you order it for me? How long will it take to arrive?',
    priority: 'MEDIUM',
    tags: ['special-order', 'inquiry'],
  },
];

const specialItems = [
  'industrial epoxy floor coating',
  'commercial kitchen tiles',
  'fire-rated doors',
  'soundproof insulation',
  'water tank 5000L',
  'solar geyser system',
];

// Status distribution (realistic)
const statusDistribution = [
  { status: 'NEW', weight: 20 },
  { status: 'READ', weight: 35 },
  { status: 'REPLIED', weight: 40 },
  { status: 'ARCHIVED', weight: 4 },
  { status: 'SPAM', weight: 1 },
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getWeightedRandomStatus() {
  const totalWeight = statusDistribution.reduce(
    (sum, item) => sum + item.weight,
    0
  );
  let random = Math.random() * totalWeight;

  for (const item of statusDistribution) {
    random -= item.weight;
    if (random <= 0) {
      return item.status;
    }
  }
  return 'NEW';
}

function generatePhoneNumber() {
  const prefixes = [
    '082',
    '083',
    '084',
    '072',
    '073',
    '074',
    '076',
    '078',
    '079',
    '081',
  ];
  const prefix = getRandomElement(prefixes);
  const number = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, '0');
  return `${prefix} ${number.slice(0, 3)} ${number.slice(3)}`;
}

function generateEmail(firstName, lastName) {
  const domains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'icloud.com',
    'webmail.co.za',
  ];
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${getRandomNumber(1, 99)}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
  ];

  return `${getRandomElement(formats)}@${getRandomElement(domains)}`;
}

function generateContact(index) {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const city = getRandomElement(cities);
  const template = getRandomElement(messageTemplates);
  const status = getWeightedRandomStatus();

  // Generate message from template
  let message = template.body
    .replace('{quantity}', getRandomNumber(10, 100))
    .replace('{quantity2}', getRandomNumber(5, 50))
    .replace('{city}', city)
    .replace('{specialItem}', getRandomElement(specialItems))
    .replace('{orderNumber}', `MRB${getRandomNumber(10000, 99999)}`);

  // Generate dates (spread over last 60 days)
  const daysAgo = getRandomNumber(0, 60);
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - daysAgo);
  createdAt.setHours(getRandomNumber(7, 18), getRandomNumber(0, 59), 0, 0);

  const contact = {
    firstName,
    lastName,
    email: generateEmail(firstName, lastName),
    telephone: generatePhoneNumber(),
    message: message,
    subject: template.subject,
    status: status,
    priority: template.priority,
    tags: template.tags,
    source: getRandomElement(['website', 'email', 'phone']),
    ipAddress: `41.${getRandomNumber(0, 255)}.${getRandomNumber(
      0,
      255
    )}.${getRandomNumber(0, 255)}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: createdAt,
    updatedAt: createdAt,
  };

  // Add readAt if status is READ, REPLIED, or ARCHIVED
  if (['READ', 'REPLIED', 'ARCHIVED'].includes(status)) {
    const readAt = new Date(createdAt);
    readAt.setHours(readAt.getHours() + getRandomNumber(1, 48));
    contact.readAt = readAt;
  }

  // Add repliedAt if status is REPLIED
  if (status === 'REPLIED') {
    const repliedAt = new Date(contact.readAt);
    repliedAt.setHours(repliedAt.getHours() + getRandomNumber(1, 24));
    contact.repliedAt = repliedAt;
  }

  // Add archivedAt if status is ARCHIVED
  if (status === 'ARCHIVED') {
    const archivedAt = new Date(contact.readAt || createdAt);
    archivedAt.setDate(archivedAt.getDate() + getRandomNumber(7, 30));
    contact.archivedAt = archivedAt;
  }

  return contact;
}

async function seedContacts() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Check if contacts already exist
    const existingCount = await collection.countDocuments();
    console.log(`\n📊 Found ${existingCount} existing contacts in database`);

    // Calculate how many to add to reach target
    const targetTotal = 50;
    const numberOfContactsToAdd = Math.max(0, targetTotal - existingCount);

    if (numberOfContactsToAdd === 0) {
      console.log(
        `✅ Already have ${existingCount} contacts (target: ${targetTotal})`
      );
      console.log('No additional contacts needed.');
      return;
    }

    // Generate contacts
    console.log(`\n📝 Generating ${numberOfContactsToAdd} sample contacts...`);
    console.log(`   (to reach target of ${targetTotal} total contacts)`);
    const contacts = [];

    for (let i = 0; i < numberOfContactsToAdd; i++) {
      contacts.push(generateContact(i));
    }

    // Insert contacts
    console.log(
      `📥 Inserting ${numberOfContactsToAdd} new contacts into database...`
    );
    const result = await collection.insertMany(contacts);
    console.log(`✅ Successfully inserted ${result.insertedCount} contacts`);

    // Get new total
    const newTotal = await collection.countDocuments();
    console.log(
      `📈 Total contacts in database: ${newTotal} (was ${existingCount})`
    );

    // Display statistics
    console.log('\n📊 Contact Statistics:');
    const stats = await collection
      .aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray();

    console.log('\nBy Status:');
    stats.forEach((stat) => {
      console.log(`  ${stat._id}: ${stat.count}`);
    });

    const priorityStats = await collection
      .aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray();

    console.log('\nBy Priority:');
    priorityStats.forEach((stat) => {
      console.log(`  ${stat._id}: ${stat.count}`);
    });

    console.log('\n✅ Contact database seeding complete!');
    console.log('\nNext steps:');
    console.log('  1. Navigate to /admin/contacts to view and manage contacts');
    console.log('  2. Test filtering, sorting, and pagination features');
    console.log('  3. Try the search functionality');
  } catch (error) {
    console.error('\n❌ Error seeding contacts:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run the seeding
seedContacts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
