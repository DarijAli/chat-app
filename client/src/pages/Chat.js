import { Col, Row } from "antd"
import React from "react"
import Chats from "../components/chat/Chats"

const Chat = ({ socket, userName, room }) => {
  return (
    <div className="chat">
      <div className="chat-container">
        <Row gutter={32}>
          <Col md={24}>
            <Chats socket={socket} userName={userName} room={room} />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Chat
