# Full Stack E-commerce Application

A complete e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js) with Stripe payment integration.

## Features

- **User Authentication**: Register, login, and profile management with JWT
- **Product Catalog**: Browse products with images, descriptions, and pricing
- **Shopping Cart**: Add/remove items, update quantities, persistent cart state
- **Checkout Process**: Shipping address collection and payment processing
- **Order Management**: View order history and order details
- **Payment Integration**: Secure payment processing with Stripe (test mode)
- **Responsive Design**: Modern UI built with Tailwind CSS

## Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Stripe Elements** for payment processing

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Stripe** for payment processing
- **CORS** for cross-origin requests

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Stripe account (for payment processing)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd fullstack-ecommerce
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Running the Application

### Development Mode

1. **Start the backend server:**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

2. **Start the frontend development server:**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

### Production Mode

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Start the backend in production:**
```bash
cd backend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products/seed` - Seed sample products

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/myorders` - Get user orders
- `POST /api/orders/:id/pay` - Create payment intent
- `PUT /api/orders/:id/pay` - Update order to paid

## Stripe Test Cards

For testing payments, use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Expiry**: Any future date
- **CVC**: Any 3 digits

## Deployment

### Backend (Heroku)
1. Create a Heroku account and install Heroku CLI
2. Create a new Heroku app
3. Set environment variables in Heroku dashboard
4. Deploy using Git:
```bash
heroku git:remote -a your-app-name
git push heroku main
```

### Frontend (Netlify)
1. Create a Netlify account
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Set environment variables in Netlify dashboard

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add it to your environment variables

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_super_secret_jwt_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
PORT=5000
```

### Frontend (.env)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Project Structure

```
fullstack-ecommerce/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── orders.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Header.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── screens/
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── ProductScreen.jsx
│   │   │   ├── CartScreen.jsx
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── RegisterScreen.jsx
│   │   │   ├── ProfileScreen.jsx
│   │   │   ├── ShippingScreen.jsx
│   │   │   ├── PaymentScreen.jsx
│   │   │   ├── PlaceOrderScreen.jsx
│   │   │   ├── OrderScreen.jsx
│   │   │   └── OrderListScreen.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
