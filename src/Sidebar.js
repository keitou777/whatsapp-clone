import * as react from "react";
import "./Sidebar.css";
import * as mui from "@mui/icons-material";
import * as muiCore from "@mui/material";
import SidebarChat from "./SidebarChat";
import db from "./firebase";
import * as firestore from "firebase/firestore";
import * as router from "react-router-dom";
import { useStateValue } from "./StateProvider";

function Sidebar() {
  const [rooms, setRooms] = react.useState([]);
  const [searchTerm, setSearchTerm] = react.useState("");
  const [searchResults, setSearchResults] = react.useState([]);
  const [{ user }] = useStateValue();

  // ***********Get all room names from database***********
  react.useEffect(() => {
    const q = firestore.query(
      firestore.collection(db, "rooms")
      //   firestore.where("room", "==", "room01")
    );
    const unsubscribe = firestore.onSnapshot(q, (querySnapshot) => {
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc);
      });
      setRooms(results);
    });
  }, []);

  //***********search chat messages************* */
  react.useEffect(() => {
    if (searchTerm != "") {
      setSearchResults([]);
      const q = firestore.query(
        firestore.collection(db, "messages"),
        firestore.orderBy("timestamp", "desc")
      );
      // console.log("search query=>", q);

      async function readData() {
        // console.log("reading data...");
        const querySnapshot = await firestore.getDocs(q);
        // console.log("snapshot=>", querySnapshot);
        let results = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data().message);
          if (doc.data().message.includes(searchTerm)) {
            results.push(doc);
          }
          // console.log("push result=>", result);
        });
        if (results.length > 0) {
          setSearchResults(results);
        }
      }
      readData();
    }
  }, [searchTerm]);

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <muiCore.Avatar src={user?.photoURL} />
        <div className="sidebar_headerRight">
          <muiCore.IconButton>
            <mui.DonutLarge />
          </muiCore.IconButton>
          <muiCore.IconButton>
            <mui.Chat />
          </muiCore.IconButton>
          <muiCore.IconButton>
            <mui.MoreVert />
          </muiCore.IconButton>
        </div>
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <mui.SearchOutlined />
          <input
            placeholder="Search message"
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
      </div>
      {searchTerm != "" ? (
        <div className="sidebar_chats">
          {searchResults.length > 0
            ? searchResults.map((result, index) => (
                <router.Link to={`/room/${result.data().room}`}>
                  <SidebarChat
                    roomName={result.data().room}
                    key={index}
                    message={result.data().message}
                    timestamp={result.data().timestamp}
                  />
                </router.Link>
              ))
            : ""}
        </div>
      ) : (
        <div className="sidebar_chats">
          <SidebarChat addNewChat />
          {rooms?.map((doc, index) => (
            <router.Link to={`/room/${doc.id}`}>
              <SidebarChat roomName={doc.id} key={index} />
            </router.Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
