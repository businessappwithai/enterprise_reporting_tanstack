import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;
const KEY_LENGTH = 32;

/**
 * Nothing in this file logs the key, a property of the key, or a decrypted
 * value.
 *
 * It used to log all three, on the normal path: twenty-four `[ENCRYPTION
 * DEBUG]` lines per call, reporting whether `ENCRYPTION_KEY` was set, its
 * length, whether it was hex, the derived key's length — and, at the end of
 * `decrypt`, the first 200 characters of the plaintext. For a data source that
 * is the whole connection config, so every `docker compose logs` carried
 *
 *     {"host":"…","port":5432,"database":"…","user":"…","password":"…"}
 *
 * in the clear. Storing that config AES-256-GCM encrypted stops meaning
 * anything the moment the plaintext is written to a log, which is collected,
 * shipped and retained by whatever runs the process, usually under far weaker
 * access control than the row it came from.
 *
 * The key-shape lines were the same mistake one step removed: length and
 * character class are exactly what an attacker who has the logs wants to know
 * before attacking the key.
 *
 * What survives is the one line that was load-bearing — the warning that no key
 * is configured and a hard-coded development key is in use — and the failure
 * path, which reports that decryption failed without reproducing either input.
 */
function getKey(): Buffer {
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!encryptionKey) {
    console.warn(
      "[encryption] ENCRYPTION_KEY is not set — falling back to a hard-coded " +
        "development key. Stored data-source passwords are NOT protected. Set " +
        "ENCRYPTION_KEY (64 hex characters) before storing anything real."
    );
    return crypto.scryptSync("default-dev-key-change-in-production", "salt", KEY_LENGTH);
  }

  if (/^[0-9a-fA-F]+$/.test(encryptionKey)) {
    return Buffer.from(encryptionKey, "hex");
  }

  return crypto.scryptSync(encryptionKey, "salt", KEY_LENGTH);
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Combine IV + AuthTag + Encrypted data
  return iv.toString("hex") + authTag.toString("hex") + encrypted;
}

export function decrypt(ciphertext: string): string {
  const key = getKey();

  const minimumLength = (IV_LENGTH + AUTH_TAG_LENGTH) * 2;
  if (ciphertext.length < minimumLength) {
    // The length is the diagnosis; the ciphertext itself adds nothing to it.
    throw new Error(
      `Invalid ciphertext length: ${ciphertext.length}. Expected at least ${minimumLength} characters (IV + auth tag).`
    );
  }

  try {
    const iv = Buffer.from(ciphertext.slice(0, IV_LENGTH * 2), "hex");
    const authTag = Buffer.from(
      ciphertext.slice(IV_LENGTH * 2, (IV_LENGTH + AUTH_TAG_LENGTH) * 2),
      "hex"
    );
    const encrypted = ciphertext.slice((IV_LENGTH + AUTH_TAG_LENGTH) * 2);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    // The message and name are enough to tell a wrong key from a corrupt row.
    // Neither the ciphertext nor anything derived from the key goes in.
    console.error(
      "[encryption] decryption failed:",
      error instanceof Error ? `${error.name}: ${error.message}` : String(error)
    );
    throw error;
  }
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(":");
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return hash === verifyHash;
}

export function generateApiKey(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("base64url");
}
