# Swift API

This project is a **REST API** for managing **SWIFT code data**. It is built with **TypeScript, Express, and TypeORM**, using **PostgreSQL for production** and **SQLite (in-memory) for testing**. The application is fully containerized with **Docker**.

## Requirements

- Node.js (v18 or higher)
- npm
- Docker and Docker Compose

## Running the application locally (Development)

Tu run the application in development mode:

1. Clone the repository:

```
git clone https://github.com/your-repo/swift-api.git
cd swift-api
```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the PostgreSQL database in Docker:

   ```
   docker-compose up -d postgres
   ```

4. Start the development server:
   ```
   npm run dev
   ```

The server will start at http://localhost:8080

## Building and running the Application Locally

1. Build the project
   ```
   npm run build
   ```
2. Start the application
   ```
   npm start
   ```

The server will start at http://localhost:8080

## Running application with Docker

1. Clone the repository:

```
git clone https://github.com/your-repo/swift-api.git
cd swift-api
```

2. Build and start the containers
   ```
   docker-compose up --build
   ```

This will build and start both:

- The PostgreSQL database
- The API application

## Running tests locally

1. Clone the repository:

```
git clone https://github.com/your-repo/swift-api.git
cd swift-api
```

2. Install dependencies:

   ```
   npm install
   ```

3. Run the tests:
   ```
   npm run test
   ```
