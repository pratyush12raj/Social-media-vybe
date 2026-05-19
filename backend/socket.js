
import http from "http"
import express from "express"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)

// Allowed frontend URLs
const allowedOrigins = [
    "http://localhost:5173",
    "https://vybe-5xnf.onrender.com",
    "https://beautiful-jelly-681172.netlify.app"
]

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
})

const userSocketMap = {}

// Get socket id by user id
export const getSocketId = (receiverId) => {
    return userSocketMap[receiverId]
}

io.on("connection", (socket) => {

    console.log("User connected:", socket.id)

    const userId = socket.handshake.query.userId

    if (userId) {
        userSocketMap[userId] = socket.id
    }

    // Send online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {

        console.log("User disconnected:", socket.id)

        delete userSocketMap[userId]

        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

// Export everything used in project
export { app, server, io }
