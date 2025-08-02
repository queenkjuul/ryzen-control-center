import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

export function getMsgLen(b: Buffer | null): number | null {
  if (!b) {
    return null
  }

  if (b.length !== 4) {
    throw new Error('getMsgLen - message length is wrong')
  }

  const len = b.readUInt32BE()

  if (isNaN(len)) {
    throw new Error('getMsgLen - message length isNaN')
  }

  return len
}

export function encrypt(data: Buffer, sharedKey: string): Buffer {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', sharedKey, iv)
  const encBuffer = Buffer.concat([cipher.update(data), cipher.final()])
  const tag = cipher.getAuthTag()

  return Buffer.concat([iv, encBuffer, tag])
}

export function decrypt(data: Buffer, sharedKey): Buffer {
  const nonceSize = 12
  const gcmTagSize = 16
  const decode = Buffer.from(data)
  const nonce = decode.subarray(0, nonceSize)
  const cText = decode.subarray(nonceSize, decode.length - gcmTagSize)
  const tag = decode.subarray(decode.length - gcmTagSize)
  const decipher = createDecipheriv('aes-256-gcm', sharedKey, nonce)
  decipher.setAuthTag(tag)

  return decipher.update(cText)
}

export function intToBytes(i: number): Buffer {
  const buf = Buffer.alloc(4)
  buf.writeUInt32BE(i)
  return buf
}
