# 💰 didibudget-frontend

See this application in action here: https://didibudget.netlify.app  
[![Netlify Status](https://api.netlify.com/api/v1/badges/15c34301-7788-44d1-a36c-015b5ca94baa/deploy-status)](https://app.netlify.com/sites/didibudget/deploys)

This is an app to manage your money.
The project is splitted on two repositories: one for the backend and one for the frontend application.

This repository is for the frontend and is intended to work with [the backend](https://github.com/didaquis/didibudget-backend)

![preview_01](./docs-and-assets/preview_01.png)  

![preview_02](./docs-and-assets/preview_02.png)  

![preview_03](./docs-and-assets/preview_03.png)  


### 📝 Frontend Requirements
* Backend must be running
* Node.js 24.14 or higher

### 📚 How to run the application?
* Use the command: `npm install`.
* Configure the application:
  * Duplicate the configuration file `_env` and rename it as `.env`
  * Edit the file `.env`
* Then use: `npm run dev`. 

### 🚀 How to deploy?
* Use the command: `npm install --production`.
* Make sure you have the correct environment vars configuration on the `.env` file.
* Then use `npm run build` to create a production bundle. This bundle will be created in the `./dist` folder.
* The content of `./dist` folder is ready to be deployed to production.

**Do you need help with `.env` file?** 

Don't worry, here you have a guide:

| Key | Description |
|-----|-------------|
| VITE_PROTOCOL | Protocol to communicate with backend. Set http or https |
| VITE_HOST | Host of backend. An IP or domain |
| VITE_PORT | Port of backend |
| VITE_GRAPHQL | Endpoint of GraphQL API |

### 💻 Tricks for development
* Run app in dev mode: `npm run dev`
* Run the linter: `npm run lint`
* Run the test: `npm run test`
