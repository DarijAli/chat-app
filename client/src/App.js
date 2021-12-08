import "./App.scss"
import "./sass/main.scss"
import "antd/dist/antd.css"
import Chat from "./pages/Chat"
import io from "socket.io-client"
import { Button, Input } from "antd"
import { useState } from "react"

const socket = io.connect("http://localhost:3001")

function App() {
  const [userName, setUserName] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)
  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room)
      setShowChat(true)
    }
  }

  return (
    <>
      {!showChat ? (
        <>
          <div className="joinchat-container">
            <div className="joinchat-tab">
              <h3>Join Chat</h3>
              <div className="joinchat-input">
                <Input
                  placeholder="Username"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="joinchat-input">
                <Input
                  placeholder="Room Id"
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>
              <Button onClick={joinRoom} type="primary">
                {" "}
                Join Room{" "}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Chat socket={socket} userName={userName} room={room} />
      )}
    </>
  )
}

export default App
