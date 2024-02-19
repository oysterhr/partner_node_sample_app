# Oyster Embedded Partner API Node App

This is a Node.js sample application to demonstrate how to work with Oyster Embedded Partner API. Here's how you can get the project running on your local machine for development and testing purposes.

## Prerequisites

Please follow the detailed documentation: [https://docs.oysterhr.com](https://docs.oysterhr.com) for the required **Initial Setup**.

## Cloning the Repository

First, you'll need to clone the repository to your local machine. Open a terminal and run the following command:

```sh
git clone https://github.com/oysterhr/partner-node-sample-app.git

cd partner-node-sample-app
```

## Setting Up the Environment

Once you have cloned the repository, you'll need to set up the environment variables. You can find an example in the `.env.example` file. Create a new file named `.env` in the root directory and copy the contents of `.env.example` into it.

```sh
cp .env.example .env
```

Then, fill in the values for the following variables:

```js
// .env
OYSTER_CLIENT_ID= // Your Oyster client ID
OYSTER_CLIENT_SECRET= // Your Oyster client secret
OYSTER_AUTHORIZATION_URL= // The authorization URL
OYSTER_REDIRECT_URL= // The redirect URL configured for your Oyster Developer Application.
```

### Installing Dependencies

Next, install the project dependencies by running:

```sh
npm install
```

### Setting Up the Database

The application uses SQLite for the database. To set up the database, run the following command:

```sh
npx sequelize-cli db:migrate
```

This will create a new SQLite database file in the root directory as specified in the `config/config.json` file.

### Running the Application

To start the application, run:

```sh
npm start
```

This will start the server on the default port `3000`. You can access the application by visiting http://localhost:3000 in your web browser.

## Additional Information

- `config/config.json`: This file is used to configure the database settings for different environments (development, test, and production). It uses SQLite as the database adapter and sets up the database file paths for each environment.
- `routes/partner.js`: Handles the `/session` route that finds the client by the client_id, makes a POST request to the OysterHR Embedded API to create a new session using the client's access token, and then redirects to an OysterHR URL with the new session token.
- `routes/apiAuth.js`: Handles OAuth authorization callbacks and token refreshes. Handles the follwoing routes:
  - `/callback`: Receives an authorization code from the OysterHR Embedded API, exchanges it for access and refresh tokens, updates the client record with these tokens, and then redirects to the root URL.
  - `/refresh_token`: Uses the stored refresh token to request a new access token when the current one expires, updates the client record, and redirects to the root URL.
- The `app.js` file sets up the express application, middleware, and routes.
- The `client.js` file defines the Sequelize model for the Client table. The table has the following fields:
  1. `client_id`
  2. `refresh_token`
  3. `access_token`
- `.env.example`: An example file that lists the environment variables required for the application to function. These variables include the client ID, client secret, authorization URL, and the redirect URL for OAuth callbacks.

For further customization and development, refer to the respective files and directories in the project. We have left helpful comments with the files to help explain their respective funcationality.

## Notes

1. Make sure to keep your `.env` file secure and do not commit it to version control.
2. Within `routes/partner.js` file, after receiving new Session Token, you should redirect to the Oyster Platform via the route: `https://app.oysterhr.com/embedded/transfer?token{PLACE THE GENERATE TOKEN HERE}`
