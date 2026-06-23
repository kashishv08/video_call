import Button from "react-bootstrap/Button";
import React from "react";
import Form from "react-bootstrap/Form";
import { useSocket } from "../providers/SocketProvider";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const {socket} = useSocket();
  const [emailId, setEmailId] = useState('');
  const [roomId, setRoomId] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    socket.on('joined-room', (roomId) => {
      navigate(`/room/${roomId}`);
    })
  },[]);


  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit('join-room', {emailId : emailId, roomId: roomId});
  } 

  return (  
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Form onSubmit={handleJoinRoom}>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Control
          value={emailId}
          onChange={(e)=> setEmailId(e.target.value)}
            type="email"
            placeholder="Enter email"
            style={{
              border: "1px solid black",
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formRoomName">
          <Form.Control
           value={roomId}
          onChange={(e)=> setRoomId(e.target.value)}
            type="text"
            placeholder="Enter Room Name"
            style={{
              border: "1px solid black",
            }}
          />
        </Form.Group>
        <Button
          type="submit"
          variant="secondary"
          style={{
            border: "1px solid black",
            width: "100%",
          }}
        >
          Enter Room
        </Button>
      </Form>
    </div>
  );
}

export default Home;
