# Backend Technology Stack Selection Report

## 1. Introduction
The objective of this report is to research, analyze, and benchmark available free frameworks for implementing the backend REST API of the Personal Portfolio application. The backend requires basic CRUD endpoints and statistics processing, operating entirely in-memory without persistent database support.

## 2. Market Research and Competitors
Given the decision to use the JavaScript/TypeScript runtime environment (Node.js), we analyzed the market for the most prominent free and open-source backend web frameworks. The main competitors identified are:

1. **Express.js**: The most widely-used, minimalist, and unopinionated web framework for Node.js.
2. **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications, heavily inspired by Angular's architecture.
3. **Fastify**: A web framework highly focused on providing the best developer experience with the least overhead and a powerful plugin architecture.
4. **Koa**: A modern, lightweight framework created by the original Express team, designed to be smaller, more expressive, and more robust by leveraging modern async functions natively.

## 3. Assessment Criteria
To devise a proper assessment of quality, the following criteria were established based on the specific needs of a bronze-level assignment (CRUD operations, in-memory storage, clear separation of endpoints):

* **Learning Curve & Ease of Use:** How quickly can a developer set up basic routes and middleware?
* **Performance (Requests/Sec):** The framework's raw throughput and overhead.
* **Ecosystem & Community Support:** Availability of third-party libraries (like CORS, validation), tutorials, and community troubleshooting.
* **Structural Opinionation:** How much the framework enforces a specific architectural pattern (e.g., MVC, dependency injection).
* **TypeScript Compatibility:** The ease of integrating strict typing and validation (e.g., Zod) into the workflow.

## 4. Benchmark Analysis

The following table presents a comparative benchmark of the selected options:

| Feature / Criteria | Express.js | NestJS | Fastify | Koa |
| :--- | :--- | :--- | :--- | :--- |
| **Learning Curve** | Low (Very Beginner Friendly) | High (Requires understanding OOP/DI) | Medium (Schema-driven) | Medium (Requires deep async knowledge) |
| **Performance** | Moderate (~15k req/sec) | Moderate (~14k req/sec) | **Very High (~35k req/sec)** | High (~20k req/sec) |
| **Community Support** | **Massive** (Industry Standard) | Growing rapidly | Strong | Moderate |
| **Architecture** | Unopinionated (Flexible) | Highly Opinionated (Angular-like) | Unopinionated | Unopinionated |
| **TypeScript Support** | Good (Requires `@types/express`) | **Excellent (First-class citizen)** | Very Good | Good (Requires `@types/koa`) |
| **Boilerplate Required**| Low | High | Low | Very Low |
| **Best Used For** | General purpose, simple APIs | Enterprise-scale applications | High-performance microservices | Lightweight middleware applications |

*(Note: Performance metrics are relative estimations based on standard "Hello World" synthetic benchmarks in the Node.js ecosystem).*

## 5. Technology Stack Justification

Based on the benchmarking criteria and the specific requirements of the assignment, **Express.js combined with TypeScript** was chosen as the technology stack for the following logical assertions:

1. **Get it done fast:** The app is tiny. Functional delivery matters more than theoretical API architecture quality. Express lets us write routes and controllers instantly without fighting a complex framework like NestJS.
2. **No scaling requirements:** This API runs entirely in RAM with no concurrency demands. Fastify's speed advantages are irrelevant here; Express is fast enough.
3. **Zero over-engineering:** We don't need dependency injection or massive architectural abstractions. A simple `routes -> controllers -> services` structure gets the job done cleanly.
4. **Community and Libraries:** Implementing mandatory requirements like CORS, Jest testing, and Zod validation takes seconds because of Express's massive community ecosystem.

**Conclusion:** Express.js was chosen because it is the fastest way to get a functional API running with zero setup overhead.
