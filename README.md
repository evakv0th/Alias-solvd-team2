# Alias-solvd-team2

# Node.js-Based Game "Alias" with Chat and Word Checking

## Overview
This document outlines the Alias game, a multiplayer game built with Node.js. It includes chat functionality and a feature to check for similar words.

## Game Description
Alias is a word-guessing game where players form teams. Each team takes turns where one member describes a word and others guess it. The game includes a chat for players to communicate and a system to check for similar words.

### Objective
Teams try to guess as many words as possible from their teammates' descriptions.

### Turns
Each turn is timed. Describers cannot use the word or its derivatives.

### Scoring
Points are awarded for each correct guess. Similar words are checked for validation.

### End Game
The game concludes after a predetermined number of rounds, with the highest-scoring team winning.

## System Requirements
- **Backend**: Node.js
- **Database**: CouchDB

## Setup and Installation
Details on installing Node.js, setting up the database, cloning the repository, and installing dependencies.

## Architecture
Outline of the server setup, API endpoints, and database schema.

## Core Modules
1. **User Authentication**
   - [**Login and registration**](#login-and-registration)
   - Session management
2. **Game Lobby**
   - Room creation and joining
   - Team selection
3. **Game Mechanics**
   - Word generation
   - Turn management
4. **Chat System**
   - Real-time messaging
   - Chat history
5. **Word Checking**
   - Similarity algorithm
   - Word validation

## APIs

Documentation for each API endpoint including authentication, game control, and chat functionalities.

## Database Schema

Database schema is represented by JSON examples in `schema` folder.

### User

```json
{
   "id": "userId",
   "username": "bob@example.com",
   "password": "$2a$10$wSPtqqd5pujQ/1bYolF8qO.WDnSOcJ7IJt1YDvRO.U51LUfzxSHbm",
   "createdAt": "2023-11-22'T'12:30:00.000",
   "stats": {
      "roundsPlayed": 5,
      "wordsGuessed": 4
   }
}
```

| Property             | Type      | Description                                  |
|----------------------|-----------|----------------------------------------------|
| `id`                 | ObjectID  | ID of user                                   |
| `username`           | String    | Username                                     |
| `password`           | String    | Encrypted password                           |
| `createdAt`          | Timestamp | Timestamp when user was created              |
| `stats`              | Object    | Statistics object                            |
| `stats.gamesPlayed`  | Number    | Amount of rounds which user has been hosting |
| `stats.wordsGuessed` | Number    | Amount of words user guessed                 |

### Team

```json
{
   "id": "teamId1",
   "hostId": "userId",
   "name": "Curious bears",
   "members": [
      "userId1",
      "userId2",
      "userId3"
   ]
}
```

| Property  | Type       | Description               |
|-----------|------------|---------------------------|
| `id`      | ObjectID   | ID of team                |
| `hostId`  | ObjectID   | ID of team creator user   |
| `name`    | String     | Name of team              |
| `members` | ObjectID[] | Array of team members IDs |

### Vocabulary

```json
{
   "id": "vocabularyId",
   "words": [
      "bear",
      "motorbike",
      "air baloon"
   ]
}
```

| Property | Type     | Description                  |
|----------|----------|------------------------------|
| `id`     | ObjectID | ID of vocabulary             |
| `words`  | String[] | Array of words of vocabulary |

### Round

```json
{
   "id": "roundId",
   "startedAt": "2023-11-22'T'10:38:00.000",
   "finishedAt": "2023-11-22'T'10:39:00.000",
   "teamId": "teamId1",
   "hostId": "hostId1",
   "chatId": "chatId",
   "words": [
      {
         "word": "motorbike",
         "guessed": true
      },
      {
         "word": "air balloon",
         "guessed": false
      }
   ]
}
```

| Property        | Type      | Description                                       |
|-----------------|-----------|---------------------------------------------------|
| `id`            | ObjectID  | ID of game round                                  |
| `startedAt`     | Timestamp | Timestamp when game was started                   |
| `finishedAt`    | Timestamp | Timestamp when game was finished                  |
| `teamId`        | ObjectID  | ID of team, which member is host of this round    |
| `hostId`        | ObjectID  | ID of user, which is host of this round           |
| `chatId`        | ObjectID  | ID of chat, where words of this round are guessed |
| `words`         | Object[]  | Array of words of this round                      |
| `words.word`    | String    | Word to be guessed                                |
| `words.guessed` | Boolean   | Flag of word was guessed                          |

### Chat

```json
{
   "id": "chatId",
   "messages": [
      {
         "createdAt": "2022-11-22'T'10:37:45.123",
         "userId": "userId",
         "message": "message"
      },
      {
         "createdAt": "2022-11-22'T'10:37:45.869",
         "userId": "userId",
         "message": "message"
      }
   ]
}
```

| Property             | Type      | Description                     |
|----------------------|-----------|---------------------------------|
| `id`                 | ObjectID  | ID of chat                      |
| `messages`           | Object[]  | Array of messages of chat       |
| `messages.createdAt` | Timestamp | Timestamp when message was sent |
| `userId`             | ObjectID  | ID of user sent this message    |
| `message`            | String    | Text of message                 |

### Game

```json
{
   "id": "gameId",
   "hostId": "userId",
   "createdAt": "2023-11-22'T'10:37:15.000",
   "teams": [
      {
         "teamId": "teamId1",
         "score": 5
      },
      {
         "teamId": "teamId2",
         "score": 7
      }
   ],
   "currentTeam": "teamId1",
   "rounds": [
      "roundId1",
      "roundId2"
   ],
   "options": {
      "goal": 100,
      "roundTime": 60,
      "vocabularyId": "vocabularyId"
   }
}
```

| Property               | Type       | Description                     |
|------------------------|------------|---------------------------------|
| `id`                   | ObjectID   | ID of game                      |
| `hostId`               | ObjectID   | ID of user created game         |
| `createdAt`            | Timestamp  | Timestamp when game was created |
| `teams`                | Object[]   | Array of teams playing in game  |
| `teams.teamId`         | ObjectID   | ID of team                      |
| `teams.score`          | Number     | Amount of points of team        |
| `currentTeam`          | ObjectID   | ID of team to be hosting game   |
| `rounds`               | ObjectID[] | Array of game rounds IDs        |
| `options`              | Object     | Options of game                 |
| `options.goal`         | Number     | Amount of points to win game    |
| `options.roundTime`    | Number     | Amount of time for round        |
| `options.vocabularyId` | ObjectID   | ID of vocabulary for game       |


## User Authentication

## Login and registration

### POST Register
```POST /api/v1/auth/register```: 

 - ### Request Body

| Parameter    | Type     | Description                   |
| ------------ | ------   | -------------------           |
| `username`   | string   | Name of the user (required)   |
| `password`   | string   | password       (required)     |

- response 201 Created:
```json
{
    "message": "User registered successfully",
    "user": {
        "username": "anton",
        "password": "123"
    }
}
```

- response 400 Bad Request:
```json
{
    "error": "Please provide username and password"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```
### GET Login

```POST /api/v1/auth/login```: 
 - ### Request Body

| Parameter    | Type     | Description                   |
| ------------ | ------   | -------------------           |
| `username`   | string   | Name of the user (required)   |
| `password`   | string   | password       (required)     |

- response 200 OK:
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNzAwNjgxNjczLCJleHAiOjE3MDA2ODUyNzN9.WXlUiQll8nEGFLvc28rje-r6RUOUnywpmF3UfC-yZrE",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNzAwNjgxNjczLCJleHAiOjE3MDEyODY0NzN9.XpeVcwISzCsjnB55cZTjb6XpP5Tnt6X1JVVpuc4D4bc"
}
```

- response 400 Bad Request:
```json
{
"message": "Please provide username and password"
}
```

 - response 401 Unauthorized:
```json
{
    "error": "Wrong username or password"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```
### POST Refresh
```POST /api/v1/auth/refresh```: 

 - ### Request Body

| Parameter      | Type     | Description                 |
| ------------   | ------   | -------------------         |
| `refreshToken` | string   | Refresh token (required)    |

- response 200 OK:
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFudG9uIiwiaWF0IjoxNzAwNjc0NTk4LCJleHAiOjE3MDA2NzQ2Mjh9.cMoTwYaQnIRvhvHfa_kTZzFCTaeO1pmPiGAi_xrxsUM"
}
```

- response 400 Bad Request:
```json
{
    "error": "Refresh token is missing"
}
```
 - response 401 Unauthorized:
```json
{
    "error": "Invalid token"
}
```
OR
```json
{
    "error": "Token has expired"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```
## Security

Overview of implemented security measures.

## Testing

Guide on unit and integration testing.

## Deployment

Instructions for deploying the application.

## Future Enhancements
Suggestions for additional features or improvements.

## FAQ
Common questions and troubleshooting tips.

## Conclusion
Final remarks and encouragement for further exploration.
