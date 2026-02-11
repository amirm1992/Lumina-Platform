import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const TAG_LENGTH = 16

/**
 * Get the encryption key from environment variable.
 * Must be a 64-character hex string (32 bytes).
 * Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
function getKey(): Buffer {
    const key = process.env.SSN_ENCRYPTION_KEY
    if (!key || key.length !== 64) {
        throw new Error('SSN_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)')
    }
    return Buffer.from(key, 'hex')
}

/**
 * Encrypt a plaintext string (e.g. SSN).
 * Returns a base64 string containing IV + ciphertext + auth tag.
 */
export function encrypt(plaintext: string): string {
    const key = getKey()
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final(),
    ])
    const tag = cipher.getAuthTag()

    // Pack: IV (12) + encrypted + tag (16)
    const packed = Buffer.concat([iv, encrypted, tag])
    return packed.toString('base64')
}

/**
 * Decrypt a string that was encrypted with encrypt().
 */
export function decrypt(encryptedBase64: string): string {
    const key = getKey()
    const packed = Buffer.from(encryptedBase64, 'base64')

    const iv = packed.subarray(0, IV_LENGTH)
    const tag = packed.subarray(packed.length - TAG_LENGTH)
    const ciphertext = packed.subarray(IV_LENGTH, packed.length - TAG_LENGTH)

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)

    const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
    ])

    return decrypted.toString('utf8')
}
