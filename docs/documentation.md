# Flux Agency Technical Documentation

## 1. System Architecture
Flux Agency uses a decoupled architecture with a **React-based Command Center** and an **Express/Node.js Business Logic Layer**.

### Core Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Motion
- **Backend**: Express.js
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth (Google OAuth)
- **Payments**: Stripe Billing / Payments
- **Email**: SendGrid API

## 2. API Endpoints

### `/api/payments/create-checkout`
- **Method**: `POST`
- **Description**: Initializes a Stripe checkout session for service retainers.
- **Payload**: `{ serviceId: string, plan: 'tier_1' | 'tier_2' }`

### `/api/email/dispatch-audit`
- **Method**: `POST`
- **Description**: Sends a generated technical audit to the merchant.
- **Payload**: `{ email: string, auditData: object }`

## 3. Security Hardening
- **Firestore Rules**: Strict ABAC (Attribute-Based Access Control)
- **API Security**: CORS restricted, Rate-limiting active
- **Data Protection**: AES-256 encryption for PII
