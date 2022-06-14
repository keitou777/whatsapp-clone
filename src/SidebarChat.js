import * as react from "react";
import * as muiCore from "@mui/material";
import * as mui from "@mui/icons-material";
import "./SidebarChat.css";
import db from "./firebase";
import * as firestore from "firebase/firestore";

function SidebarChat({ addNewChat, roomName, message, timestamp }) {
  const [seed, setSeed] = react.useState("");
  const [lastMessage, setLastMessage] = react.useState("");
  react.useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));

    // ***** Read Last Message for each chatroom******
    if (roomName) {
      const q = firestore.query(
        firestore.collection(db, "messages"),
        firestore.where("room", "==", roomName),
        firestore.orderBy("timestamp", "desc")
      );
      const unsubscribe = firestore.onSnapshot(q, (querySnapshot) => {
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push(doc);
        });
        if (results[0]) {
          // console.log("LM=", results[0].data().message);
          setLastMessage(results[0]);
        } else {
          setLastMessage([]);
        }
      });
    }
    // if (lastMessage) {
    //   console.log(roomName, "=", lastMessage.data().message);
    // }
  }, []);

  const createChat = async () => {
    const newRoomName = prompt("Please enter room name for chat");
    if (newRoomName) {
      // create chatroom in database
      await firestore.setDoc(firestore.doc(db, "rooms", newRoomName), {});
    }
  };

  return !addNewChat ? (
    <div className="sidebarChat">
      <muiCore.Avatar
        src={`https://avatars.dicebear.com/api/human/${seed}.svg`}
      />
      <div className="sidebarChat_info">
        <div className="sidebarChat_infoHeader">
          <h2>{roomName}</h2>
          <p>{timestamp ? timestamp.toDate().toUTCString() : ""}</p>
        </div>
        {message ? (
          <p>{message}</p>
        ) : (
          lastMessage != "" && <p>{lastMessage?.data().message}</p>
        )}
      </div>
    </div>
  ) : (
    <div className="sidebarChat" onClick={createChat}>
      <h2>+ Add new chat</h2>
    </div>
  );
}

export default SidebarChat;
