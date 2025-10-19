/**
 * Navigation Seed Script
 * Run this once to populate the navigation collection with default items
 *
 * Usage (from project root):
 * node scripts/seed-navigation.js
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (value && !key.startsWith('#')) {
        process.env[key.trim()] = value;
      }
    }
  });
  console.log('✅ Loaded environment variables from .env.local');
} else {
  console.warn('⚠️ .env.local file not found, using default values');
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

const dbName = 'mrbuild';
console.log(`📦 Connecting to database: ${dbName}`);

const defaultNavigation = [
  {
    label: 'About',
    href: '#about',
    order: 1,
    isActive: true,
    openInNewTab: false,
    isExternal: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    label: 'Services',
    href: '#services',
    order: 2,
    isActive: true,
    openInNewTab: false,
    isExternal: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    label: 'Brands',
    href: '#brands',
    order: 3,
    isActive: true,
    openInNewTab: false,
    isExternal: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    label: 'Specials',
    href: '#specials',
    order: 4,
    isActive: true,
    openInNewTab: false,
    isExternal: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    label: 'Branch Locator',
    href: '#branch-locator',
    order: 5,
    isActive: true,
    openInNewTab: false,
    isExternal: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    label: 'Contact',
    href: '#contact',
    order: 6,
    isActive: true,
    openInNewTab: false,
    isExternal: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedNavigation() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('navigation');

    // Check if navigation already exists
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`Navigation collection already has ${count} items.`);
      console.log('Skipping seed to avoid duplicates.');
      console.log('To re-seed, delete the collection first.');
      return;
    }

    // Insert default navigation items
    const result = await collection.insertMany(defaultNavigation);
    console.log(
      `✅ Successfully inserted ${result.insertedCount} navigation items`
    );

    // Display inserted items
    console.log('\nInserted navigation items:');
    defaultNavigation.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.label} → ${item.href}`);
    });
  } catch (error) {
    console.error('Error seeding navigation:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the seed function
seedNavigation()
  .then(() => {
    console.log('\n✨ Navigation seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Navigation seed failed:', error);
    process.exit(1);
  });
