import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5028");

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function Room({ roomId, userId }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const setupMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;
    };

    setupMedia();

    socket.emit("join-room", { roomId, userId });

    socket.on("user-joined", async (otherUserId) => {
      console.log("Other user joined, starting call with", otherUserId);
      startCall(otherUserId);
    });

    socket.on("offer", async ({ sdp, from }) => {
      await createAnswer(sdp, from);
    });

    socket.on("answer", async ({ sdp }) => {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(sdp)
      );
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    });

    return () => {
      socket.disconnect();
      if (peerConnectionRef.current) peerConnectionRef.current.close();
    };
  }, [roomId, userId]);

  const startCall = async (otherUserId) => {
    peerConnectionRef.current = new RTCPeerConnection(ICE_SERVERS);

    localStreamRef.current.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, localStreamRef.current);
    });

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: otherUserId,
        });
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    socket.emit("offer", { sdp: offer, to: otherUserId });
  };

  const createAnswer = async (sdp, from) => {
    peerConnectionRef.current = new RTCPeerConnection(ICE_SERVERS);

    localStreamRef.current.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, localStreamRef.current);
    });

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate, to: from });
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(sdp)
    );
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    socket.emit("answer", { sdp: answer, to: from });
  };

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <video ref={localVideoRef} autoPlay muted style={{ width: "300px" }} />
      <video ref={remoteVideoRef} autoPlay style={{ width: "300px" }} />
    </div>
  );
}

export default Room;
