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
   - [Endpoints: game/create](#createRoom)
   - [Endpoints: game/join](#joinGame)
   - [Endpoints: game/start](#startGame)
   - [Endpoints: chat/send](#sendMessage)
   - [Endpoints: chat/history](#chatHistory)
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

### Endpoint `app/auth/signIn`: <a name="signIn"></a>

### Endpoint `app/game/create`: <a name="createRoom"></a>

### Endpoint `app/game/join`: <a name="joinGame"></a>

### Endpoint `app/game/start`: <a name="startGame"></a>

### Endpoint `app/chat/send`: <a name="sendMessage"></a>

### Endpoint `app/chat/history`: <a name="chatHistory"></a>

## Database<a name="database"></a>

### userModel <a name="userModel"></a>

### gameModel <a name="gameModel"></a>

### chatModel <a name="chatModel"></a>

## Security <a name="security"></a>

## Testing <a name="testing"></a>
Guide on unit and integration testing.

## Deployment <a name="deployment"></a>
Instructions for deploying the application.

## Future Enhancements <a name="futureEnhancements"></a>
Suggestions for additional features or improvements.

## FAQ <a name="faq"></a>
Common questions and troubleshooting tips.

## Conclusion <a name="conclusion"></a>
Final remarks and encouragement for further exploration.






