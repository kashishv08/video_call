import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { SocketProvider } from "./providers/SocketProvider";
import RoomPage from "./pages/RoomPage";
import PeerProvider from "./providers/PeerProvider";

function App() {
  return (
    <SocketProvider>
      <PeerProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
        </Routes>
      </PeerProvider>
    </SocketProvider>
  );
}

export default App;
