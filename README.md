# React-Websocket-Game

link: morpline.github.io/RWG/

## Setup:

### for github pages:

run "npx vite build" in the frontend directory

you'll get a dist folder,

add your repo root folder to the urls within the html file
(like "/assets/index.js" to "/RWG/index.js")

###### I also added /RWG/ to the App.jsx file (line 59). It may not be necessary, but it's there. 

### backend

run "npm start" in the directory, then point the frontend to it (connect.jsx, line 25; before building)

## Game Data

Armors are hardcoded, you'll have to mess with the source to make changes.

Weapons, though, are all in constants.js.