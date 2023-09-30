# Node Ecommerce API

Express server project equipped with user authentication, database connectivity, and essential API features.

## Hosted Project

_Since it is hosted on a free tier, it might take a while to spin up. Thank you for your patience._

**https://ecommerce-api-node-qep6.onrender.com/**

## Technologies Used

- Node.js
- Express.js
- MongoDB

## Features

- **Middleware Setup**: Configure middleware for handling JSON data, handling 404 errors, and managing errors using
  the 'express-async-errors' package.
- **User Authentication**: Implement user authentication and authorization, including user registration, login, logout
  routes and role-based authorization.
- **Password Handling**: Securely manage user passwords using bcrypt for hashing and salting.
- **JSON Web Tokens (JWT)**: Utilize JWT for token-based authentication and authorization, via cookies.
- **User Routes**: Set up routes for managing user-related operations, such as retrieving all users, getting a single
  user, updating user information, and changing passwords.
- **Product Management**: Create a product model and associated CRUD operations for managing products, including image
  uploads.
- **Review Management**: Implement a review model with CRUD operations for user reviews of products.
- **Order Management**: Develop an order model with functionalities for creating, updating, and retrieving orders,
  including order history for users.

## Installation

1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Create a `.env` file and add the following environment variables:
    - `MONGO_URL`: MongoDB connection string
    - `JWT_SECRET`: Secret key for JWT
    - `JWT_LIFETIME`: Lifetime of JWT (e.g., 1d for 1 day)
4. Start the application using `npm start`.
5. Access the application at `http://localhost:5000`.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.
