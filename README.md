# HUNGRY

A sophisticated culinary marketplace where vendors showcase and sell their delectable creations, providing customers with the opportunity to indulge in a wide array of culinary delights.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in your backend folder.

`MYSQL_PASSWORD` : Enter your mysql password

`STRIPE_PUBLIC_KEY` : Get your stripe public key from Stripe

`STRIPE_PRIVATE_KEY` : Get your stripe public key from Stripe

`SECRET` : Type any random string of characters


## Pre-requisites

Create a database named **food_ordering_site** in your mysql. Create an account in Stripe.
## Run Locally

Clone the project

```bash
  git clone https://link-to-project
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

- Secure encrypted authentication.
- Sellers can add / modify price / delete their menu items.
- Sellers can see the feedbacks and orders given to them.
- Users can add / modify quantity / delete their orders and carts.
- Users can give feedbacks to the sellers and able to see thir past orders.
- Users will be able to pay using stripe payment.


## Tech Stack

**Client:** Next.JS, TailwindCSS, Mantine, Typescript

**Server:** Node, Express, Sequelize ORM

**Database:** MySQL


## Deployment

To deploy this project run

```bash
  npm run buid
  npm run start
```


## Running Tests

To run tests, run the following command

```bash
  npm run lint
```

