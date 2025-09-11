# 🌎 WanderLust - Travel Accommodation Platform

## 📖 Overview

WanderLust is a comprehensive travel accommodation platform inspired by Airbnb. It allows travelers to discover, book, and list unique accommodations around the world. With an intuitive interface and robust features, WanderLust connects travelers with hosts to create memorable travel experiences.

## ✨ Features

### 🏠 Accommodation Listings

- **Browse Listings**: Explore diverse accommodations categorized by type (Trending, Rooms, Mountains, Castles, etc.)
- **Detailed Listings**: View comprehensive property information, including descriptions, amenities, and pricing
- **Interactive Maps**: See exact property locations using MapBox integration with custom markers
- **Image Galleries**: High-quality images for each property

### 🔍 Search & Filters

- **Advanced Search**: Filter by location, country, and price range
- **Category Filters**: Browse properties by specific categories
- **Search Results**: View summarized search results with filters applied

### 👤 User Management

- **User Authentication**: Secure signup and login functionality
- **OAuth Integration**: Login with Google and GitHub accounts
- **User Profiles**: Manage personal information and listings
- **Authorization**: Role-based access control for listing management

### ⭐ Reviews & Ratings

- **Property Reviews**: Leave and read reviews for accommodations
- **Rating System**: Rate properties on a 5-star scale
- **Owner Responses**: Property owners can engage with reviews

### 📝 Listing Management

- **Create Listings**: Hosts can create and publish new property listings
- **Edit Listings**: Update property details, pricing, and availability
- **Image Upload**: Cloud-based image storage using Cloudinary
- **Geolocation**: Automatic geocoding of addresses using MapBox

### 🔐 Security

- **Authentication**: Passport.js integration for secure authentication
- **Session Management**: Express sessions with MongoDB store
- **Input Validation**: Joi schema validation for form inputs
- **Error Handling**: Custom error handling throughout the application

## 🛠️ Technologies Used

### Backend

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **Passport.js**: Authentication middleware for Node.js
- **Joi**: Schema validation library

### Frontend

- **EJS**: Embedded JavaScript templates for server-side rendering
- **Bootstrap**: Frontend CSS framework for responsive design
- **MapBox API**: Interactive maps and geocoding
- **Font Awesome**: Icons and graphics

### Cloud Services

- **Cloudinary**: Cloud storage for images
- **MongoDB Atlas**: Cloud database service (optional)

### Authentication

- **Passport Local Strategy**: Username/password authentication
- **Google OAuth 2.0**: Google login integration
- **GitHub OAuth**: GitHub login integration

### Development Tools

- **dotenv**: Environment variable management
- **connect-flash**: Flash messages for user notifications
- **method-override**: HTTP verb support for clients that don't support methods

## 📋 Installation & Setup

### Prerequisites

- Node.js (v20.18.0 recommended)
- MongoDB
- Cloudinary account
- MapBox account
- Google & GitHub OAuth credentials

### Installation Steps

1. Clone the repository

   ```bash
   git clone https://github.com/Anuraj-dev/WanderLust-Major-Project
   cd WanderLust
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   NODE_ENV=development
   ATLASDB_URL=your_mongodb_connection_string
   SECRET=your_session_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   MAP_TOKEN=your_mapbox_token
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   OAUTH_CALLBACK_HOST=http://localhost:8080
   ```

4. Initialize the database with sample data (optional)

   ```bash
   node init/index.js
   ```

5. Start the application

   ```bash
   node app.js
   ```

6. Access the application at `http://localhost:8080`

## 🏙️ Project Structure

```
├── app.js                 # Application entry point
├── cloudConfig.js         # Cloudinary configuration
├── middleware.js          # Custom middleware functions
├── schema.js              # Joi validation schemas
├── config/                # Configuration files
│   └── passport.js        # Authentication strategies
├── Controllers/           # Route controllers
│   ├── listing.js         # Listing-related controllers
│   ├── review.js          # Review-related controllers
│   ├── searchController.js # Search-related controllers
│   └── user.js            # User-related controllers
├── init/                  # Database initialization
│   ├── data.js            # Sample data
│   └── index.js           # Initialization script
├── Models/                # Mongoose models
│   ├── listing.js         # Listing model
│   ├── review.js          # Review model
│   └── user.js            # User model
├── public/                # Static assets
│   ├── css/               # Stylesheets
│   ├── images/            # Images
│   └── js/                # Client-side JavaScript
├── routes/                # Express routes
│   ├── listing.js         # Listing routes
│   ├── review.js          # Review routes
│   ├── search.js          # Search routes
│   └── user.js            # User routes
├── utils/                 # Utility functions
│   ├── expressError.js    # Custom error handler
│   └── wrapAsync.js       # Async error wrapper
└── views/                 # EJS templates
    ├── includes/          # Reusable template parts
    ├── layouts/           # Page layouts
    ├── listings/          # Listing-related pages
    ├── partials/          # Partial templates
    └── users/             # User-related pages
```

## 🖼️ Screenshots

![Uploading image.png…]()


## 🚀 Future Enhancements

- **Booking System**: Implement reservation capabilities
- **Payment Integration**: Add payment processing
- **Messaging System**: Enable direct communication between hosts and guests
- **Advanced Filters**: Enhance search functionality with more filter options
- **Wishlists**: Allow users to save favorite listings
- **Mobile App**: Develop companion mobile applications

## 👨‍💻 Contributors

- Raja (Author)

## 📄 License

This project is licensed under the ISC License.
