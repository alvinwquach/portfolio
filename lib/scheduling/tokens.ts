/**
 * Token Utilities — JWT Signing, Verification, and Hashing
 * ========================================================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This handles all the cryptographic token operations for the scheduling
 * system: creating JWTs, verifying them, and hashing them for storage.
 *
 * THE TOKEN FLOW (for junior devs):
 * ---------------------------------
 * Tokens are used for secure, stateless links in emails. Here's the flow:
 *
 *   1. USER SUBMITS BOOKING FORM
 *      → We generate a JWT containing { bookingId, email }
 *      → We hash the JWT with SHA-256
 *      → We store the HASH in Sanity (never the raw JWT)
 *      → We send the raw JWT in the verification email link
 *
 *   2. USER CLICKS EMAIL LINK
 *      → URL contains the raw JWT: /api/schedule/verify?token=eyJhbG...
 *      → We verify the JWT signature (proves we created it)
 *      → We verify it hasn't expired
 *      → We hash the JWT again
 *      → We look up the booking in Sanity by matching the hash
 *      → If found, we know this is a legitimate verification
 *
 * WHY JOSE INSTEAD OF JSONWEBTOKEN?
 * ----------------------------------
 * The spec requires jose. The key reason: jose works in Edge Runtime
 * (Vercel Edge Functions, Cloudflare Workers), while jsonwebtoken
 * requires Node.js crypto module which isn't available in Edge.
 *
 * Since Next.js API routes can run on Edge, jose keeps our options open.
 *
 * WHY HASH BEFORE STORING?
 * ------------------------
 * If we stored raw JWTs in Sanity and someone gained read access to
 * the Sanity project, they could use those JWTs to verify emails,
 * cancel bookings, etc. By storing only the hash:
 *   - The hash can't be reversed back to the JWT
 *   - The JWT only exists in the user's email
 *   - Even leaked hashes are useless without the original JWT
 *
 * This is the same principle used for password storage (bcrypt, etc.)
 * but simpler because we don't need salting — each JWT is unique.
 */

import { SignJWT, jwtVerify } from 'jose'
import { createHash } from 'crypto'

// ═══════════════════════════════════════════
// SECRET KEY
// ═══════════════════════════════════════════

/**
 * Get the signing secret as a Uint8Array.
 *
 * WHY Uint8Array?
 * jose requires the secret as raw bytes (Uint8Array), not a string.
 * TextEncoder converts a string to its UTF-8 byte representation.
 *
 * WHY A FUNCTION INSTEAD OF A CONSTANT?
 * Environment variables aren't available at module load time in some
 * contexts (Edge Runtime, testing). A function defers the read to
 * when it's actually called.
 *
 * PSEUDOCODE:
 *   function getSecret():
 *     read SCHEDULING_TOKEN_SECRET from environment
 *     if missing: throw error (fail fast — don't silently use empty secret)
 *     convert string to byte array
 *     return byte array
 */
function getSecret(): Uint8Array {
  const secret = process.env.SCHEDULING_TOKEN_SECRET
  if (!secret) {
    throw new Error('Missing SCHEDULING_TOKEN_SECRET environment variable')
  }
  return new TextEncoder().encode(secret)
}

// ═══════════════════════════════════════════
// CORE FUNCTIONS
// ═══════════════════════════════════════════

/**
 * Sign a JWT with the scheduling secret.
 *
 * WHAT THIS DOES:
 *   1. Takes a payload (object with data to embed in the token)
 *   2. Signs it with HS256 (HMAC-SHA256) algorithm
 *   3. Sets an expiry time
 *   4. Returns the signed JWT string
 *
 * HOW JWTs WORK (simplified):
 *   A JWT has three parts separated by dots: header.payload.signature
 *   - Header: { "alg": "HS256", "typ": "JWT" } (base64)
 *   - Payload: your data + iat (issued at) + exp (expiry) (base64)
 *   - Signature: HMAC-SHA256(header + "." + payload, secret)
 *
 *   Anyone can READ the payload (it's just base64, not encrypted).
 *   But only someone with the secret can CREATE a valid signature.
 *   That's how we verify authenticity — recalculate the signature
 *   and check if it matches.
 *
 * @param payload - Data to embed in the JWT
 * @param expiresIn - Duration string (e.g., '1h', '7d', '15m')
 * @returns The signed JWT string (e.g., "eyJhbGciOiJIUzI1NiJ9.eyJ...")
 */
export async function signToken(
  payload: Record<string, unknown>,
  expiresIn: string
): Promise<string> {
  // PSEUDOCODE:
  // create a new JWT builder
  // set the payload (our custom data)
  // set the "protected header" (algorithm = HS256)
  // set the issued-at time to now
  // set the expiration time based on expiresIn string
  // sign it with our secret key
  // return the resulting JWT string

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret())
}

/**
 * Verify a JWT and return its payload, or null if invalid.
 *
 * WHAT THIS DOES:
 *   1. Takes a JWT string (from a URL parameter, usually)
 *   2. Verifies the signature matches (proves we created it)
 *   3. Checks it hasn't expired
 *   4. Returns the payload data, or null if anything is wrong
 *
 * WHY RETURN NULL INSTEAD OF THROWING?
 * In the API routes, an invalid token is an expected case (expired link,
 * tampered URL, etc.), not a crash. Returning null lets callers use
 * simple if-checks instead of try-catch blocks:
 *
 *   const payload = await verifyToken<VerificationPayload>(token)
 *   if (!payload) return errorResponse('Invalid token')
 *
 * THE GENERIC TYPE PARAMETER <T>:
 * We cast the payload to whatever type the caller expects.
 * This gives TypeScript knowledge of what fields are available:
 *
 *   const payload = await verifyToken<ActionTokenPayload>(token)
 *   // TypeScript knows: payload.type, payload.bookingId, etc.
 *
 * @param token - The JWT string to verify
 * @returns The payload as type T, or null if verification fails
 */
export async function verifyToken<T>(token: string): Promise<T | null> {
  try {
    // PSEUDOCODE:
    // try:
    //   verify the JWT signature using our secret
    //   check the token hasn't expired (jwtVerify does this automatically)
    //   extract the payload from the verified result
    //   return the payload cast to type T
    // catch any error:
    //   return null (token is invalid, expired, or tampered with)

    const { payload } = await jwtVerify(token, getSecret())
    return payload as T
  } catch {
    // This catches: expired tokens, bad signatures, malformed JWTs,
    // wrong algorithm, and any other verification failure.
    return null
  }
}

/**
 * Hash a token string using SHA-256.
 *
 * WHAT THIS DOES:
 *   Takes a string (usually a raw JWT) and returns its SHA-256 hash.
 *   The hash is stored in Sanity instead of the raw token.
 *
 * PROPERTIES OF SHA-256:
 *   - Deterministic: same input always produces same output
 *   - One-way: can't reverse the hash to get the original input
 *   - Unique: different inputs produce different outputs (collision-resistant)
 *   - Fixed length: always 64 hex characters regardless of input length
 *
 * EXAMPLE:
 *   hashToken("eyJhbGciOi...")
 *   → "a3f5b2c1d4e6..."  (64 hex chars)
 *
 * @param token - The string to hash
 * @returns SHA-256 hex digest (64 characters)
 */
export function hashToken(token: string): string {
  // PSEUDOCODE:
  // create a SHA-256 hash object
  // feed the token string into it
  // output the hash as a hexadecimal string
  // return the hex string

  return createHash('sha256').update(token).digest('hex')
}

// ═══════════════════════════════════════════
// SPECIALIZED TOKEN GENERATORS
// ═══════════════════════════════════════════
// These wrap signToken + hashToken for specific use cases.
// Each returns both the raw JWT (for email links) and the hash (for Sanity).

/**
 * Generate a verification JWT for email verification.
 *
 * WHEN IS THIS USED?
 * After a user submits the booking form:
 *   1. We call this function
 *   2. Put the raw `token` in the verification email link
 *   3. Store the `hash` in the Sanity document
 *
 * The token expires in 1 hour (short because it's just for email verification).
 *
 * @param bookingId - The Sanity _id of the new booking document
 * @param email - The requester's email (embedded in token for extra validation)
 * @returns { token: raw JWT for email, hash: SHA-256 for Sanity storage }
 */
export async function generateVerificationJWT(
  bookingId: string,
  email: string
): Promise<{ token: string; hash: string }> {
  // PSEUDOCODE:
  // create a JWT payload with:
  //   type = "verification" (identifies what this token is for)
  //   bookingId = which booking this verifies
  //   email = the email being verified (double-check on verify)
  // sign it with 1-hour expiry
  // hash the raw token
  // return both the raw token and its hash

  const token = await signToken(
    { type: 'verification', bookingId, email },
    '1h'
  )
  const hash = hashToken(token)
  return { token, hash }
}

/**
 * Generate a cancel or reschedule JWT.
 *
 * WHEN IS THIS USED?
 * After Alvin confirms a booking (in the webhook handler):
 *   1. Generate a cancel token and a reschedule token
 *   2. Store both hashes in the Sanity document
 *   3. Put the raw JWTs in the confirmation email links
 *
 * These tokens expire in 7 days (longer because the meeting might be
 * a week away and the user needs time to cancel/reschedule).
 *
 * @param type - 'cancel' or 'reschedule'
 * @param bookingId - The Sanity _id of the booking
 * @returns { token: raw JWT for email, hash: SHA-256 for Sanity storage }
 */
export async function generateActionJWT(
  type: 'cancel' | 'reschedule',
  bookingId: string
): Promise<{ token: string; hash: string }> {
  // PSEUDOCODE:
  // create token hash first (will be embedded in JWT AND stored in Sanity)
  // wait, that's circular... let's do it differently:
  //
  // 1. sign the JWT with type and bookingId
  // 2. hash the resulting JWT
  // 3. return both
  //
  // The hash in Sanity is how we look up the booking when the user
  // clicks the link. The JWT proves they're authorized (signed by us).

  const token = await signToken(
    { type, bookingId },
    '7d'
  )
  const hash = hashToken(token)
  return { token, hash }
}

/**
 * Generate a private scheduling link JWT.
 *
 * WHEN IS THIS USED?
 * When Alvin creates a new schedulingToken in Sanity Studio:
 *   1. Generate the JWT with the token document's ID
 *   2. The resulting URL is: /schedule/{jwt}
 *   3. Send this URL to the recipient
 *
 * The JWT expires in 7 days (matching the schedulingToken.expiresAt).
 *
 * @param tokenId - The Sanity _id of the schedulingToken document
 * @returns The signed JWT string
 */
export async function generatePrivateLinkJWT(
  tokenId: string
): Promise<string> {
  // PSEUDOCODE:
  // sign a JWT with:
  //   type = "private_link" (identifies this as a private scheduling token)
  //   tokenId = which schedulingToken document to look up
  // expire in 7 days
  // return the raw JWT (caller will hash it for Sanity storage)

  return signToken(
    { type: 'private_link', tokenId },
    '7d'
  )
}
