import React, { useState } from "react";
import HomeTop from "../Components/HomeTop";
import Navbar from "../Components/Navbar";
import AdminNavbar from "../Components/AdminNavbar";
import { handleError } from "../utils";
import Footer from "../Components/Footer";
import api from "../api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Videoconference.css";

function VideoConference({ data }) {
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinMeeting = async () => {
    try {
      setIsLoading(true);
      const userName = data.user.name;
      const uid = data.user._id;
      const type = data.user.type;

      const response = await api.post("/join-meeting", {
        userName,
        uid,
        type,
      });

      if (response.data.success) {
        setRoomInfo(response.data);
        setMeetingStarted(true);
      } else {
        handleError("Authentication failed");
      }
    } catch (error) {
      console.error(error);
      handleError("Error joining meeting");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="video-conference-container">
      <HomeTop data={data} />
      {data.user.type === "Admin" ? (
        <AdminNavbar data={data} />
      ) : (
        <Navbar data={data} />
      )}
      <div className="video-content">
        <div className="video-card">
          <div className="video-header">
            <h2>Video Conference</h2>
            {!meetingStarted && (
              <p className="video-instruction">
                Click the button below to join the video conference
              </p>
            )}
          </div>

          <div className="video-body">
            {!meetingStarted ? (
              <button
                className={`join-button ${isLoading ? "loading" : ""}`}
                onClick={handleJoinMeeting}
                disabled={isLoading}
              >
                {isLoading ? "Connecting..." : "Join Meeting"}
              </button>
            ) : (
              roomInfo && (
                <div className="video-frame-container">
                  <iframe
                    src={`https://meet.jit.si/${roomInfo.roomName}`}
                    allow="camera; microphone; fullscreen; display-capture"
                    className="video-frame"
                    title="Video Conference"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default VideoConference;
