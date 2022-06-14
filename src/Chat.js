import * as react from "react";
import * as muiCore from "@mui/material";
import * as mui from "@mui/icons-material";
import "./Chat.css";
import * as firestore from "firebase/firestore";
import * as router from "react-router-dom";
import db from "./firebase";
import { useStateValue } from "./StateProvider";

function Chat() {
  const [input, setInput] = react.useState("");
  const roomId = router.useParams();
  // console.log("roomID => ", roomId.roomId);
  const [roomMessages, setRoomMessages] = react.useState([]);
  const [{ user }] = useStateValue();

  // ****** reading chatroom messages *******
  react.useEffect(() => {
    if (roomId.roomId) {
      const q = firestore.query(
        firestore.collection(db, "messages"),
        firestore.where("room", "==", roomId.roomId),
        firestore.orderBy("timestamp", "asc")
      );
      const unsubscribe = firestore.onSnapshot(q, (querySnapshot) => {
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push(doc);
        });
        setRoomMessages(results);
        //   console.log(results);
      });
    }
  }, [roomId]);

  // ***** chat input *******
  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("you typed=>", input);
    await firestore.addDoc(firestore.collection(db, "messages"), {
      message: input,
      room: roomId?.roomId,
      timestamp: new firestore.serverTimestamp(),
      author: user.displayName,
      authorUid: user.uid,
    });
    roomMessages?.map((message) => {
      console.log(message.data().timestamp?.toDate().toUTCString());
    });
    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <muiCore.Avatar />
        <div className="chat_headerInfo">
          <h3>{roomId.roomId ? roomId.roomId : ""}</h3>
          <p>
            Last seen {" :  "}
            {roomMessages[roomMessages.length - 1]
              ? roomMessages[roomMessages.length - 1]
                  .data()
                  .timestamp?.toDate()
                  .toUTCString()
              : ""}
          </p>
        </div>

        <div className="chat_headerRigt">
          <muiCore.IconButton>
            <mui.SearchOutlined />
          </muiCore.IconButton>
          <muiCore.IconButton>
            <mui.AttachFile />
          </muiCore.IconButton>
          <muiCore.IconButton>
            <mui.MoreVert />
          </muiCore.IconButton>
        </div>
      </div>
      <div className="chat_body">
        {roomMessages?.map((message) => (
          <p
            className={`chat_message ${
              user.uid == message.data().authorUid && "chat_author"
            }`}
          >
            <span className="chat_name">{message.data().author}</span>
            {message.data().message}
            <span className="chat_timestamp">
              {message.data().timestamp?.toDate().toUTCString()}
            </span>
          </p>
        ))}
      </div>
      <div className="chat_footer">
        <mui.InsertEmoticon />
        <form type="submit">
          <input
            type="text"
            placeholder="type message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage}>send message</button>
        </form>
        <mui.Mic />
      </div>
    </div>
  );
}

export default Chat;
