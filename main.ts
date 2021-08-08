import {
  Application,
  Router,
  acceptWebSocket,
  acceptable,
  WebSocket,
  isWebSocketCloseEvent,
  v4,
} from './deps.ts'

const users = new Map<string, WebSocket>();

function broadcast(message: string, senderId?: string): void {
  if (!message) return;
  for (const user of users.values()) {
    user.send(senderId ? `[${senderId}]: ${message}` : message);
  }
}

export async function chat(ws: WebSocket): Promise<void> {
  const userId = v4.generate();

  console.log(userId)

  // Register user connection
  users.set(userId, ws);
  broadcast(`${userId} is connected`);

  // Wait for new messages
  for await (const event of ws) {
    const message = typeof event === "string" ? event : ""

    broadcast(message, userId);

    // Unregister user connection
    if (!message && isWebSocketCloseEvent(event)) {
      users.delete(userId);
      broadcast(`${userId} is disconnected`);
      break;
    }
  }
}

const port = Number(Deno.env.get('PORT') || 8080)
const app = new Application()
const router = new Router()

router.get('/', (context) => {
  context.response.body = 'Hello World'
})
router.get('/ws', async (context) => {
  // const sock = await context.upgrade()

  // console.log('context')
  // console.log(sock)

  // if (acceptable(context.request.serverRequest)) {
  //   const request = context.request.serverRequest
  //   const socket = await acceptWebSocket({
  //     conn: request.conn,
  //     bufReader: request.r,
  //     bufWriter: request.w,
  //     headers: request.headers,
  //   })
  //
  //   console.log('socket')
  //
  //   await chat(socket)
  // } else {
  //   throw new Error('Error when connecting websocket')
  // }
})


app.use(router.routes())
app.use(router.allowedMethods())

console.log(port)

await app.listen({ port })
















// import { serve, ws } from './deps.ts'
//
// const port: number = Number(Deno.env.get('PORT') || 8080)
//
// for await(const request of serve({ port })) {
//   const wsData = {
//     conn: request.conn,
//     bufReader: request.r,
//     bufWriter: request.w,
//     headers: request.headers
//   }
//
//   try {
//     console.log(request.conn)
//     console.log(request.headers)
//
//     const socketIo = await ws.acceptWebSocket(wsData)
//
//     // console.log(socketIo)
//
//     for await (const event of socketIo) {
//       if (ws.isWebSocketCloseEvent(event)) {
//         console.log('소켓이 닫힘..')
//
//         break
//       } else if (typeof event === 'string') {
//         socketIo.send(event)
//       }
//     }
//   } catch(err) {
//     request.respond({
//       status: 400,
//       body: 'Server Error',
//     })
//   }
// }
