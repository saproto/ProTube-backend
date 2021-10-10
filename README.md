# ProTube
The ProTube project of SaProto contains of three sub-projects;
* Local Client
* Backend
* Vue-remote

There is also a folder named soundlibrary which is present for soundboard development and contains a few mp3 files

## Local Client
This is an electron application that connects to the backend through a socket connection to display the remote authentication code and to play sounds from the soundboard.

## Backend
This is the brains of the entire protube application which manages the playlist, generates codes, is the endpoint of the remote. etc

## Vue-remote
This is a vue 3 project of the remote with tailwindcss for its styling