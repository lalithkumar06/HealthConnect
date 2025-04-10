import React, { useState } from "react";
import CreateJoin from "../Components/CreateJoin";
import Room from "../Components/Room";
import HomeTop from "../Components/HomeTop";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
function VideoConference({data}) {
  const [inRoom, setInRoom] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userId, setUserId] = useState("");

  return (
    <>
    <HomeTop data = {data}/>
    <Navbar />
      <div>
        {!inRoom ? (
          <CreateJoin
            setRoomId={setRoomId}
            setUserId={setUserId}
            enterRoom={() => setInRoom(true)}
          />
        ) : (
          <Room roomId={roomId} userId={userId} />
        )}
      </div>
      <Footer />
    </>
  );
}

export default VideoConference;
