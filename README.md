# HUNGRY

A sophisticated culinary marketplace where vendors showcase and sell their delectable creations, providing customers with the opportunity to indulge in a wide array of culinary delights.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in your backend folder.

`MYSQL_PASSWORD`: Enter your MySQL password

`STRIPE_PUBLIC_KEY`: Get your stripe public key from Stripe

`STRIPE_PRIVATE_KEY`: Get your stripe public key from Stripe

`SECRET`: Type any random string of characters for JWT


## Pre-requisites

Create a database named **food_ordering_site** in your MySQL. Create an account in Stripe for payments.

## Run Locally

Clone the project

```bash
  git clone https://github.com/Code-Challengers-hacks/Hungry.git
```

Go to the project directory

```bash
  cd FoodOrderingApp
```

Install dependencies

```bash
  npm install
```

Go to the backend directory

```bash
  cd backend
```

Start the server

```bash
  npm run dev
```

Go to the frontend directory

```bash
  cd frontend
```

Start the frontend

```bash
  npm run dev
```

Your site will be running in **localhost:3000** and server in **localhost:4000**
## Features

- Robust and encrypted authentication ensures secure access.
- Sellers can add, modify prices, or remove items from their menu.
- Sellers can conveniently view feedback and order details provided by customers.
- Users can add, adjust quantities, or remove items from their orders and shopping carts.
- Users can provide feedback to sellers and access their order history.
- Users can make payments seamlessly through the Stripe payment gateway.


## Tech Stack

**Client:** Next.JS, TailwindCSS, Mantine, Typescript

**Server:** Node, Express, Sequelize ORM

**Database:** MySQL

