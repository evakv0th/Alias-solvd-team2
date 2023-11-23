# API documentatin for "Alias game"

## Description
This project is a multiplayer game build with Node.js.
Alias is a word-guessing game where players form teams. Each team takes turns where one member describes a word and others guess it. The game includes a chat for players to communicate and a system to check for similar words.

### Objective
Teams try to guess as many words as possible from their teammates' descriptions.

### Turns
Each turn is timed. Describers cannot use the word or its derivatives.

### Scoring
Points are awarded for each correct guess. Similar words are checked for validation.

### End Game
The game concludes after a predetermined number of rounds, with the highest-scoring team winning.

## Content:

1. [Technologies](#technologies)
2. [Endpoints:](#endpoints)
   - [Endpoints: auth/signUp](#signUp)
   - [Endpoints: auth/signIn](#signIn)
   - [Endpoints: game/rooms](#listOfRooms)
   - [Endpoints: game/rooms](#createRoom)
   - [Endpoints: game/rooms/:roomId](#deleteGame)
   - [Endpoints: game/rooms/:roomId/join](#joinGame)
   - [Endpoints: game/words](#getWords)
   - [Endpoints: game/turns](#guessWord)
   - [Endpoints: chat/:roomId/messages](#chatHistory)
   - [Endpoints: chat/:roomId/messages](#sendMessage)
   - [Endpoints: word/check](#wordCheck)
3. [Database:](#database)
   - [Database: userModel](#userModel)
   - [Database: gameModel](#gameModel)
   - [Database: chatModel](#chatModel)
4. [Security](#security)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Future Enhancements](#futureEnhancements)
8. [FAQ](#faq)
9. [Conclusion](#conclusion)

## Technologies <a name="Technologies"></a>
- Backend: NodeJs (Express)
- Database: CouchDB
- Testing: Jest
- Containerization: Docker

## Endpoints <a name="endpoints">

### Endpoint `app/auth/signUp`: <a name="signUp"></a>
- Request: `POST app/auth/signUp` - Create new user.
   - No parameters required.

   - Body:
   ```
   {
      "userName": "userName",
      "password": "password"
   }
   ```

- Response:
   - Status: 201 Created
   -Body:
   ```
   { 
      "message": 'User registered successfully' 
   }
   ```


### Endpoint `app/auth/signIn`: <a name="signIn"></a>
- Request: `POST app/auth/signIn` - Authenticates user.
   - No parameters required.

- Response:
   - Status: 200 OK
   - Body:
   ```
   { 
      "message":  accessToken, refreshToken 
   }   
   ```

### Endpoint `app/game/rooms`: <a name="listOfRooms"></a>
- Request: `GET /app/rooms` - Get a list of available game rooms.
   - No parameters required.

   - Response:
    - Status: 200 OK
    - Body:
      ```
      {
        "rooms": [
          {
            "roomId": "12345",
            "players": ["user1", "user2"],
            "maxPlayers": 4
          },
          {
            "roomId": "67890",
            "players": ["user3"],
            "maxPlayers": 2
          }
        ]
      }
      ```

### Endpoint `app/game/rooms`: <a name="createRoom"></a>
- Request: `POST app/game/rooms` - Create room.
   - No parameters required.

  - Response:
    - Status: 201 Created
    - Body:
      ```
      {
        "roomId": "12345",
        "message": "Game room created successfully"
      }
      ```


### Endpoint `app/game/rooms/:roomId/join`: <a name="joinGame"></a>  
- Request: `POST /api/rooms/:roomId/join` - Join a specific game room.

   - Parameters:

   | Parameter      |   Type     | Required | Description                        |
   |----------------|------------|----------|------------------------------------|
   | `roomId`       |   UUID     | Yes      | The ID of the game room to join.   |

   - Body:
      ```
      { 
         "username": "user3"
      }
      ```
      
  - Response:
    - Status: 200 OK
    - Body:
      ```
      {
        "roomId": "12345",
        "message": "User user3 joined the game room"
      }
      ```

### Endpoint `app/game/rooms/:roomId`: <a name="deleteGame"></a>  
- Request: `DELETE /api/rooms/:roomId` - Delete a game room.

   - Parameters:

   | Parameter      |   Type     | Required | Description                        |
   |----------------|------------|----------|------------------------------------|
   | `roomId`       |   UUID     | Yes      | The ID of the game room to delete. |

  - Response:
    - Status: 200 OK
    - Body:
      ```
      {
        "roomId": "12345",
        "message": "Game room deleted successfully"
      }
      ```

### Endpoint `app/game/words`: <a name="getWords"></a>
- Request: `GET /app/game/words` - Get a randomly generated word for each turn.
   - No parameters required.

  - Response:
    - Status: 200 OK
    - Body:
      ```
      {
        "word": "apple",
        "message": "Word generated successfully"
      }
      ```

### Endpoint `app/game/turns`: <a name="guessWord"></a>
-  Request: `POST /app/game/turns` - Submit a guess for the current turn.
   - No parameters required.

    - Body:
      ```
      {
        "guess": "banana"
      }
      ```

  - Response:
    - Status: 200 OK
    - Body:
      ```
      {
        "isCorrect": false,
        "message": "Incorrect guess, please try again"
      }
      ```


### Endpoint `app/chat/:roomId/messages`: <a name="chatHistory"></a>
-  Request: `GET /app/chat/:roomId/messages` - Get the chat history for a specific game room.

   - Parameters:

   | Parameter      |   Type     | Required | Description                        |
   |----------------|------------|----------|------------------------------------|
   | `roomId`       |   UUID     | Yes      | The ID of the game room.           |

  - Response:
    - Status: 200 OK
    - Body:
      ```
      {
        "roomId": "123456",
        "messages": [
          {
            "id": "1",
            "sender": "John",
            "message": "Hello everyone"
          },
          {
            "id": "2",
            "sender": "Bob",
            "message": "Hi !!!"
          }
        ]
      }
      ```

### Endpoint `app/chat/:roomId/messages`: <a name="sendMessage"></a>
- Request: `POST /app/chat/:roomId/messages` - Send a message to the chat in a specific game room.

   - Parameters:

   | Parameter      |   Type     | Required | Description                        |
   |----------------|------------|----------|------------------------------------|
   | `roomId`       |   UUID     | Yes      | The ID of the game room.           | 

   - Body:
      ```
      {
        "sender": "Bob",
        "message": "Message from Bob"
      }
      ```

  - Response:
    - Status: 201 Created
    - Body:
      ```
      {
        "messageId": "3",
        "sender": "Bob",
        "message": "Message from Bob"
      }
      ```

### Endpoint `app/word/check`: <a name="wordCheck"></a>
-  Request: `POST /app/word/check` - Check if a word is similar to the target word.
   - No parameters required.

   - Body:
      ```
      {
        "word": "apple",
        "targetWord": "apple"
      }
      ```
   - Response:
    - Status: 200 OK
    - Body:
      ```
      {
        "word": "apple",
        "targetWord": "apple",
        "isSimilar": true
      }
      ```

## Database<a name="database"></a>

### userModel <a name="userModel"></a>

### gameModel <a name="gameModel"></a>

### chatModel <a name="chatModel"></a>

## Security <a name="security"></a>

## Testing <a name="testing"></a>

## Deployment <a name="deployment"></a>
Instructions for deploying the application.

## Future Enhancements <a name="futureEnhancements"></a>
Suggestions for additional features or improvements.

## FAQ <a name="faq"></a>
Common questions and troubleshooting tips.

## Conclusion <a name="conclusion"></a>
Final remarks and encouragement for further exploration.

