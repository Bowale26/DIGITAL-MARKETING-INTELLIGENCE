# 🛡️ Security Specification: Flux Agency Multi-Tiered Governance

## 1. Data Invariants (Revised)
- **Role Isolation**: A `LEGAL_COUNSEL` can review `matters`, but only a `COMPLIANCE_OFFICER` can approve `proposals`.
- **Temporal Trust**: All `updatedAt` and `createdAt` fields MUST be `request.time`.
- **Identity Lock**: Once a `User` profile is associated with a `uid`, the `email` field is immutable to prevents account takeovers from altering history.
- **Audit Integrity**: `governance_logs` are write-only for users (append-only) and read-only for auditors.

## 2. The Dirty Dozen (Role-Based Payloads)
The following payloads MUST be rejected with `PERMISSION_DENIED`:

1. **Identity Spoofing**: `User` attempts to create an `Intake` for another user's `clientId`.
2. **Role Hijacking**: A `USER` attempts to update their own `role` to `ADMIN`.
3. **Counsel Leak**: `LEGAL_COUNSEL` attempts to read `governance_settings` without administrative permissions.
4. **Compliance Bypass**: `EXECUTIVE` attempts to approve a `proposal` bypassing the `COMPLIANCE_OFFICER` gate.
5. **Ghost Field Injection**: Adding `is_flagged: false` to a `matters` update during a client response.
6. **State Jumper**: Moving a `proposal` from `PENDING` to `APPROVED` without the mandatory 24-hour review period (simulated by timestamp check).
7. **Scraping Attack**: Running a `list` query on `governance_logs` without applying a `userId` filter.
8. **Resource Exhaustion**: Sending an `intake` with a `narrative` string exceeding 25k characters.
9. **Orphaned Writes**: Creating a `matter` pointing to a `serviceId` that does not exist in the system catalog.
10. **Shadow Log Delete**: A user attempts to delete their own `governance_logs` to hide suspicious activity.
11. **Metadata Deception**: Setting `risk_level` on an incident as a standard user.
12. **Method Smuggling**: Using a `batch` write to bypass the `isValidUser` schema validation.

## 3. Test Runner
Verification will be performed via `firestore.rules.test.ts` (drafted in the implementation).
