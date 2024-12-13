<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

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
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

---

# Project Setup Instructions

This repository supports different database configurations across the following branches: `main`, `mongodb/mongoose`, `sql/prisma`, and `postgres/prisma`. Follow these steps to set up the project for your chosen branch.

---

## General Setup Steps for All Branches

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd <repository_name>
   ```

3. **Switch to the Relevant Branch**:
   - Default setup:
     ```bash
     git checkout main
     ```
   - MongoDB/Mongoose:
     ```bash
     git checkout mongodb/mongoose
     ```
   - SQL/Prisma:
     ```bash
     git checkout sql/prisma
     ```
   - PostgreSQL/Prisma:
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

This branch provides the default NestJS project setup.

1. **Run the Application**:
   ```bash
   pnpm run start:dev
   ```
2. Access the application at `http://localhost:3000`.

---

### `mongodb/mongoose` Branch

This branch integrates MongoDB with Mongoose.

1. **Install and Start MongoDB**:
   - Follow the [MongoDB installation guide](https://www.mongodb.com/docs/manual/installation/).
   - Run the MongoDB server:
     ```bash
     mongod
     ```

2. **Configure `.env`**:
   Add the following:
   ```env
   DATABASE_URL=mongodb://localhost:27017/your-database-name
   ```

3. **Run the Application**:
   ```bash
   pnpm run start:dev
   ```

---

### `sql/prisma` Branch

This branch uses SQL with Prisma.

1. **Set Up Your SQL Database**:
   - Install and start a SQL server (e.g., MySQL).
   - Create a database for the project.

2. **Configure `.env`**:
   Add the following:
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
   - Follow the [PostgreSQL installation guide](https://www.postgresql.org/download/).
   - Start the PostgreSQL service and create a new database.

2. **Configure `.env`**:
   Add the following:
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

## Testing

Run tests using the following commands:
```bash
# Unit tests
pnpm run test

# End-to-end tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

---

## License

This project is [MIT licensed](./LICENSE).
```

---

### Key Adjustments:
- The NestJS promotional section remains intact at the top for context.
- Clarified and structured instructions for each branch setup.
- Removed redundant sections and ensured cohesive formatting.
