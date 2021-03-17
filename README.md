# Dvinder

**_Make a better community_**.

**Tinder** for **Developers**. Make **Friends**, find **love**, find **project** partner. Share **codes**, project ideas, **memes** and more.

# Technologies used

- Node.js
- GraphQL
- Express.js
- React.js
- Next.js
- Chakra UI
- Apollo + Express.js
- PostGreSQL + Redis
- SQL Queries
- Docker

## Concepts Used for backend

```md
- Node.js + TypeScript + PostgreSQL + GraphQL
- Apollo Server
- TypeORM ( Mikro ORM was used previously then switched to TypeORM )
- TypeGraphQL
- Redis
- DataLoader for better queries to database
- For better performance for some cases SQL Queries are used
```

## Concepts used for frontend

```md
- Next.js + React + ChakraUI + Some CSS
- GraphQL type generator for generation types for queries from server
- formik for forms
- Previously
  - URQL as GraphQL client to query to the server
  - URQL caches( updating, invalidation, read write fragments )
  - next-urql for SSR
- Currently
  - Apollo Client as GraphQL client to query to the server
  - Apollo caches much easier
  - next-apollo for ssr currently
```

## How to Run Front-end

- install Node.js

```bash
$ git clone https://github.com/MananDesai54/Dvinder.git
$ cd client
$ yarn install
$ yarn dev
```

## How to Run Back-end

- install Node.js, postgreSQL, Redis

```bash
$ git clone https://github.com/MananDesai54/Dvinder.git
$ cd server
$ yarn install
$ yarn watch
$ yarn dev
```
