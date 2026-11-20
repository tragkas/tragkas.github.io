# Portfolio Security Specification

## 1. Data Invariants

1. **Owner-Only Mutations**: Only an authenticated user with a verified Google email matching the portfolio owner (`george1tragas@gmail.com`) or listed in `/admins/{uid}` can create, update, or delete `/projects`, `/links`, `/media`, or `/profile` documents.
2. **Public Read-Only Showcase**: `/projects`, `/links`, `/media`, and `/profile` are publicly readable (`get` and `list`) so visitors can view the portfolio without signing in. No PII (private emails, phone numbers, addresses) is stored in these public collections.
3. **Immutable Ownership & Creation Timestamps**: `ownerUid` must equal `request.auth.uid` on creation and cannot be modified on update. `createdAt` must equal `request.time` on creation and cannot be modified on update; `updatedAt` must equal `request.time` on both create and update.
4. **Strict Key Allowlists & Size Bounds**: Every collection enforces `keys().hasAll(...) && keys().hasOnly(...)` on creation and `diff().affectedKeys().hasOnly(...)` on update, with strict string length bounds and URL scheme validation (`https://`, `http://`, `/`, or bounded `data:image/(png|jpeg|webp|gif);base64,`).
5. **Path ID Hardening**: Single-document operations validate document IDs against `^[a-zA-Z0-9_-]+$` (`<= 128` chars).

## 2. Adversarial "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)

1. **Unauthenticated Project Create**: Anonymous user attempts `POST /projects/p1` -> Denied (`request.auth == null`).
2. **Non-Owner Signed-In Create**: Different verified user (`attacker@example.com`) attempts `POST /projects/p1` -> Denied (`!isOwnerAdmin()`).
3. **Unverified Email Spoof**: User with `email == 'george1tragas@gmail.com'` and `email_verified == false` attempts write -> Denied (`email_verified == true` required).
4. **Shadow Field Injection on Project**: Owner attempts create with extra field `isAdmin: true` -> Denied (`keys().hasOnly(...)` rejects shadow fields).
5. **Identity Spoofing**: Owner attempts create with `ownerUid: "someone-else"` -> Denied (`ownerUid == request.auth.uid`).
6. **Immutable `createdAt` Tampering**: Owner attempts update changing `createdAt` -> Denied (`affectedKeys().hasOnly(...)` and `incoming().createdAt == existing().createdAt`).
7. **Forged Timestamp**: Owner attempts create with backdated `createdAt` (`!= request.time`) -> Denied.
8. **XSS URL Scheme in Project URL**: Owner attempts create with `url: "javascript:alert(1)"` -> Denied (`url.matches('^https?://.+')`).
9. **SVG XSS Data URI in Media**: Owner attempts create with `src: "data:image/svg+xml;base64,..."` -> Denied (`isValidMediaSrc` only allows `/...`, `https?://...`, or `data:image/(png|jpeg|webp|gif);base64,...`).
10. **Oversized Payload Poisoning**: Owner attempts create with 2MB `description` -> Denied (`size() <= 500`).
11. **Invalid Document ID Path Poisoning**: Owner attempts `POST /projects/..%2Fadmins%2Fx` or 200-char ID -> Denied (`isValidId()`).
12. **Privilege Escalation via `/admins`**: Any user attempts write to `/admins/{uid}` -> Denied (`allow write: if false`).
