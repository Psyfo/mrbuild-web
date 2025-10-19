/**
 * Initialize Branch Database
 * This script:
 * 1. Creates MongoDB indexes for the branches collection
 * 2. Migrates existing hardcoded branch data to the database
 * 3. Sets up initial branches with proper structure
 *
 * Run with: node scripts/init-branch-db.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'mrbuild';
const COLLECTION_NAME = 'branches';

// Existing branch data from the hardcoded array
const initialBranches = [
  {
    branchName: 'Mr. Build Tzaneen',
    branchType: 'MR_BUILD',
    status: 'ACTIVE',
    email: 'tzaneen@mrbuild.co.za',
    telephone: '015 004 0560',
    address1: 'Corner Danie Joubert',
    address2: 'Claude Wheatley St',
    city: 'Tzaneen',
    province: 'Limpopo',
    postalCode: '0850',
    coordinates: {
      latitude: -23.831000495266885,
      longitude: 30.164830483251983,
    },
    operatingHours: {
      monday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      tuesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      wednesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      thursday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      friday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      saturday: { isOpen: true, openTime: '07:30', closeTime: '12:30' },
      sunday: { isOpen: false },
      publicHolidays: 'Hours might differ',
    },
    slug: 'mr-build-tzaneen',
    displayOrder: 1,
    isActive: true,
  },
  {
    branchName: 'Mr. Build Louis Trichardt',
    branchType: 'MR_BUILD',
    status: 'ACTIVE',
    email: 'Louistrichardt@mrbuild.co.za',
    telephone: '015 004 0168',
    address1: 'Cnr Rissik & Grobler Straat',
    address2: '',
    city: 'Louis Trichardt',
    province: 'Limpopo',
    postalCode: '0920',
    coordinates: {
      latitude: -23.049124228049475,
      longitude: 29.910482873433757,
    },
    operatingHours: {
      monday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      tuesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      wednesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      thursday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      friday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      saturday: { isOpen: true, openTime: '07:30', closeTime: '12:30' },
      sunday: { isOpen: false },
      publicHolidays: 'Hours might differ',
    },
    slug: 'mr-build-louis-trichardt',
    displayOrder: 2,
    isActive: true,
  },
  {
    branchName: 'Mr. Build Musina',
    branchType: 'MR_BUILD',
    status: 'ACTIVE',
    email: 'musina@mrbuild.co.za',
    telephone: '015 004 1031',
    address1: '6 Pat Harrison Rd',
    address2: '',
    city: 'Musina',
    province: 'Limpopo',
    postalCode: '0900',
    coordinates: {
      latitude: -22.35601137585995,
      longitude: 30.03158562369095,
    },
    operatingHours: {
      monday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      tuesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      wednesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      thursday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      friday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      saturday: { isOpen: true, openTime: '07:30', closeTime: '12:30' },
      sunday: { isOpen: false },
      publicHolidays: 'Hours might differ',
    },
    slug: 'mr-build-musina',
    displayOrder: 3,
    isActive: true,
  },
  {
    branchName: 'Mr. Build Giyani',
    branchType: 'MR_BUILD',
    status: 'ACTIVE',
    email: 'giyani@mrbuild.co.za',
    telephone: '015 812 3786',
    address1: 'Giyani-BA',
    address2: '',
    city: 'Giyani',
    province: 'Limpopo',
    postalCode: '0826',
    coordinates: {
      latitude: -23.30823395934613,
      longitude: 30.693532532078933,
    },
    operatingHours: {
      monday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      tuesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      wednesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      thursday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      friday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      saturday: { isOpen: true, openTime: '07:30', closeTime: '12:30' },
      sunday: { isOpen: false },
      publicHolidays: 'Hours might differ',
    },
    slug: 'mr-build-giyani',
    displayOrder: 4,
    isActive: true,
  },
  {
    branchName: 'Mr. Build Sibasa',
    branchType: 'MR_BUILD',
    status: 'ACTIVE',
    email: 'sibasa@mrbuild.co.za',
    telephone: '015 963 3856',
    address1: '204 Makhado Rd Sibasa',
    address2: '',
    city: 'Sibasa',
    province: 'Limpopo',
    postalCode: '0970',
    coordinates: {
      latitude: -22.947322465454207,
      longitude: 30.468803054391653,
    },
    operatingHours: {
      monday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      tuesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      wednesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      thursday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      friday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      saturday: { isOpen: true, openTime: '07:30', closeTime: '12:30' },
      sunday: { isOpen: false },
      publicHolidays: 'Hours might differ',
    },
    slug: 'mr-build-sibasa',
    displayOrder: 5,
    isActive: true,
  },
  {
    branchName: 'Mr. Build Thohoyandou',
    branchType: 'MR_BUILD',
    status: 'ACTIVE',
    email: 'thohoyandou@mrbuild.co.za',
    telephone: '015 962 0444',
    address1: '90/91 B.A MUNICIPALITY',
    address2: '',
    city: 'Thohoyandou',
    province: 'Limpopo',
    postalCode: '0950',
    coordinates: {
      latitude: -22.97051832689911,
      longitude: 30.461899383227742,
    },
    operatingHours: {
      monday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      tuesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      wednesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      thursday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      friday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      saturday: { isOpen: true, openTime: '07:30', closeTime: '12:30' },
      sunday: { isOpen: false },
      publicHolidays: 'Hours might differ',
    },
    slug: 'mr-build-thohoyandou',
    displayOrder: 6,
    isActive: true,
  },
  {
    branchName: 'The Builder Thohoyandou',
    branchType: 'THE_BUILDER',
    status: 'ACTIVE',
    email: 'thohoyandou@thebuilder.co.za',
    telephone: '015 962 5545',
    address1: '70 Mphepu Street',
    address2: 'Main Road',
    city: 'Thohoyandou',
    province: 'Limpopo',
    postalCode: '0950',
    coordinates: {
      latitude: -22.98298122138363,
      longitude: 30.456993058732582,
    },
    operatingHours: {
      monday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      tuesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      wednesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      thursday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      friday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      saturday: { isOpen: true, openTime: '07:30', closeTime: '12:30' },
      sunday: { isOpen: false },
      publicHolidays: 'Hours might differ',
    },
    slug: 'the-builder-thohoyandou',
    displayOrder: 7,
    isActive: true,
  },
  {
    branchName: 'The Builder Giyani',
    branchType: 'THE_BUILDER',
    status: 'ACTIVE',
    email: 'giyani@thebuilder.co.za',
    telephone: '015 004 0561',
    address1: '22BA, Next to Mopani Depot',
    address2: '',
    city: 'Giyani',
    province: 'Limpopo',
    postalCode: '0826',
    coordinates: {
      latitude: -23.30520029500934,
      longitude: 30.68955769152215,
    },
    operatingHours: {
      monday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      tuesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      wednesday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      thursday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      friday: {
        isOpen: true,
        openTime: '07:30',
        closeTime: '16:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      },
      saturday: { isOpen: true, openTime: '07:30', closeTime: '12:30' },
      sunday: { isOpen: false },
      publicHolidays: 'Hours might differ',
    },
    slug: 'the-builder-giyani',
    displayOrder: 8,
    isActive: true,
  },
];

async function initBranchDatabase() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Step 1: Create indexes
    console.log('\n📊 Creating indexes...');
    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ branchName: 1 });
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ branchType: 1 });
    await collection.createIndex({ city: 1 });
    await collection.createIndex({ province: 1 });
    await collection.createIndex({ isActive: 1 });
    await collection.createIndex({ displayOrder: 1 });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex(
      { branchName: 'text', city: 'text', address1: 'text', address2: 'text' },
      { weights: { branchName: 10, city: 5, address1: 3, address2: 1 } }
    );
    console.log('✅ Indexes created successfully');

    // Step 2: Check if branches already exist
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`\n⚠️  Found ${existingCount} existing branches`);
      console.log('Do you want to:');
      console.log('  1. Skip initialization (keep existing data)');
      console.log('  2. Add new branches only (preserve existing)');
      console.log('  3. Replace all branches (delete existing)');
      console.log('\nSkipping initialization to preserve existing data.');
      console.log(
        'To force initialization, delete the branches collection first.'
      );
      return;
    }

    // Step 3: Insert initial branches
    console.log('\n📥 Inserting initial branches...');
    const now = new Date();
    const branchesWithTimestamps = initialBranches.map((branch) => ({
      ...branch,
      createdAt: now,
      updatedAt: now,
    }));

    const result = await collection.insertMany(branchesWithTimestamps);
    console.log(`✅ Successfully inserted ${result.insertedCount} branches`);

    // Step 4: Display summary
    console.log('\n📋 Branch Summary:');
    const stats = await collection
      .aggregate([
        {
          $group: {
            _id: '$branchType',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    stats.forEach((stat) => {
      const typeName = stat._id === 'MR_BUILD' ? 'Mr Build' : 'The Builder';
      console.log(`  ${typeName}: ${stat.count} branches`);
    });

    console.log('\n✅ Branch database initialization complete!');
    console.log('\nNext steps:');
    console.log('  1. Start your development server: npm run dev');
    console.log('  2. Navigate to /admin/branches to manage branches');
    console.log('  3. View branches on the public site at /#branch-locator');
  } catch (error) {
    console.error('\n❌ Error initializing branch database:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run the initialization
initBranchDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
