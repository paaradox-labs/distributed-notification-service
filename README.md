# Notification Service

A Kafka-powered notification service that listens for order events and sends transactional emails. Built with TypeScript, KafkaJS, and Nodemailer.

## Architecture

```
Order Service → Kafka (topic: "order") → Notification Service → SMTP (Ethereal/Nodemailer)
```

The service is a **Kafka consumer** — no HTTP server. It consumes order lifecycle events and dispatches email notifications accordingly.

## Prerequisites

- Node.js
- pnpm
- Apache Kafka running on `localhost:9092` (configurable)

## Getting Started

```bash
pnpm install
pnpm dev
```

## Scripts

| Command        | Description                              |
| -------------- | ---------------------------------------- |
| `pnpm dev`     | Run with nodemon + ts-node (hot-reload)  |
| `pnpm build`   | Lint + compile TypeScript to `./dist`    |
| `pnpm lint`    | Run ESLint                               |
| `pnpm format`  | Format with Prettier                     |

## Configuration

Configuration lives in `config/development.yaml` (git-ignored — contains credentials):

```yaml
kafka:
  broker: localhost:9092
mail:
  host: smtp.ethereal.email
  port: 587
  auth:
    user: ...
    pass: ...
  from: "Notification Service <...>"
frontend:
  clientUI: http://localhost:3000
```

## Kafka Topics

### `order`

The service subscribes to the `order` topic. Expected message format:

```json
{
  "event_type": "ORDER_CREATE | PAYMENT_STATUS_UPDATE | ORDER_STATUS_UPDATE",
  "data": {
    "_id": "<order-id>",
    "customerId": { "email": "<customer-email>" },
    "PaymentMode": "card | cash"
  }
}
```

Emails are sent with an HTML link back to the order page on the frontend.

## Project Structure

```
├── server.ts                     # Entry point
├── config/                       # YAML config (git-ignored)
├── src/
│   ├── config/
│   │   ├── kafka.ts              # KafkaBroker — KafkaJS consumer wrapper
│   │   └── logger.ts             # Winston logger
│   ├── factories/
│   │   ├── broker-factory.ts     # Singleton broker factory
│   │   └── notification-factory.ts # Transport factory (mail/sms)
│   ├── handlers/
│   │   └── orderHandler.ts       # Email text/HTML generators
│   ├── types/
│   │   ├── broker.ts             # MessageBroker interface
│   │   ├── index.ts              # Domain enums
│   │   └── notification-types.ts # Message & Transport interfaces
│   ├── mail.ts                   # Nodemailer transport
│   └── utils.ts
└── logs/                         # Winston log output
```

## Extending

- **Add SMS support**: Implement the `NotificationTransport` interface and register it in `notification-factory.ts`.
- **Add topics**: Subscribe to additional topics in `server.ts` and add corresponding handlers.
