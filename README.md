# 💬 NexChat — Premium Real-time Chat Application

<div align="center">

![NexChat Banner](https://img.shields.io/badge/NexChat-Premium%20Chat%20App-6366f1?style=for-the-badge&logo=message-square)

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=java)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green?style=flat-square&logo=spring)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-purple?style=flat-square)](https://stomp.github.io/)
[![JWT](https://img.shields.io/badge/Auth-JWT-red?style=flat-square)](https://jwt.io/)
[![AI](https://img.shields.io/badge/AI-Gemini%20Free-yellow?style=flat-square&logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**A full-stack, production-ready real-time chat application with AI integration, JWT security, and WebSocket messaging.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Quick Start](#-quick-start) · [API Docs](#-api-reference) · [Architecture](#-architecture)

</div>

---

## ✨ Features

### Core Chat
- 🔴 **Real-time messaging** via WebSocket (STOMP over SockJS)
- 👥 **Direct Messages** and **Group Chats**
- ✏️ **Edit & Delete** messages
- 💬 **Typing indicators** — live "User is typing..."
- 📜 **Paginated message history**
- 🔔 **Read receipts**

### AI Integration
- 🤖 **NexBot AI** — mention `@ai` or `@nexbot` in any chat to get AI responses
- 💡 **Smart reply suggestions** — AI suggests quick replies
- 📝 **Conversation summarization**
- Powered by **Google Gemini API (FREE tier)**

### Security
- 🔐 **JWT Access Tokens** (short-lived, 24h)
- 🔄 **Refresh Tokens** (7-day rotation)
- 🛡️ **Spring Security** filter chain
- 🔑 **BCrypt** password hashing (strength 12)
- 🌐 **CORS** configured for dev & prod
- 🔒 **WebSocket authentication** via JWT headers

### Advanced Java / Spring Features
- ⚡ **Java 21** with Records, Pattern Matching, Virtual Threads ready
- 🏗️ **Spring Boot 3.2** — latest version
- 📡 **Spring WebSocket** with STOMP broker
- 🛡️ **Spring Security** method-level & URL-level
- 🗄️ **Spring Data JPA** with custom JPQL queries
- ⚙️ **Spring Cache** — user caching with `@Cacheable`
- 🔀 **Spring Async** — AI calls run non-blocking
- ✅ **Spring Validation** — Bean Validation on all DTOs
- 📊 **Spring Actuator** — health & info endpoints
- 🔁 **Transactional** — proper `@Transactional` usage

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 21 | Core language |
| Spring Boot 3.2 | Application framework |
| Spring Security | Authentication & Authorization |
| Spring WebSocket + STOMP | Real-time messaging |
| Spring Data JPA + Hibernate | ORM & data persistence |
| Spring Cache | Performance caching |
| Spring Async | Non-blocking AI calls |
| JWT (jjwt 0.12.3) | Stateless authentication |
| H2 Database | Embedded DB (dev) / swap for PostgreSQL |
| Lombok | Boilerplate reduction |
| MapStruct | Object mapping |
| OkHttp | HTTP client for AI API |
| Maven | Build tool |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript 5 | Type safety |
| Vite | Build tool |
| Tailwind CSS 3 | Utility-first styling |
| Zustand | Global state management |
| @stomp/stompjs + SockJS | WebSocket client |
| Axios | HTTP client + interceptors |
| Framer Motion | Animations |
| React Router v6 | Client-side routing |
| React Hot Toast | Notifications |
| date-fns | Date formatting |
| Lucide React | Icons |

### AI
| Service | Cost |
|---|---|
| Google Gemini 2.0 Flash | **FREE** (15 RPM, 1M tokens/day) |

---

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- Maven 3.8+
- A free [Google Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/nexchat.git
cd nexchat
```

### 2. Configure Backend
```bash
cd backend
```

Open `src/main/resources/application.properties` and set your Gemini API key:
```properties
ai.gemini.api-key=YOUR_GEMINI_API_KEY_HERE
```

Or use environment variable:
```bash
export GEMINI_API_KEY=your-key-here
```

### 3. Run Backend
```bash
mvn spring-boot:run
```

Backend starts on **http://localhost:8080**

> H2 Console available at: http://localhost:8080/h2-console  
> Username: `nexchat` | Password: `nexchat123`

### 4. Run Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Frontend starts on **http://localhost:3000**

### 5. Open and Register
1. Go to http://localhost:3000
2. Click **Create Account**
3. Register two users in different tabs
4. Start chatting in real-time!

---

## 🔮 Using the AI Feature

In any chat window, type a message starting with `@ai` or `@nexbot`:

```
@ai What's the weather like on Mars?
@ai Summarize the key points of WebSocket protocol
@nexbot Write a poem about coding at midnight
```

The AI response appears in the chat as a bot message.

---

## 📁 Project Structure

```
nexchat/
├── backend/                          # Spring Boot application
│   ├── src/main/java/com/nexchat/
│   │   ├── NexChatApplication.java   # Entry point
│   │   ├── config/
│   │   │   ├── SecurityConfig.java   # Spring Security + JWT filter chain
│   │   │   ├── WebSocketConfig.java  # STOMP WebSocket + JWT auth
│   │   │   └── CorsConfig.java       # CORS for dev + prod
│   │   ├── controller/
│   │   │   ├── AuthController.java   # /api/auth/** (register, login, refresh, logout)
│   │   │   ├── ChatController.java   # /api/chat/** (rooms, messages)
│   │   │   ├── UserController.java   # /api/users/** (profile, search, AI)
│   │   │   └── WebSocketController   # @MessageMapping for STOMP
│   │   ├── entity/
│   │   │   ├── User.java             # UserDetails, UUID PK, roles
│   │   │   ├── ChatRoom.java         # GROUP / DIRECT rooms
│   │   │   └── Message.java          # TEXT / IMAGE / AI_RESPONSE types
│   │   ├── service/
│   │   │   ├── AuthService.java      # JWT generation, token refresh
│   │   │   ├── ChatService.java      # Room + message business logic
│   │   │   └── AiService.java        # Gemini API integration (@Async)
│   │   ├── repository/               # Spring Data JPA repositories
│   │   ├── filter/
│   │   │   └── JwtAuthFilter.java    # JWT extraction + SecurityContext
│   │   ├── util/
│   │   │   └── JwtUtil.java          # Token generation & validation
│   │   ├── dto/                      # Request & Response DTOs
│   │   └── exception/                # Global exception handler
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/                         # React + TypeScript application
    ├── src/
    │   ├── api/                      # Axios API clients
    │   │   ├── client.ts             # Interceptors: attach JWT, auto-refresh
    │   │   ├── auth.ts
    │   │   ├── chat.ts
    │   │   └── user.ts
    │   ├── store/                    # Zustand global state
    │   │   ├── authStore.ts          # JWT + user session (persisted)
    │   │   └── chatStore.ts          # Rooms, messages, typing
    │   ├── hooks/
    │   │   └── useWebSocket.ts       # STOMP connection + subscriptions
    │   ├── components/
    │   │   ├── auth/                 # Login, Register pages
    │   │   ├── chat/                 # ChatWindow, Messages, Input, AI
    │   │   ├── layout/               # Sidebar, ChatLayout
    │   │   └── ui/                   # Avatar, etc.
    │   └── types/                    # TypeScript interfaces
    └── public/
```

---

## 🔌 API Reference

### Auth Endpoints
```
POST /api/auth/register    — Create new account
POST /api/auth/login       — Login, get JWT tokens
POST /api/auth/refresh     — Refresh access token
POST /api/auth/logout      — Logout (invalidates refresh token)
```

### Chat Endpoints
```
GET    /api/chat/rooms                        — Get user's rooms
POST   /api/chat/rooms                        — Create group room
GET    /api/chat/rooms/:id                    — Get room details
POST   /api/chat/rooms/direct/:targetUserId   — Get/create DM
GET    /api/chat/rooms/:id/messages           — Get messages (paginated)
POST   /api/chat/messages                     — Send message
PUT    /api/chat/messages/:id                 — Edit message
DELETE /api/chat/messages/:id                 — Delete message
POST   /api/chat/rooms/:id/members/:userId    — Add member
```

### User Endpoints
```
GET  /api/users/me          — Get current user profile
PUT  /api/users/me          — Update profile
PUT  /api/users/me/status   — Update online status
GET  /api/users/search?q=   — Search users
GET  /api/users/:id         — Get user by ID
POST /api/users/ai/ask      — Direct AI query
POST /api/users/ai/suggest-reply — AI reply suggestions
```

### WebSocket Endpoints (STOMP)
```
Connect:     /ws  (SockJS)
Send msg:    /app/chat.send
Typing:      /app/chat.typing
Read:        /app/chat.read

Subscribe:   /topic/room/{roomId}         — New messages
             /topic/room/{roomId}/edits   — Edited messages
             /topic/room/{roomId}/deletes — Deleted messages
             /topic/room/{roomId}/typing  — Typing events
```

---

## 🔐 Authentication Flow

```
1. POST /api/auth/login
   → Returns: { accessToken (24h), refreshToken (7d), user }

2. Every request includes:
   Authorization: Bearer <accessToken>

3. On 401:
   → Axios interceptor auto-calls POST /api/auth/refresh
   → New tokens issued, original request retried

4. Logout:
   → Refresh token nulled in DB
   → Client localStorage cleared
```

---

## 🏭 Production Deployment

### Switch to PostgreSQL
In `application.properties`, replace H2 config with:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nexchat
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=nexchat
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### Build for Production
```bash
# Frontend
cd frontend && npm run build

# Backend (serves frontend from /static)
cd backend && mvn clean package -DskipTests
java -jar target/nexchat-backend-1.0.0.jar
```

### Environment Variables
```bash
GEMINI_API_KEY=your_gemini_key
JWT_SECRET=your_very_long_secret_256_bits
SPRING_DATASOURCE_URL=jdbc:postgresql://...
SPRING_DATASOURCE_USERNAME=...
SPRING_DATASOURCE_PASSWORD=...
```

---

## 🧠 Advanced Java Concepts Used

| Concept | Where Used |
|---|---|
| `UserDetails` / `UserDetailsService` | `User.java`, `UserDetailsServiceImpl.java` |
| JWT Filter (`OncePerRequestFilter`) | `JwtAuthenticationFilter.java` |
| `@PreAuthorize` method security | `SecurityConfig` — `@EnableMethodSecurity` |
| `@Transactional` / `@Transactional(readOnly)` | Service layer |
| `@Async` + `CompletableFuture` | `AiService.java` |
| `@Cacheable` with Spring Cache | `UserDetailsServiceImpl` |
| Custom JPQL queries | All repositories |
| Spring Events / STOMP messaging | `WebSocketController.java` |
| Hibernate indexes & constraints | Entity `@Index`, `@UniqueConstraint` |
| `@Valid` + `ConstraintViolation` | All controller endpoints |
| Builder + Lombok | All entities and DTOs |
| UUID primary keys | All entities |
| Enum-mapped columns | `UserStatus`, `MessageType`, `RoomType` |
| Bidirectional JPA relations | `User ↔ ChatRoom ↔ Message` |
| `@ElementCollection` | `User.roles`, `Message.reactions` |
| Pagination with `Pageable` | `MessageRepository` |

---

## 🗺 Architecture

```
┌─────────────────────────────────────────────────────┐
│                    React Frontend                    │
│  Zustand Store ←→ Axios (JWT interceptor) ←→ API   │
│  STOMP Client (SockJS) ←→ WebSocket subscriptions  │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP / WebSocket
┌─────────────────────▼───────────────────────────────┐
│              Spring Boot Backend (8080)              │
│                                                     │
│  SecurityFilterChain → JwtAuthFilter → Controllers  │
│                                                     │
│  REST Controllers        WebSocket Controller       │
│  ├── AuthController      └── @MessageMapping        │
│  ├── ChatController           ├── chat.send         │
│  └── UserController           ├── chat.typing       │
│                               └── chat.read         │
│  Service Layer                                      │
│  ├── AuthServiceImpl    ← JWT generation            │
│  ├── ChatServiceImpl    ← Business logic            │
│  └── AiService          ← Async Gemini calls        │
│                                                     │
│  Spring Data JPA → H2 / PostgreSQL                  │
│  Spring Cache    → User caching                     │
│  STOMP Broker    → /topic, /queue, /user            │
└─────────────────────────────────────────────────────┘
                      │
              ┌───────▼───────┐
              │  Google Gemini│
              │   (Free API)  │
              └───────────────┘
```

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m 'Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  Built with ❤️ using Spring Boot + React + Gemini AI
  <br/>
  <strong>⭐ Star this repo if you found it useful!</strong>
</div>
