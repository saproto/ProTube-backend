# Backend
This is the backend application for ProTube of SaProto.

## Installation
Open up a terminal and run 
```sh
npm install
```
To build the frontend
```sh
npm run build
```
To start the project
```sh
npm run start
```
This should start the project on localhost:3000. The screen can be found at /protube/screen and the remote at /protube/remote, the admin remote at /protube/remote/admin, the admin screen at /protube/screen/admin (with code).

### CORS errors
In the event of cors errors this can be modified at protube.js line 34

### Dotenv
###### CLIENT_IDENTIFIER
Identification code for the local client (the electron application)
###### YOUTUBE_MAX_DURATION
Limit for the duration of the youtube videos that can be added to the queue
###### API_KEY
Key used to check the api authentication with, bearer token authorisation is used


### User Authentication
At this moment there is a test user auth method that can be used for the dev environment. Run this project: https://github.com/saproto/saproto/tree/misc/protube-api 

Then set the env variable of the node project API_ENDPOINT to (most likely) https://localhost:8080/api/protube. If you can reach /api/protube/userdetails from the browser but ProTube really refuses to connect and the API_ENDPOINT is correct. You can try to change line 40 of docker-compose.yml at the laravel project by removing '127.0.0.1:'