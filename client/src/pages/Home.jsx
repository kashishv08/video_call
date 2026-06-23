import Button from "react-bootstrap/Button";
import React from "react";
import Form from "react-bootstrap/Form";

function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Form>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Control
            type="email"
            placeholder="Enter email"
            style={{
              border: "1px solid black",
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formRoomName">
          <Form.Control
            type="text"
            placeholder="Enter Room Name"
            style={{
              border: "1px solid black",
            }}
          />
        </Form.Group>
        <Button
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
