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
This should start the project on localhost:3000. The screen can be found at /protube/screen and the remote at /protube/remote.

### CORS errors
In the event of cors errors this can be modified at protube.js line 34

### Dotenv
###### CLIENT_IDENTIFIER
Identification code for the local client (the electron application)
###### YOUTUBE_MAX_DURATION
Limit for the duration of the youtube videos that can be added to the queue
###### API_KEY
Key used to check the api authentication with, bearer token authorisation is used

