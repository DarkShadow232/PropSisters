/**
 * Migrate uploaded images from /uploads/rentals/ to /image/Apartments/
 * and update database paths accordingly
 */

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in config.env');
  process.exit(1);
}

const Rental = require('../models/Rental');

async function migrateImages() {
  try {
    console.log('🔄 Starting image migration...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create destination directory if it doesn't exist
    const destDir = path.join(__dirname, '..', 'public', 'image', 'Apartments');
    if (!fsSync.existsSync(destDir)) {
      fsSync.mkdirSync(destDir, { recursive: true });
      console.log('✅ Created /image/Apartments directory');
    }

    // Get all properties with images
    const properties = await Rental.find({ images: { $exists: true, $ne: [] } });
    console.log(`📦 Found ${properties.length} properties with images`);

    let movedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (const property of properties) {
      let hasChanges = false;
      const newImages = [];

      for (const imagePath of property.images) {
        // Check if image is in old location
        if (imagePath.startsWith('/uploads/rentals/')) {
          const filename = path.basename(imagePath);
          const oldPath = path.join(__dirname, '..', 'public', 'uploads', 'rentals', filename);
          const newPath = path.join(destDir, filename);
          const newImagePath = `/image/Apartments/${filename}`;

          try {
            // Check if old file exists
            if (fsSync.existsSync(oldPath)) {
              // Copy file to new location
              await fs.copyFile(oldPath, newPath);
              console.log(`✅ Moved: ${filename}`);
              movedCount++;
              
              // Delete old file
              await fs.unlink(oldPath);
            } else {
              console.log(`⚠️  Old file not found: ${filename} (updating path anyway)`);
            }
            
            newImages.push(newImagePath);
            hasChanges = true;
          } catch (err) {
            console.error(`❌ Error migrating ${filename}:`, err.message);
            errorCount++;
            // Keep old path if migration fails
            newImages.push(imagePath);
          }
        } else {
          // Already in new format or external URL
          newImages.push(imagePath);
        }
      }

      // Update database if there were changes
      if (hasChanges) {
        try {
          await Rental.findByIdAndUpdate(property._id, { images: newImages });
          console.log(`✅ Updated property: ${property.title}`);
          updatedCount++;
        } catch (err) {
          console.error(`❌ Error updating property ${property.title}:`, err.message);
          errorCount++;
        }
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   Images moved: ${movedCount}`);
    console.log(`   Properties updated: ${updatedCount}`);
    console.log(`   Errors: ${errorCount}`);

    // Clean up old directory if empty
    const oldDir = path.join(__dirname, '..', 'public', 'uploads', 'rentals');
    try {
      const files = await fs.readdir(oldDir);
      if (files.length === 0) {
        await fs.rmdir(oldDir);
        console.log('✅ Removed empty /uploads/rentals directory');
      }
    } catch (err) {
      // Directory might not exist, ignore
    }

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateImages();

