# Alias game

Node.js-Based Game "Alias" with Chat and Word Checking

## Content:

* [Description](#description)
* [System requirements](#system-requirements)
* [Architecture](#architecture)
* [Core modules](#core-modules)
* [Security](#security)
* [Testing](#testing)
* [Deployment](#deployment)
* [Future Enhancements](#future-enhancements)
* [FAQ](#faq)
* [Conclusion](#conclusion)
* [Database schema](#database-schema)
* [API](#apis)
    - [Authorization](#authorization)
    - [User](#user)
    - [Team](#team)
    - [Game](#game)
    - [Chat](#chat)
    - [Vocabulary](#vocabulary)
* [Objects](#objects)

## Description

This project is a multiplayer game build with Node.js.
Alias is a word-guessing game where players form teams. Each team takes turns where one member describes a word and
others guess it. The game includes a chat for players to communicate and a system to check for similar words.

### Objective

Teams try to guess as many words as possible from their teammates' descriptions.

### Turns

Each turn is timed. Describers cannot use the word or its derivatives.

### Scoring

Points are awarded for each correct guess. Similar words are checked for validation.

### End Game

The game concludes after a predetermined number of rounds, with the highest-scoring team winning.

## System Requirements

You need to have `.env` file in root folder corresponding `.env.example`

## Architecture

Outline of the server setup, API endpoints, and database schema.

## Core Modules

1. **User Authentication**
    - Login and registration
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

## Security

Overview of implemented security measures.

## Testing

Guide on unit and integration testing.

## Deployment

Run `docker compose up`.

## Future Enhancements

Suggestions for additional features or improvements.

## FAQ

Common questions and troubleshooting tips.

## Conclusion

Final remarks and encouragement for further exploration.

## Database Schema

Database schema is represented by JSON examples in `schema` folder.

### User

```json
{
  "_id": "userId",
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
| `_id`                | ObjectID  | ID of user                                   |
| `username`           | String    | Username                                     |
| `password`           | String    | Encrypted password                           |
| `createdAt`          | Timestamp | Timestamp when user was created              |
| `stats`              | Object    | Statistics object                            |
| `stats.gamesPlayed`  | Number    | Amount of rounds which user has been hosting |
| `stats.wordsGuessed` | Number    | Amount of words user guessed                 |

### Team

```json
{
  "_id": "teamId1",
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
| `_id`     | ObjectID   | ID of team                |
| `hostId`  | ObjectID   | ID of team creator user   |
| `name`    | String     | Name of team              |
| `members` | ObjectID[] | Array of team members IDs |

### Vocabulary

```json
{
  "_id": "vocabularyId",
  "words": [
    "bear",
    "motorbike",
    "air balloon"
  ]
}
```

| Property | Type     | Description                  |
|----------|----------|------------------------------|
| `_id`    | ObjectID | ID of vocabulary             |
| `words`  | String[] | Array of words of vocabulary |

### Round

```json
{
  "_id": "roundId",
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
| `_id`           | ObjectID  | ID of game round                                  |
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
  "_id": "chatId",
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
| `_id`                | ObjectID  | ID of chat                      |
| `messages`           | Object[]  | Array of messages of chat       |
| `messages.createdAt` | Timestamp | Timestamp when message was sent |
| `userId`             | ObjectID  | ID of user sent this message    |
| `message`            | String    | Text of message                 |

### Game

```json
{
  "_id": "gameId",
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
| `_id`                  | ObjectID   | ID of game                      |
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

## APIs

### Authorization

#### POST `/api/v1/auth/register`

Creates new user.

**Request:** [`IUserCreateSchema`](#iusercreateschema).

**Response:**

| Code              | Body                                    | Condition                        |
|-------------------|-----------------------------------------|----------------------------------|
| `201 Created`     | none                                    | If user successfully registered. |
| `400 Bad Request` | [`ExceptionMessage`](#exceptionmessage) | If registration failed.          |

#### `POST /api/v1/auth/login`

Authenticates user.

**Request:** [`LoginRequest`](#loginrequest).

**Response:**

| Code              | Body                                    | Condition                       |
|-------------------|-----------------------------------------|---------------------------------|
| `200 OK`          | [`LoginResponse`](#loginresponse)       | Correct credentials are used.   |
| `400 Bad Request` | [`ExceptionMessage`](#exceptionmessage) | Incorrect credentials are used. |

#### `POST /api/v1/auth/refresh`

Refreshes a pair of tokens.

**Request:** Object with `token` field.

**Response:**

| Code              | Body                                    | Condition                |
|-------------------|-----------------------------------------|--------------------------|
| `200 OK`          | [`LoginResponse`](#loginresponse)       | Correct token is used.   |
| `400 Bad Request` | [`ExceptionMessage`](#exceptionmessage) | Incorrect token is used. |

### User

#### GET `/api/v1/users/:id`

Returns user by their id.

**Request:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id`      | long | Yes      | User ID.    |

**Response:**

| Code               | Body                                    | Condition                  |
|--------------------|-----------------------------------------|----------------------------|
| `200 OK`           | [`User`](#user)                         | User is authenticated.     |
| `401 Unauthorized` | [`ExceptionMessage`](#exceptionmessage) | User is not authenticated. |
| `404 Not Found`    | [`ExceptionMessage`](#exceptionmessage) | User is not found.         |

#### PUT `/api/v1/users/:id`

Updates user by their id.

**Request:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id`      | long | Yes      | User ID.    |

**Response:**

| Code               | Body                                    | Condition                     |
|--------------------|-----------------------------------------|-------------------------------|
| `200 OK`           | none                                    | If user successfully updated. |
| `400 Bad Request`  | [`ExceptionMessage`](#exceptionmessage) | If something failed.          |
| `401 Unauthorized` | [`ExceptionMessage`](#exceptionmessage) | User is not authenticated.    |

### Team

#### POST `/api/v1/teams`

Creates new team with host of authenticated user.

**Request:** [`ITeamCreateSchema`](#iteamcreateschema)

**Response:**

| Code               | Body                                    | Condition                         |
|--------------------|-----------------------------------------|-----------------------------------|
| `201 Created`      | [`Team`](#team)                         | If team was successfully created. |
| `400 Bad Request`  | [`ExceptionMessage`](#exceptionmessage) | If something failed.              |
| `401 Unauthorized` | [`ExceptionMessage`](#exceptionmessage) | If user not authorized.           |

#### GET `/api/v1/teams/:id`

Returns team by their id.

**Request:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id`      | long | Yes      | Team ID.    |

**Response:**

| Code              | Body                                    | Condition              |
|-------------------|-----------------------------------------|------------------------|
| `200 OK`          | [`Team`](#team)                         | If team was found.     |
| `400 Bad Request` | [`ExceptionMessage`](#exceptionmessage) | If something failed.   |
| `404 Not Found`   | [`ExceptionMessage`](#exceptionmessage) | If team was not found. |

#### PUT `/api/v1/teams/:id/members`

Update team members.

**Request:** `String[]` of user IDs.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id`      | long | Yes      | Team ID.    |

**Response:**

| Code              | Body                                    | Condition              |
|-------------------|-----------------------------------------|------------------------|
| `200 OK`          | none                                    | If team was saved.     |
| `400 Bad Request` | [`ExceptionMessage`](#exceptionmessage) | If something failed.   |
| `404 Not Found`   | [`ExceptionMessage`](#exceptionmessage) | If team was not found. |

### Game

#### POST `/api/v1/games`

Creates game.

**Request:** [`IGameCreateSchema`](#igamecreateschema)

**Response:**

| Code               | Body                                    | Condition                         |
|--------------------|-----------------------------------------|-----------------------------------|
| `200 OK`           | [`Game`](#game)                         | If game was successfully created. |
| `400 Bad Request`  | [`ExceptionMessage`](#exceptionmessage) | If something failed.              |
| `401 Unauthorized` | [`ExceptionMessage`](#exceptionmessage) | If user not authorized.           |

#### GET `/api/v1/games/:id`

Returns game by their id.

**Request:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id`      | long | Yes      | Game ID.    |

**Response:**

| Code               | Body                                    | Condition               |
|--------------------|-----------------------------------------|-------------------------|
| `200 OK`           | [`Game`](#game)                         | If game was found.      |
| `401 Unauthorized` | [`ExceptionMessage`](#exceptionmessage) | If user not authorized. |
| `404 Not Found`    | [`ExceptionMessage`](#exceptionmessage) | If game was not found.  |

#### POST `/api/v1/games/:id/start`

Starts game.

**Request:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id`      | long | Yes      | Game ID.    |

**Response:**

| Code               | Body                                    | Condition                                     |
|--------------------|-----------------------------------------|-----------------------------------------------|
| `200 OK`           | none.                                   | If game was started.                          |
| `401 Unauthorized` | [`ExceptionMessage`](#exceptionmessage) | If user is not a game host or not authorized. |
| `404 Not Found`    | [`ExceptionMessage`](#exceptionmessage) | If game was not found.                        |

### Chat

Chat is based on websockets.

#### `/:chatId`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId`  | long | Yes      | Chat ID.    |

**Message:** Object with `message` field.

### Vocabulary

#### GET `/api/v1/vocabularies`

Returns all vocabularies.

**Request:** none.

**Response:** [`Vocabulary[]`](#vocabulary)

#### POST `/api/v1/vocabularies`

Creates new vocabulary.

**Request:** [`Vocabulary`](#vocabulary).

**Response:**

| Code              | Body                                    | Condition                               |
|-------------------|-----------------------------------------|-----------------------------------------|
| `200 OK`          | none                                    | If vocabulary was successfully created. |
| `400 Bad Request` | [`ExceptionMessage`](#exceptionmessage) | If vocabulary was not created.          |

#### GET `/api/v1/vocabularies/:id`

Returns vocabulary by their id.

**Request:**

| Parameter | Type | Required | Description    |
|-----------|------|----------|----------------|
| `id`      | long | Yes      | Vocabulary ID. |

**Response:**

| Code            | Body                                    | Condition                             |
|-----------------|-----------------------------------------|---------------------------------------|
| `200 OK`        | [`Vocabulary`](#vocabulary)             | If vocabulary with such id was found. |
| `404 Not Found` | [`ExceptionMessage`](#exceptionmessage) | If vocabulary was not found.          |

#### PUT `/api/v1/vocabularies/:id`

Updates vocabulary by their id.

**Request:**

| Parameter | Type | Required | Description    |
|-----------|------|----------|----------------|
| `id`      | long | Yes      | Vocabulary ID. |

**Response:**

| Code            | Body                                    | Condition                               |
|-----------------|-----------------------------------------|-----------------------------------------|
| `200 OK`        | none                                    | If vocabulary was successfully updated. |
| `404 Not Found` | [`ExceptionMessage`](#exceptionmessage) | If vocabulary was not found.            |

## Objects

### `IUserCreateSchema`

```json
{
  "username": "bob",
  "password": "bob"
}
```

### `ITeamCreateSchema`

```json
{
  "name": "Curious bears"
}
```

### `IGameCreateSchema`

```json
{
  "hostId": "1",
  "teams": [
    "teamId1",
    "teamId2"
  ],
  "options": {
    "goal": 100,
    "roundTime": 60,
    "vocabularyId": "vocabularyId"
  }
}
```

### `LoginRequest`

```json
{
  "username": "example",
  "password": "12345678"
}
```

| Field      | Type   | Required | Description      |
|------------|--------|----------|------------------|
| `username` | string | Yes      | User`s username. |
| `password` | string | Yes      | User`s password. |

### `LoginResponse`

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJleGFtcGxlQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.tCvBDCHd_VjUZ2SaGFdyxKkLYbjq-W0rH6SYHoayU_w",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJleGFtcGxlQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.tCvBDCHd_VjUZ2SaGFdyxKkLYbjq-W0rH6SYHoayU_w"
}
```

| Field     | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| `access`  | string | Yes      | Access JWT token.  |
| `refresh` | string | Yes      | Refresh JWT token. |

### `ExceptionMessage`

```json
{
  "message": "Something bad happened."
}
```