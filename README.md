<p align="center">
  <img src="public/images/favicon.svg" alt="WanderLust logo" width="88" height="88" />
</p>

<h1 align="center">WanderLust</h1>

<p align="center">
  An Airbnb-style accommodation site built with Express, MongoDB and EJS.<br />
  Browse stays by city, country or price, and list your own with a map pin and photos.
</p>

<p align="center">
  <a href="https://wanderlust.raja-dev.me">Live demo</a>
  ·
  <a href="#installation">Installation</a>
  ·
  <a href="#environment-variables">Environment variables</a>
</p>

WanderLust is a listing site for places to stay. Visitors search by city, country and maximum price, then open a listing to see its photos, its map and its reviews. Signed-in users create listings, leave star ratings, and edit or delete only the listings they own.

It is one server-rendered Express app. Pages are EJS templates, so there is no frontend build step. It needs a MongoDB database, a Cloudinary account for photo uploads, and a Mapbox token for maps and geocoding. Sign-in with Google or GitHub needs an OAuth app from each provider.

## What you get

- **Listings on a real map.** Saving a listing sends its location and country to the Mapbox geocoding API and stores the first match as a GeoJSON point. The listing page draws that point on a Mapbox map with a custom marker.
- **Photos on Cloudinary.** Uploads go through multer-storage-cloudinary into a `WanderLust_DEV` folder. The app accepts PNG and JPEG files.
- **Search by city, country and price.** The search matches the city as a case-insensitive pattern, the country exactly, and the price as a ceiling. It returns up to 50 listings. With no matches, it opens a notice page instead.
- **Ten categories on the home page.** Trending, Rooms, Top Cities, Mountains, Castles, Pools, Camping, Farms, Arctic and Beach each filter the listings through `?category=`.
- **Owners control their own listings.** The edit and delete routes check that the signed-in user owns the listing. Joi validates listing and review input before it reaches the database.
- **Three ways to sign in.** Username and password use passport-local-mongoose. Google and GitHub sign-in reuse an existing account with the same email, or create one without a password. Sessions last seven days and are stored in MongoDB through connect-mongo.
- **Reviews with star ratings.** Signed-in users rate a listing from 1 to 5 and leave a comment. Only the author of a review can delete it.

## Installation

You can run WanderLust with Node.js or with Docker Compose. The Node route is quicker to edit and restart. Compose starts MongoDB and Mongo Express for you.

| Method | Needs | Starts on |
| --- | --- | --- |
| Node.js | Node.js 20 or newer, and a MongoDB database | Port 8080 |
| Docker Compose | Docker and a `.env` file | Ports 8080, 8081 and 27017 |

Whichever route you pick, you need a Cloudinary account, a Mapbox access token and, for social sign-in, a Google and a GitHub OAuth app. Put their values in `.env`, as listed in [Environment variables](#environment-variables).

### Run locally

```sh
git clone https://github.com/Anuraj-dev/WanderLust-Major-Project
cd WanderLust-Major-Project
npm install
cp .env.example .env
```

Fill in `.env`. Then load the sample data and start the server:

```sh
node init/index.js
npm start
```

The app listens on http://localhost:8080. The seed script deletes every existing listing before it inserts 29 samples, so run it only on a database you can empty. The samples have no category, so the category filters show nothing for them. They also belong to a fixed user ID, so no account you create can edit or delete them.

### Run with Docker

```sh
docker compose -f wanderlust.yaml up --build
```

Compose reads `wanderlust.yaml`, so pass `-f`. It starts the app on port 8080, MongoDB on 27017 and Mongo Express on 8081. Set `MONGODB_USERNAME` and `MONGODB_PASSWORD` in `.env`. Then point `ATLASDB_URL` at the bundled database with `mongodb://<MONGODB_USERNAME>:<MONGODB_PASSWORD>@mongo:27017`.

### Deploy to Vercel

The repo includes `vercel.json`, which routes app requests to `api/index.js`. Add the variables from the table below in your Vercel project settings. Set `OAUTH_CALLBACK_HOST` to your Vercel URL.

## Environment variables

Copy `.env.example` to `.env` and fill it in. Outside production, the app loads `.env` with dotenv. In production, set the variables on your host instead.

| Variable | Purpose |
| --- | --- |
| `MONGODB_URL` or `ATLASDB_URL` | MongoDB connection string. If both are set, `MONGODB_URL` wins. The app always uses the `wanderlust` database. |
| `SECRET` | Signs the session cookie. Use a long random string. |
| `MAP_TOKEN` | Mapbox access token for the maps and for geocoding. The token reaches the browser, so restrict it to your domains in Mapbox. |
| `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` | Cloudinary account for listing photos. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth app. |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | GitHub OAuth app. |
| `OAUTH_CALLBACK_HOST` | Base URL the providers return to, such as `http://localhost:8080`. Register `/auth/google/callback` and `/auth/github/callback` under it in each provider. |
| `NODE_ENV` | Set to `production` to mark the session cookie secure and trust the reverse proxy. |
| `PORT` | Port to listen on. Defaults to 8080. |

## Known gaps

There is no booking, payment, messaging or wishlist yet. `npm test` is a placeholder that exits with an error, so the project has no automated tests.

## Credits

Built by Raja. The sample listings use photos from Unsplash, and the search form uses flags from flagcdn.com.
