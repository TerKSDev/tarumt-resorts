# TARUMT Resorts Management System

A full-stack resort management and front-desk operations system built with **React** and **Spring Boot**, featuring custom Abstract Data Types (ADTs), high-performance search caching, and real-time ledger auditing.

---

## 📖 Introduction

This project is architected with a decoupled full-stack design using **React** as the Frontend Client and **Spring Boot (Java)** as the Backend RESTful API server.

### What is React?

**React** is a declarative, component-based JavaScript library for building modern user interfaces. In this project, React powers the interactive staff dashboard, dynamic reporting modules, and real-time validation for front-desk operations with seamless state management.

### What is Spring Boot?

**Spring Boot** is an enterprise-grade Java framework designed to simplify the development of stand-alone, production-ready Spring applications. In this system, Spring Boot serves as the core Business Logic and Control Layer (ECB Pattern), providing RESTful endpoints, managing database persistence, and executing custom ADT algorithms.

---

## 🛠️ Prerequisites

Make sure the following environments and software are installed on your machine:

1. **Node.js (v18+)**: [https://nodejs.org/en](https://nodejs.org/en) _(Includes npm)_
2. **JDK 21+**: [Oracle JDK 21 Downloads](https://www.oracle.com/asean/java/technologies/downloads/#java21)
3. **Code Editor / IDE**: [Visual Studio Code](https://code.visualstudio.com/) (Recommended) / [Apache NetBeans](https://netbeans.apache.org/) / [IntelliJ IDEA](https://www.jetbrains.com/idea/)

> **Note:**
> **No external database installation (e.g., MySQL / PostgreSQL) is required.** The application uses an embedded **SQLite** database (`tarumt_resorts.db`) that initializes and synchronizes automatically upon starting the backend.

---

## 🚀 How to Run the Project

To run the complete system, please open **two separate terminal windows** (one for the Backend server and one for the Frontend client).

### 1. Start the Backend Server (Spring Boot)

Open a terminal in the root directory (`tarumt-resorts`) and execute the Maven wrapper:

- **Windows (Command Prompt / PowerShell):**
   ```bash
   .\mvnw.cmd spring-boot:run
   ```
- **macOS / Linux:**
   ```bash
   ./mvnw spring-boot:run
   ```

_Backend REST API Server will be running at:_ `http://localhost:8081`

---

### 2. Start the Frontend Client (React)

Open a **new** terminal window, navigate to the `frontend` directory, install dependencies, and launch the Vite development server:

```bash
# Navigate to the frontend directory
cd frontend

# Install pnpm package manager globally (if not already installed)
npm install -g pnpm

# Install project dependencies
pnpm install

# Start development server
pnpm dev
```

_Frontend Web Application will be available at:_ `http://localhost:5173`

---

## 🔐 Default Demo Accounts

For grading and quick verification, preset credentials are provided on the login page:

| Role                | Email                            | Password      |
| :------------------ | :------------------------------- | :------------ |
| **Manager / Admin** | `manager@tarumtresorts.com`      | `password123` |
| **Front Desk**      | `frontdesk@tarumtresorts.com`    | `password123` |
| **Housekeeping**    | `housekeeping@tarumtresorts.com` | `password123` |
