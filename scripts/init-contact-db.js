/**
 * Database Initialization Script for Contact Management
 *
 * This script initializes the database by creating necessary indexes
 * for optimal performance of the contact management system.
 *
 * Run this once after deploying the contact management system:
 * node scripts/init-contact-db.js
 */

const {
  contactRepository,
} = require('../src/lib/repositories/contact.repository');

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  try {
    console.log('📊 Creating indexes for contacts collection...');
    await contactRepository.createIndexes();
    console.log('✅ Indexes created successfully!\n');

    console.log('📈 Fetching initial statistics...');
    const stats = await contactRepository.getStats();
    console.log('📊 Current Database Statistics:');
    console.log('--------------------------------');
    console.log(`Total Contacts: ${stats.total}`);
    console.log(`\nBy Status:`);
    console.log(`  - New: ${stats.byStatus.new}`);
    console.log(`  - Read: ${stats.byStatus.read}`);
    console.log(`  - Replied: ${stats.byStatus.replied}`);
    console.log(`  - Archived: ${stats.byStatus.archived}`);
    console.log(`  - Spam: ${stats.byStatus.spam}`);
    console.log(`\nRecent Activity:`);
    console.log(`  - Today: ${stats.todayCount}`);
    console.log(`  - This Week: ${stats.weekCount}`);
    console.log(`  - This Month: ${stats.monthCount}`);
    console.log('--------------------------------\n');

    console.log('✨ Database initialization complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Test the contact form submission');
    console.log('2. Access admin panel at /admin/contacts');
    console.log('3. Configure email settings in .env if not done already');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    console.error('\nTroubleshooting:');
    console.error('1. Check MongoDB connection string in .env');
    console.error('2. Ensure MongoDB is running and accessible');
    console.error('3. Verify network connectivity to MongoDB');
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
