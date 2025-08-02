# `node-ipc-client`

Node client for [`golang-ipc`](https://github.com/james-barrow/golang-ipc) using Unix sockets on Linux/macOS and Named Pipes on Windows.

Rewrite/refactor of [`node-ipc-client`](https://github.com/james-barrow/node-ipc-client) as an ES6 class in TypeScript.

I know little about cryptography: assume the encryption here is not secure.

## Example

```ts
import { IpcClient } from "./node-ipc-client"

const client = new IpcClient('example') // (name, encryption: boolean = true, retryInterval: number = 2000)

try {
  await client.connect()
} catch (e) {
  console.error(e)
  return
}

// errors that arise from incoming messages
client.on('error', console.error) 
// connection could be closed by server
client.on('close', cleanup()) 
// hanle incoming messages
client.on(
  'data', 
  (e: IpcClientMessage) => console.log("data recvd: ", e.data)
) 

try {
  await client.write(0, 'hello from Node.js')
} catch (e) {
  console.error(e)
}
