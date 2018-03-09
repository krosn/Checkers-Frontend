# Checkers: The Game 👑 Frontend docs
Made with [React](https://reactjs.org/)

## Components

### Main

This component encompesses the entire app, laying out the route. This route is very simple, containing only `'/'` and `'/game'`.

### Home

This component is the mainmenu / homepage. This is what the user sees before starting a game.

### Game

This component implements the game of checkers itself.
Here some noteable functons:

- `receiveMove()` - This is a callback function fired by the Socket framework. It will be called whenever a move has been made (by either opponent). 

- `userJoined()` - This is a also callback function fired by the Socket framework. It will be called whenever a user joins the game (including the client). 

### Socket

This component implements the client-side [Socket.io](https://socket.io/) framework.
Here some noteable functons:

- `subscribeToGame()` - This function takes in the callback functions `receiveMove()` and `userJoined()` and fires them as indicated above.

- `sendMove()` - This function emits a message to the Socket component, this contains a string with move data.

## Socket Callback Functions

- 


## TODOs 🛠
