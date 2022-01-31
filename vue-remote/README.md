# Vue remote
This is the vue 3 project for the remote of ProTube

## Installation
Open up a terminal and run 
```sh
npm install
```
To start the project for development
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

