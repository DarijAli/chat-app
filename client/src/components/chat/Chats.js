import { Form, Input } from "antd"
import React, { useEffect, useState } from "react"
import UserIcon from "../../assets/images/User.svg"
import SendButton from "../../assets/images/SendButton.svg"
import EmojiButton from "../../assets/images/EmojiButton.svg"
import Picker from "emoji-picker-react"
import { useComponentVisible } from "../../hooks/CustomHooks"
import UploadClip from "../../assets/images/UploadClip.svg"
import ScrollToBottom from "react-scroll-to-bottom"

const { TextArea } = Input

const Chats = ({ socket, userName, room }) => {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState([])

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false)

  const [visible, setVisible] = useState(false)

  const onEmojiClick = (e, emojiObject) => {
    let sym = emojiObject.unified.split("-")
    let codesArray = []
    sym.forEach((el) => codesArray.push("0x" + el))
    let emoji = String.fromCodePoint(...codesArray)

    setCurrentMessage(currentMessage + emoji)
  }

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: userName,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      }
      await socket.emit("send_message", messageData)
      setMessageList((list) => [...list, messageData])
    }
  }

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessageList((list) => [...list, data])
    })
  }, [socket])

  const toggleEmojiBar = () => {
    setIsComponentVisible(!isComponentVisible)
  }

  const handleModal = () => {
    setVisible(!visible)
  }

  const handleInput = (e) => {
    setCurrentMessage(e.target.value)
  }

  const renderChats = (messageContent, id) => {
    return (
      <li
        className={`chat-content ${
          userName === messageContent.author ? "right" : "left"
        }`}
        key={id}
      >
        <img src={UserIcon} alt="usericon" />
        <div className="chat-text-container flex-1">
          <p>{messageContent.message}</p>
          <div className="chat-desc">
            <p>{messageContent.time}</p>
            <p>{messageContent.author}</p>
          </div>
        </div>
      </li>
    )
  }
  return (
    <>
      <div className="chats-container">
        <div className="chats-card">
          <div className="chats-header">
            <div>
              <img src={UserIcon} alt="usericon" />
            </div>
            <div className="chats-header-content">
              <div className="chats-header-detail">
                <p>{userName}</p>
                <p>Associate Creative Manager</p>
              </div>
            </div>
          </div>
          <ScrollToBottom className="message-body">
            <div className="message-body">
              {messageList.map((messageContent, i) => {
                return <ul>{renderChats(messageContent, i)}</ul>
              })}
            </div>
          </ScrollToBottom>
          <div className="chats-box">
            <div className="chats-box-input">
              <Form
                name="basic"
                initialValues={{ remember: true }}
                autoComplete="off"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendMessage()
                    e.preventDefault()

                    setCurrentMessage("")
                  }
                }}
              >
                <div className="chat-box-container">
                  <TextArea
                    size="large"
                    name="message"
                    placeholder="Enter your message here"
                    onChange={(e) => handleInput(e)}
                    value={currentMessage}
                    type="text"
                    autoSize
                  />
                  <div className="chat-box-emojis-container">
                    <div className="chats-box-input-emojis" ref={ref}>
                      {isComponentVisible && (
                        <Picker
                          onEmojiClick={onEmojiClick}
                          pickerStyle={{
                            position: "absolute",
                            top: "-23em",
                            right: "0em",
                          }}
                        />
                      )}
                      <img
                        src={EmojiButton}
                        alt="EmojiButton"
                        onClick={toggleEmojiBar}
                        width="30px"
                        height="30px"
                      />
                    </div>
                    <div
                      className="chats-box-input-attachment"
                      onClick={handleModal}
                    >
                      {" "}
                      <img
                        src={UploadClip}
                        alt="EmojiButton"
                        width="30px"
                        height="30px"
                      />
                    </div>
                    <div
                      className="chats-box-input-submit"
                      onClick={sendMessage}
                    >
                      <img
                        src={SendButton}
                        alt="EmojiButton"
                        height="40px"
                        width="40px"
                      />
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chats
