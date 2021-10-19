# Vue remote
This is the vue 3 project for the remote of ProTube

## Installation
Open up a terminal and run 
```sh
npm install
```
To start he project for development
```sh
npm run serve
```
This should start the remote at localhost:8080

## Production
To compile the project for production
```sh
npm run build
```
### Dotenv
#### Development
This env is used during the development of the remote
###### NODE_ENV=development
Defines the dotenv file
###### VUE_APP_SOCKET_ADDRESS
Address of which it can connect with to the backend (for dev most likely http://localhost:3000)
###### VUE_APP_PUBLIC_PATH=""
Needs to stay empty, used in the production env

#### Production
This env is used during the compilation of the remote
###### NODE_ENV=production
Defines the dotenv file
###### VUE_APP_SOCKET_ADDRESS
Socket address used in production (auto compiles that in the code during npm run build)
###### VUE_APP_PUBLIC_PATH
This holds the url path of where itll end up so it can load in the proper paths for files.
If the project will run at domain.com/project/remote, set this env line to: /project/remote
###### VUE_APP_OUTPUT_DIR
This is the path where the project can dump the complied project. During development of protube this was set to: "../backend/public/remote" so the project would be placed inside the backend folder
