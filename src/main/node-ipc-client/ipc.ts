/**
 * TypeScript IPC client for https://github.com/james-barrow/node-ipc--client
 * Compprivateely rewritten in TS as an ES6 class
 * Original is available under MIT license
 * Server code for Go is at https://github.com/james-barrow/golang-ipc
 */

import { createECDH, createHash } from 'crypto'
import { Socket, createConnection, connect as netConnect } from 'net'
import { platform } from 'os'
import { Handler, TypedEventEmitter } from './TypedEventEmitter'
import { decrypt, encrypt, getMsgLen, intToBytes } from './util'

const VERSION = 2 // needed for compatibility with Go server code

export type IpcClientMessage = {
  type: number | undefined
  data: Buffer | undefined
}

export type IpcClientEventTypes = {
  data: [IpcClientMessage]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: [any] // catch (e: any)
  close: [string]
}
export type IpcClientEventKeys = keyof IpcClientEventTypes

export enum ClientStatus {
  NOT_CONNECTED,
  CONNECTING,
  CONNECTED,
  RECONNECTING,
  CLOSED
}

const ClientStatusMap = new Map<ClientStatus, string>([
  [ClientStatus.NOT_CONNECTED, 'Not Connected'],
  [ClientStatus.CONNECTED, 'Connected'],
  [ClientStatus.CONNECTING, 'Connecting'],
  [ClientStatus.RECONNECTING, 'Reconnecting'],
  [ClientStatus.CLOSED, 'Closed']
])

enum HandshakeStatus {
  GET_VER_ENC,
  SEND_1_RECV_0,
  GET_PUBKEY,
  SEND_PUBKEY,
  GET_MAX_MSG_LEN,
  SEND_REPLY
}

export class IpcClient {
  private name: string
  private event: TypedEventEmitter<IpcClientEventTypes>
  private connection: Socket
  private clientStatus: ClientStatus
  private enforceEncryption: boolean
  private handshakeStatus: HandshakeStatus
  private retryInterval: number
  private encryptionActive = false
  private sharedKey
  private maxMsgSize

  constructor(name: string, encryption: boolean = true, retryInterval: number = 2000) {
    if (!name) {
      throw new Error('name cannot be empty!')
    }
    this.event = new TypedEventEmitter<IpcClientEventTypes>()
    this.name = name
    this.connection = new Socket()
    this.clientStatus = ClientStatus.NOT_CONNECTED
    // clunky, but makes porting easier as original code used int {0..5}
    this.handshakeStatus = HandshakeStatus[HandshakeStatus[0]]
    this.enforceEncryption = encryption
    this.retryInterval = retryInterval
  }

  get status(): string {
    return ClientStatusMap.get(this.clientStatus) ?? 'Unknown'
  }

  public on(type: IpcClientEventKeys, handler: Handler): void {
    return this.event.on(type, handler)
  }

  public connect(): Promise<boolean> {
    return new Promise((res, rej) => {
      this.clientStatus = ClientStatus.CONNECTING // 1
      if (platform() === 'win32') {
        this.namedPipe().then(res).catch(rej)
      } else {
        this.unixSocket().then(res).catch(rej)
      }
    })
  }

  public write(msgType: Buffer | number, data: Buffer | string): Promise<void> {
    return new Promise((res, rej) => {
      let message: Buffer | null = null
      if (
        this.clientStatus !== ClientStatus[ClientStatus[2]] || // CONNECTED
        this.handshakeStatus !== HandshakeStatus[HandshakeStatus[5]]
      ) {
        throw new Error('write failed - not connected to server')
      }

      if (typeof data === 'string') {
        message = Buffer.from(data)
      } else if (Buffer.isBuffer(data)) {
        message = data
      } else {
        throw new Error('write failed - data was not string or Buffer')
      }

      if (message.length > this.maxMsgSize) {
        throw new Error('write failed - message exceeds maximum message size')
      }

      if (typeof msgType === 'number') {
        msgType = intToBytes(msgType)
      }

      let encBuffer: Buffer
      let msgLen: Buffer
      let toSendBuffer: Buffer

      if (this.encryptionActive) {
        encBuffer = encrypt(Buffer.concat([msgType, message]), this.sharedKey)
        msgLen = intToBytes(encBuffer.length)
        toSendBuffer = Buffer.concat([msgLen, encBuffer])
      } else {
        msgLen = intToBytes(Buffer.concat([msgType, message]).length)
        toSendBuffer = Buffer.concat([msgLen, msgType, message])
      }

      let result
      try {
        result = this.connection.write(toSendBuffer)
        this.connection.on('drain', console.log)
        console.log(result)
      } catch (e) {
        console.error(e)
        rej(e)
      }
      res()
    })
  }

  public close(): void {
    this.connection.end()
    this.clientStatus = ClientStatus[ClientStatus[4]] // CLOSED
  }

  // Win32
  private namedPipe(): Promise<boolean> {
    return new Promise((res, rej) => {
      const PIPE_PATH = '\\\\.\\pipe\\' + this.name

      try {
        this.connection = netConnect(PIPE_PATH, () => {
          if (this.clientStatus === ClientStatus[ClientStatus[4]] /* CLOSED */) {
            this.connection.end()
            res(false)
          }
        })

        this.connection.on('readable', () => {
          this.readReceived()
        })
        this.connection.on('end', () => {
          this.connectionClosed()
        })
        this.connection.on('error', () => {
          this.connectionClosed()
        })

        res(true)
      } catch (e) {
        rej(e)
      }
    })
  }

  private unixSocket(): Promise<boolean> {
    return new Promise((res, rej) => {
      const base = '/tmp/'
      const sock = base + this.name + '.sock'

      try {
        this.connection = createConnection(sock).on('connect', () => {
          if (this.clientStatus === ClientStatus[ClientStatus[4]] /* CLOSED */) {
            console.log('closing')
            this.connection.end()
            res(false)
          }

          this.connection.on('readable', () => {
            this.readReceived()
          })
          this.connection.on('end', () => {
            this.connectionClosed()
          })
          this.connection.on('error', () => {
            this.connectionClosed()
          })

          res(true)
        })
      } catch (e) {
        rej(e)
      }
    })
  }

  private connectionClosed(): void {
    if (this.clientStatus !== ClientStatus.CLOSED /* 4 */) {
      if (this.clientStatus === ClientStatus.CONNECTED /* 2 */) {
        this.clientStatus = ClientStatus[ClientStatus[3]] // RECONNECTING
        this.handshakeStatus = HandshakeStatus[HandshakeStatus[0]]
        this.encryptionActive = false
        this.sharedKey = ''
        this.event.emit('close', 'connectionClosed - connection has closed')
      }

      setTimeout(() => {
        if (platform() === 'win32') {
          this.namedPipe()
        } else {
          this.unixSocket()
        }
      }, this.retryInterval)
    } else {
      this.event.emit('close', 'connectionClosed - connection has closed')
    }
  }

  private readReceived(): void {
    if (this.handshakeStatus !== HandshakeStatus[HandshakeStatus[5]]) {
      if (!this.handshake(this.connection.read())) {
        this.clientStatus = ClientStatus.NOT_CONNECTED // 0
        this.connection.end()
      }
    } else {
      let len: number | null = null
      try {
        len = getMsgLen(this.connection.read(4))
      } catch (e) {
        this.event.emit('error', e)
      }

      if (len !== null) {
        this.processMessage(this.connection.read(len))
      }

      if (this.connection.readableLength !== 0) {
        this.readReceived()
      }
    }
  }

  private processMessage(data: Buffer): void {
    if (data.length < 5) {
      this.event.emit('error', 'processMessage - message is too short')
    } else {
      let copy: Buffer | null

      if (this.encryptionActive) {
        try {
          copy = decrypt(data, this.sharedKey)
        } catch (e) {
          this.event.emit('error', 'processMessage - decrypt error: ' + e)
          copy = null
        }
      } else {
        copy = data
      }

      const message = {
        type: copy?.subarray(0, 4).readUInt32BE(),
        data: copy?.subarray(4)
      }

      this.event.emit('data', message)
    }
  }

  private handshake(data: Buffer): boolean {
    switch (this.handshakeStatus) {
      case HandshakeStatus[HandshakeStatus[0]]: // GET_VER_ENC: received version and enc
        if (!this.one(data)) {
          this.handshakeStatus = HandshakeStatus[HandshakeStatus[0]]
          return false
        } else {
          this.handshakeStatus = this.enforceEncryption
            ? HandshakeStatus[HandshakeStatus[2]]
            : HandshakeStatus[HandshakeStatus[4]]
          return true
        }
      case HandshakeStatus[HandshakeStatus[2]]: // GET_PUBKEY: received public key from server
        if (this.keyExchange(data)) {
          this.handshakeStatus = HandshakeStatus[HandshakeStatus[4]]
          return true
        }
        break
      case HandshakeStatus[HandshakeStatus[4]]: // GET_MAX_MSG_LEN: received max message length
        if (this.chkMsgLen(data)) {
          this.handshakeStatus = HandshakeStatus[HandshakeStatus[5]]
          this.encryptionActive = this.enforceEncryption
          this.clientStatus = ClientStatus.CONNECTED // 2
          return true
        }
        break
      default:
        return false
    }
    return false
  }

  private one(data): boolean {
    if (!data) {
      return false
    }

    if (data.length !== 2) {
      this.event.emit('error', 'one - handshake message is wrong length')
      return false
    }

    const buf = Buffer.alloc(1)

    if (data[0] !== VERSION) {
      buf[0] = 1
      this.event.emit('error', 'one - server has sent wrong version number')
    } else {
      if (data[1] !== 1 && this.enforceEncryption) {
        buf[0] = 2
        this.event.emit('error', 'one - server tried to connect without encryption')
      } else {
        buf[0] = 0
      }
    }

    try {
      this.connection.write(buf)
    } catch (e) {
      this.event.emit('error', "one - initial handshake message - couldn't send reply: " + e)
      return false
    }

    return buf[0] === 0
  }

  private keyExchange(recvdPubkey): boolean {
    if (recvdPubkey === null) {
      return false
    }

    if (recvdPubkey.length !== 97) {
      this.event.emit('error', 'keyExchange - public key received is wrong length')
      return false
    }

    const key = createECDH('secp384r1')
    const pub = key.generateKeys()

    try {
      this.connection.write(pub)
    } catch (e) {
      this.event.emit('error', "keyExchange - couldn't send pubkey: " + e)
      return false
    }

    if (pub.length !== 97) {
      this.event.emit('error', 'keyExchange - created pubkey is wrong length')
      return false
    }

    this.sharedKey = createHash('sha256').update(key.computeSecret(recvdPubkey)).digest()

    return true
  }

  private chkMsgLen(data: Buffer): boolean {
    if (!data) {
      return false
    }

    const len = data.subarray(0, 4).readUInt32BE()
    const msg = data.subarray(4)

    if (msg.length !== len) {
      this.event.emit('error', 'chkMsgLen - message length data is itself the wrong length')
      return false
    }

    let size: Buffer | null
    if (!this.enforceEncryption) {
      size = msg
    } else {
      try {
        size = decrypt(msg, this.sharedKey)
      } catch (e) {
        this.event.emit('error', 'chkMsgLen - decryption failed: ' + e)
        size = null
      }

      if (!size) {
        this.event.emit('error', 'chkMsgLen - unable to decrypt message length')
        return false
      }

      if (size.length !== 4) {
        this.event.emit('error', 'chkMsgLen - message length data is itself the wrong length')
        return false
      }
    }
    this.maxMsgSize = size?.subarray(0, 4).readUInt32BE() ?? 0 // error?

    const buf = Buffer.alloc(1)
    buf[0] = 0

    try {
      this.connection.write(buf)
    } catch (e) {
      this.event.emit('error', 'checkMsgLen - handshake: unable to send message length reply: ' + e)
      return false
    }

    return true
  }
}
