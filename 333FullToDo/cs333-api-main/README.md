# SOU CS 333 Backend API

This API was created with Node, ExpressJS and MongoDB. 

## Setup

### Node Version

Ensure that you are running Node v22.11.0

### Initialize the project

Open a terminal window in the root of the project and run the following command:

```shell
npm install
```

This will install all of the dependencies for the project. The dependencies are listed in the `package.json` file and are located in the `node_modules` folder.

### .env File

Create a `.env` file in the root of the project that contains the following:

```
PORT: 3000
NODE_ENV: development
DB_CONNECT: mongodb://localhost:27017/cs333
```

Ensure that your MongoDb instance is running on port 27017. If it's not, use your port number in the `DB_CONNECT` variable.

### MongoDB

On your local Mongo instance, create a new database named 'cs333'. It can be empty when you first start the server. 

## Available Scripts

### Run the project in development mode

In the project directory, you can run:

```shell
npm run dev
```
It will report that it's running on port 3000 in development mode.\
The server will also report whether it has connected to the MongoDB database. 

This command runs the server using `nodemon`. The server will automatically restart when it 
detects a change to the code. 

### Run the project in production mode

In the project directory, you can run:

```shell
npm start
```

Runs the app.\
It will report that it's running on port 3000 in production mode.\
The server will also report whether it has connected to the MongoDB database. 
