<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
Here's the revised `README.md` without Docker instructions:  

```markdown
# Project Setup Instructions

This repository contains different branches for various database setups: `main`, `mongodb/mongoose`, `sql/prisma`, and `postgres/prisma`. Follow the instructions below to set up the project for the desired branch after cloning the repository.

---

## General Steps for All Branches

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   ```

2. **Navigate to the Repository**:
   ```bash
   cd <repository_name>
   ```

3. **Switch to the Desired Branch**:
   - For the default setup:
     ```bash
     git checkout main
     ```
   - For MongoDB/Mongoose setup:
     ```bash
     git checkout mongodb/mongoose
     ```
   - For SQL/Prisma setup:
     ```bash
     git checkout sql/prisma
     ```
   - For Postgres/Prisma setup:
     ```bash
     git checkout postgres/prisma
     ```

4. **Install Dependencies**:
   ```bash
   pnpm install
   ```

---

## Branch-Specific Setup Instructions

### `main` Branch

This branch contains the default NestJS setup.

1. **Run the Application**:
   ```bash
   # development mode
   pnpm run start:dev
   ```

2. The application will start on `http://localhost:3000`.

---

### `mongodb/mongoose` Branch

This branch uses MongoDB with Mongoose.

1. **Install and Start MongoDB**:
   - Install MongoDB locally by following the [MongoDB installation guide](https://www.mongodb.com/docs/manual/installation/).
   - Start MongoDB:
     ```bash
     mongod
     ```

2. **Configure the `.env` File**:
   Create a `.env` file in the root directory and specify your MongoDB connection string:
   ```env
   DATABASE_URL=mongodb://localhost:27017/your-database-name
   ```

3. **Run the Application**:
   ```bash
   pnpm run start:dev
   ```

---

### `sql/prisma` Branch

This branch uses SQL databases with Prisma.

1. **Set Up Your SQL Database**:
   - Install and start your SQL database (e.g., MySQL).
   - Create a new database in your SQL server for this application.

2. **Configure the `.env` File**:
   Create a `.env` file in the root directory and specify your database connection string:
   ```env
   DATABASE_URL=mysql://username:password@localhost:3306/your-database-name
   ```

3. **Run Prisma Migrations**:
   ```bash
   pnpm prisma migrate dev
   ```

4. **Run the Application**:
   ```bash
   pnpm run start:dev
   ```

---

### `postgres/prisma` Branch

This branch uses PostgreSQL with Prisma.

1. **Install and Start PostgreSQL**:
   - Install PostgreSQL by following the [PostgreSQL installation guide](https://www.postgresql.org/download/).
   - Start PostgreSQL and create a new database for this application.

2. **Configure the `.env` File**:
   Create a `.env` file in the root directory and specify your PostgreSQL connection string:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/your-database-name
   ```

3. **Run Prisma Migrations**:
   ```bash
   pnpm prisma migrate dev
   ```

4. **Run the Application**:
   ```bash
   pnpm run start:dev
   ```

---

## Run Tests

```bash
# unit tests
pnpm run test

```

---

## License

This project is [MIT licensed](./LICENSE).
```
