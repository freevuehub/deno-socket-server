import { serve, ws } from './deps.ts'

const port: number = Number(Deno.env.get('PORT') || 8080)

for await(const request of serve({ port })) {
  const wsData={
    conn: request.conn,
    bufReader: request.r,
    bufWriter: request.w,
    headers: request.headers
  }

  try {
    const socketIo = await ws.acceptWebSocket(wsData)

    for await (const event of socketIo) {
      if (ws.isWebSocketCloseEvent(event)) {
        console.log('소켓이 닫힘..')

        break
      } else if (typeof event === 'string') {
        socketIo.send(event)
      }
    }
  } catch(err) {
    request.respond({
      status: 400,
      body: 'Server Error',
    })
  }
}
