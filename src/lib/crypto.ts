import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto"

export type EncryptedField = {
  dek: string
  dekIv: string
  iv: string
  ciphertext: string
  v: 1
}

const toB64 = (b: Buffer) => b.toString("base64")
const fromB64 = (s: string) => Buffer.from(s, "base64")
export const randomId = (bytes = 16) => toB64(randomBytes(bytes))

function getKek(): Buffer {
  const b64 = process.env.ENCRYPTION_KEK
  if (!b64) throw new Error("Missing ENCRYPTION_KEK")
  const buf = Buffer.from(b64, "base64")
  if (buf.length !== 32) throw new Error("ENCRYPTION_KEK must be 32 bytes Base64")
  return buf
}

export function encryptField<T>(value: T) {
  const dek = randomBytes(32)
  const ivPayload = randomBytes(12)
  const c1 = createCipheriv("aes-256-gcm", dek, ivPayload)
  const pt = Buffer.from(JSON.stringify(value))
  const ct = Buffer.concat([c1.update(pt), c1.final()])
  const tag = c1.getAuthTag()
  const payload = Buffer.concat([ct, tag])

  const kek = getKek()
  const ivDek = randomBytes(12)
  const c2 = createCipheriv("aes-256-gcm", kek, ivDek)
  const dekCt = Buffer.concat([c2.update(dek), c2.final()])
  const dekTag = c2.getAuthTag()
  const dekPayload = Buffer.concat([dekCt, dekTag])

  return { dek: toB64(dekPayload), dekIv: toB64(ivDek), iv: toB64(ivPayload), ciphertext: toB64(payload), v: 1 as const }
}

export function decryptField<T = unknown>(p: EncryptedField): T {
  const kek = getKek()
  const ivDek = fromB64(p.dekIv)
  const dekBuf = fromB64(p.dek)
  const dekCt = dekBuf.subarray(0, dekBuf.length - 16)
  const dekTag = dekBuf.subarray(dekBuf.length - 16)
  const d2 = createDecipheriv("aes-256-gcm", kek, ivDek)
  d2.setAuthTag(dekTag)
  const dek = Buffer.concat([d2.update(dekCt), d2.final()])

  const ivPayload = fromB64(p.iv)
  const payBuf = fromB64(p.ciphertext)
  const ct = payBuf.subarray(0, payBuf.length - 16)
  const tag = payBuf.subarray(payBuf.length - 16)
  const d1 = createDecipheriv("aes-256-gcm", dek, ivPayload)
  d1.setAuthTag(tag)
  const plain = Buffer.concat([d1.update(ct), d1.final()])
  return JSON.parse(plain.toString("utf8")) as T
}