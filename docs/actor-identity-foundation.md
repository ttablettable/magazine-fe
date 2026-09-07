# TTABLE actor identity foundation

TTABLE application state is stored in Neon Postgres through Prisma. GitHub remains
canonical for published story content and its revision history; story documents are
not copied into Neon.

## Connection strategy

The application uses Prisma ORM and Prisma Client 7.10.0 with
`@prisma/adapter-neon` 7.10.0 and `@neondatabase/serverless` 1.1.0. The runtime
reads `DATABASE_URL`, which should be Neon's pooled connection URL. Prisma CLI
migration and operator commands resolve connections in this order:
`DIRECT_URL`, `DATABASE_URL_UNPOOLED`, then `DATABASE_URL`. This keeps serverless
runtime traffic pooled, supports Neon's native environment output without manual
variable copying, and retains `DIRECT_URL` as a portable explicit override.

Prisma 7 requires a driver adapter for direct database access and supports Node 24.
The Neon adapter is generally available and uses Neon's serverless driver, which is
appropriate for Next.js route handlers deployed as Vercel functions. Generated
client code lives in `src/generated/prisma`, is ignored, and is recreated by the
safe `postinstall`/`db:generate` commands.

Schema history is committed under `prisma/migrations`. Development migrations use
`npm run db:migrate:dev`; reviewed production migrations later use
`npm run db:migrate:deploy`. Neither migration command is part of the application
build.

## Identity contract

- `Actor.id` is a TTABLE-generated UUID and is the canonical immutable actor ID.
- `ActorAuthIdentity` links provider identities. `(provider, providerUserId)` is
  unique, so one Privy DID resolves to one actor without making the DID the actor ID.
- `ActorWallet` stores verified linked credentials. EVM addresses use the `eip155`
  namespace and lowercase comparison form. Uniqueness is scoped to actor,
  namespace, and normalized address; no global ownership assertion is made.
- `ActorProfile` is keyed by actor ID. Handles and display names are nullable and
  never inferred from wallets, email, or Privy metadata. Handle uniqueness and
  normalization are intentionally deferred until product rules exist.
- `ActorRole` separately grants `editorial` or `admin`. Login never grants a role.

The first request for a verified Privy identity creates the actor, empty profile,
and identity link in one serializable transaction. The database unique constraint
and retry path make simultaneous first requests converge on the same actor.

## Authentication and authorization

The browser sends the Privy access token as `Authorization: Bearer <token>`. The
server verifies signature, issuer/audience, and expiry with `@privy-io/node` before
using the returned Privy user ID. It then fetches linked accounts from Privy's
server API and additively upserts verified EVM wallets. Browser-provided wallet
addresses are never trusted.

Capabilities are centralized in `src/lib/auth/authorization.ts`:

- ordinary actor: no privileged capabilities
- editorial: Desk access, review, publish, and moderation
- admin: all editorial capabilities plus role management

Use `hasCapability` or `requireCapability` in future privileged server routes.
Client authentication state is never an authorization decision.

## Operator role grant

Roles have no self-service endpoint. An operator supplies an existing canonical
actor UUID and an allowed role explicitly:

```bash
npm run actor:grant-role -- --actor-id <uuid> --role admin
```

The command validates actor existence and is idempotent. Use a direct development
or production connection intentionally for the environment being administered.
