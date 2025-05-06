const path = require("path");
const fs = require("fs");

// Determine project root directory (going up one level from init folder)
const projectRoot = path.join(__dirname, "..");

// Try multiple possible .env file locations
function loadEnvFile() {
  const possiblePaths = [
    path.join(__dirname, ".env"), // If .env is in the init directory
    path.join(projectRoot, ".env"), // If .env is in project root
    path.join(process.cwd(), ".env"), // If script is run from a different directory
  ];

  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      console.log(`Found .env file at: ${envPath}`);
      require("dotenv").config({ path: envPath });
      return true;
    }
  }
  return false;
}

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  const envLoaded = loadEnvFile();
  if (!envLoaded) {
    console.warn("Warning: No .env file found. Using default configuration.");
  }
}

const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../Models/listing");

// Fallback mechanism for database connection
let dbUrl, db;

// Try multiple possible database connection configurations with fallbacks
if (process.env.ATLASDB_URL) {
  dbUrl = process.env.ATLASDB_URL;
  db = process.env.DB_NAME || "wanderlust";
  console.log("Using Atlas DB connection from environment variables");
} else {
  console.log(
    "ATLASDB_URL not found in environment variables, using local MongoDB"
  );
  // dbUrl = "mongodb://127.0.0.1:27017/wanderlust";
  // db = "wanderlust";
}

// Connection with enhanced error handling
async function connectToDatabase() {
  try {
    await mongoose.connect(dbUrl, { dbName: db });
    console.log("Connected to DB successfully");
    return true;
  } catch (err) {
    console.error("Database connection error:", err.message);

    // If connection fails and we were using Atlas, try local as fallback
    if (dbUrl !== "mongodb://127.0.0.1:27017/wanderlust") {
      console.log("Attempting to connect to local MongoDB as fallback...");
      try {
        await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust", {
          dbName: "wanderlust",
        });
        console.log("Connected to local DB successfully");
        return true;
      } catch (localErr) {
        console.error(
          "Local database connection also failed:",
          localErr.message
        );
        return false;
      }
    }
    return false;
  }
}

// Initialize database with data
const initDB = async () => {
  try {
    // First connect to the database
    const connected = await connectToDatabase();
    if (!connected) {
      console.error("Could not initialize data: Database connection failed");
      process.exit(1);
    }

    // Delete existing listings
    await Listing.deleteMany({});
    console.log("Cleared existing listings");

    // Add required fields to each listing
    initdata.data = initdata.data.map((obj) => ({
      ...obj,
      owner: "6819d3b0442039f175ce63ec",
      geometry: {
        type: "Point",
        coordinates: [
          Math.random() * 360 - 180, // Random longitude between -180 and 180
          Math.random() * 180 - 90, // Random latitude between -90 and 90
        ],
      },
    }));

    // Insert the data
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized successfully");
  } catch (err) {
    console.error("Error during database initialization:", err);
    process.exit(1);
  }
};

// Run initialization
initDB()
  .then(() => {
    console.log("Database initialization process complete");
  })
  .catch((err) => {
    console.error("Unhandled error during initialization:", err);
    process.exit(1);
  });
