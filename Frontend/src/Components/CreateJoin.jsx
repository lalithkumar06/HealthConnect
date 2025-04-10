import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function CreateJoin({ setRoomId, setUserId, enterRoom }) {
  const [inputRoom, setInputRoom] = useState("");

  const handleCreate = () => {
    const newRoom = uuidv4();
    const user = uuidv4();
    setRoomId(newRoom);
    setUserId(user);
    enterRoom();
  };

  const handleJoin = () => {
    if (!inputRoom) return alert("Enter a room code");
    const user = uuidv4();
    setRoomId(inputRoom);
    setUserId(user);
    enterRoom();
  };

  return (
    <div>
      <h2>Join or Create a Room</h2>
      <input
        type="text"
        placeholder="Enter room code"
        value={inputRoom}
        onChange={(e) => setInputRoom(e.target.value)}
      />
      <button onClick={handleJoin}>Join Room</button>
      <hr />
      <button onClick={handleCreate}>Create New Room</button>
    </div>
  );
}

export default CreateJoin;
