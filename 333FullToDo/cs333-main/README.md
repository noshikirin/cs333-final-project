# SOU CS 333 Frontend

This project was bootstrapped with [Create Vite](https://vite.dev/guide/).

## Setup

### Initialize the project

Open a terminal window in the root of the project and run the following command:

```shell
npm install
```

This will install all of the dependencies for the project. The dependencies are listed in the `package.json` file and are located in the `node_modules` folder.

### .env File

Create a `.env` file in the root of the project that contains the following:

```
VITE_PORT=3001
```

It is important that the name of the port variable is `VITE_PORT`. This is because Vite uses the `VITE_` prefix for environment variables.

Your Vite install created a file in the root of your project named `vite.config.js`. Ensure that this file looks like the following:

```javascript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())}
  return {
    plugins: [react()],
    server: {
      port: parseInt(process.env.VITE_PORT),
    },
  }
})
```

The `process.env` line and the `port` line are important because they load the environment variables from the `.env` file into the process environment.

## Available Scripts

### Run the project in development mode

This project will attempt to connect to the backend API when it first starts. Ensure that the backend has been started before you start the frontend.

To run this frontend project, you can use the following script:

```shell
npm run dev
```

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will automatically reload in the browser when you make changes to the code.\
You may also see any lint errors in the console.


### Build the project for production

```shell
npm run build
```

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

To run the production build locally, you can use the following script:

```shell
npm run preview
```
