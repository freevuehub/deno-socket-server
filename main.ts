import { WebSocketClient, WebSocketServer } from './deps.ts'

const wss = new WebSocketServer(Number(Deno.env.get('PORT') || 8080))

wss.on('connection', (ws: WebSocketClient) => {
  console.log('socket connected!')

  ws.on('message', (message: string) => {
    console.log(message)

    ws.send(message)
  })
})
