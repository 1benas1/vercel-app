# NFC Google Review Cards

This project is a web application for managing NFC Google review cards. It allows users to add new cards, associate them with businesses using the Google Places API, and generate review links.

## Features

- User authentication with Clerk
- Add new NFC cards with unique 5-digit codes
- Search for businesses using Google Places API
- Auto-suggest business names as you type
- Display business details and images
- Generate Google review links for selected businesses
- View and edit a list of added cards

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB account
- Google Places API key
- Clerk account

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/nfc-google-api.git
   cd nfc-google-api
   ```

2. Install dependencies for both the server and client:
   ```
   npm install
   cd client
   npm install
   cd ..
   ```

3. Set up environment variables:
   - Copy `.env.sample` to `.env` in the root directory
   - Copy `client/.env.sample` to `client/.env`
   - Fill in the environment variables in both `.env` files with your actual values:
     ```
     # Root .env file
     GOOGLE_PLACES_API_KEY=your_google_places_api_key
     MONGODB_URI=your_mongodb_connection_string

     # client/.env file
     REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
     REACT_APP_GOOGLE_PLACES_API_KEY=your_google_places_api_key
     ```

## Running the application locally

1. Start the server:
   ```
   npm start
   ```

2. In a new terminal, start the client:
   ```
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to use the application.

## Deployment to Vercel

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy the project:
   ```
   vercel
   ```

4. Follow the prompts and choose the appropriate options for your project.

5. Set up environment variables in the Vercel dashboard:
   - Go to your project settings
   - Navigate to the "Environment Variables" section
   - Add the following variables:
     - `GOOGLE_PLACES_API_KEY`
     - `MONGODB_URI`
     - `REACT_APP_CLERK_PUBLISHABLE_KEY`
     - `REACT_APP_GOOGLE_PLACES_API_KEY`

6. Deploy the project with production settings:
   ```
   vercel --prod
   ```

Your application should now be deployed and accessible via the Vercel URL provided.

## Contributing

Feel free to submit issues and pull requests to improve the application.

## License

This project is licensed under the MIT License.