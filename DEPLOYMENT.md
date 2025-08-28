# Deployment Guide

This guide will walk you through deploying your e-commerce application to production.

## Prerequisites

- GitHub account
- Heroku account (for backend)
- Netlify account (for frontend)
- MongoDB Atlas account (for database)
- Stripe account (for payments)

## Step 1: Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new project

2. **Create a Cluster**
   - Choose the free tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Select "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Step 2: Stripe Setup

1. **Create Stripe Account**
   - Go to [Stripe](https://stripe.com)
   - Sign up for an account
   - Complete the account setup

2. **Get API Keys**
   - Go to "Developers" → "API keys"
   - Copy your "Publishable key" and "Secret key"
   - Keep these safe - you'll need them for deployment

## Step 3: Backend Deployment (Heroku)

1. **Install Heroku CLI**
   ```bash
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="your_mongodb_connection_string"
   heroku config:set JWT_SECRET="your_super_secret_jwt_key"
   heroku config:set STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   ```

5. **Deploy to Heroku**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **Verify Deployment**
   ```bash
   heroku open
   ```
   You should see "API is running..." message.

## Step 4: Frontend Deployment (Netlify)

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Sign up/Login with your GitHub account
   - Click "New site from Git"
   - Choose your repository

3. **Configure Build Settings**
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
   - Base directory: (leave empty)

4. **Set Environment Variables**
   - Go to "Site settings" → "Environment variables"
   - Add: `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_test_your_stripe_publishable_key`

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete

## Step 5: Update Frontend API URLs

After deploying the backend, you need to update the frontend to use the production API URL.

1. **Update API Base URL**
   In `frontend/src/context/AuthContext.jsx`, replace:
   ```javascript
   // Change from:
   const { data } = await axios.get('http://localhost:5000/api/auth/profile');
   
   // To:
   const { data } = await axios.get('https://your-heroku-app.herokuapp.com/api/auth/profile');
   ```

2. **Create Environment Variable**
   Add to your Netlify environment variables:
   - `VITE_API_URL` = `https://your-heroku-app.herokuapp.com`

3. **Update All API Calls**
   Replace all hardcoded `http://localhost:5000` with `import.meta.env.VITE_API_URL`

## Step 6: Test the Application

1. **Test User Registration/Login**
   - Go to your Netlify URL
   - Try registering a new user
   - Test login functionality

2. **Test Product Seeding**
   - Click "Add Sample Products" on the home page
   - Verify products appear

3. **Test Shopping Cart**
   - Add items to cart
   - Verify cart persistence

4. **Test Checkout Process**
   - Go through the complete checkout flow
   - Use Stripe test card: `4242 4242 4242 4242`
   - Verify order creation and payment processing

## Step 7: Custom Domain (Optional)

1. **Add Custom Domain to Netlify**
   - Go to "Domain settings" in Netlify
   - Click "Add custom domain"
   - Follow the DNS configuration instructions

2. **Add Custom Domain to Heroku**
   ```bash
   heroku domains:add yourdomain.com
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your Heroku app URL is in the CORS configuration
   - Check that the frontend is making requests to the correct backend URL

2. **MongoDB Connection Issues**
   - Verify your MongoDB Atlas connection string
   - Check that your IP is whitelisted in MongoDB Atlas

3. **Stripe Payment Issues**
   - Ensure you're using test keys, not live keys
   - Verify the Stripe publishable key is correct
   - Check Stripe dashboard for any errors

4. **Build Failures**
   - Check Netlify build logs for errors
   - Ensure all dependencies are properly installed
   - Verify environment variables are set correctly

### Environment Variables Checklist

**Backend (Heroku):**
- [ ] `MONGODB_URI`
- [ ] `JWT_SECRET`
- [ ] `STRIPE_SECRET_KEY`

**Frontend (Netlify):**
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] `VITE_API_URL` (if using custom API URL)

## Monitoring and Maintenance

1. **Set Up Logging**
   - Use Heroku logs: `heroku logs --tail`
   - Set up error monitoring with services like Sentry

2. **Database Monitoring**
   - Monitor MongoDB Atlas dashboard
   - Set up alerts for connection issues

3. **Payment Monitoring**
   - Monitor Stripe dashboard for failed payments
   - Set up webhook endpoints for payment events

4. **Performance Monitoring**
   - Use Netlify analytics
   - Monitor Heroku dyno performance

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to Git
   - Use strong, unique secrets for JWT and database

2. **HTTPS**
   - Both Netlify and Heroku provide HTTPS by default
   - Ensure all API calls use HTTPS

3. **CORS**
   - Configure CORS to only allow your frontend domain
   - Remove wildcard CORS in production

4. **Rate Limiting**
   - Consider adding rate limiting to your API endpoints
   - Use services like Cloudflare for additional protection

## Cost Optimization

1. **MongoDB Atlas**
   - Free tier includes 512MB storage
   - Monitor usage to avoid unexpected charges

2. **Heroku**
   - Free tier is no longer available
   - Basic dyno starts at $7/month
   - Consider alternatives like Railway or Render

3. **Netlify**
   - Free tier includes 100GB bandwidth/month
   - Sufficient for most small to medium applications

4. **Stripe**
   - No fees for test mode
   - Live mode has standard processing fees

## Next Steps

1. **Add Analytics**
   - Google Analytics for user behavior
   - Stripe analytics for payment insights

2. **Implement Email Notifications**
   - Order confirmations
   - Password reset emails

3. **Add Admin Panel**
   - Product management
   - Order management
   - User management

4. **Performance Optimization**
   - Image optimization
   - Code splitting
   - Caching strategies

5. **SEO Optimization**
   - Meta tags
   - Sitemap generation
   - Structured data

Your e-commerce application is now deployed and ready for production use!
