// // Replace these with your actual bot token and user chat ID
// const BOT_TOKEN = '7897610133:AAEP5LlIY71d1Qvjq_xeQcH6rLitfObcyrw'
// const CHAT_ID = 'TELEGRAM_USER_CHAT_ID'

// // Start the WebSocket server
// const server = Bun.serve({
//   port: 8080,
//   fetch(req, server) {
//     // Check if the request is a WebSocket upgrade request
//     if (req.headers.get('upgrade') !== 'websocket') {
//       return new Response('Expected WebSocket', { status: 400 })
//     }

//     // Upgrade the connection to a WebSocket
//     return server.upgrade(req, {
//       data: {}
//     })
//   },
//   websocket: {
//     open(ws) {
//       console.log('WebSocket connection opened')
//     },
//     message(ws, message) {
//       // Handle incoming messages
//       console.log('Received message:', message)
//       sendTelegramMessage(message)
//     },
//     close(ws, code, reason) {
//       console.log(`WebSocket connection closed: ${code} ${reason}`)
//     }
//   }
// })

// // Function to send a message to a Telegram user
// async function sendTelegramMessage(text: any) {
//   const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         chat_id: CHAT_ID,
//         text: text
//       })
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error('Failed to send message to Telegram:', errorText)
//     } else {
//       console.log('Message sent to Telegram successfully')
//     }
//   } catch (error) {
//     console.error('Error sending message to Telegram:', error)
//   }
// }

// console.log('WebSocket server is running on ws://localhost:8080/')
