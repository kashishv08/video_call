import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { useMemo } from 'react';
import { createContext } from 'react'

const PeerContext = createContext();

export const usePeer = () => {
  return useContext(PeerContext);
}

function PeerProvider(props) {
  const [remoteStream, setRemoteStream] = useState(null);


  const peer = useMemo(() => {
    return new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        }
      ]
    });
  }, [])

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  }

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const ans = await peer.createAnswer();
    await peer.setLocalDescription(ans);
    return ans;
  }

  const setRemoteAnswer = async (ans) => {
    await peer.setRemoteDescription(ans);
  }

  const sendStream = (stream) => {
    const tracks = stream.getTracks();
    console.log("stream", stream);
    console.log("tracks", tracks);
    for (const t of tracks) {
      peer.addTrack(t, stream);
    }
  }

  const handleTrackEvent = (event) => {
    console.log("event", event);
    setRemoteStream(event.streams[0]);
  }

  useEffect(() => {
    peer.addEventListener("track", handleTrackEvent)

    return () => {
      peer.removeEventListener("track", handleTrackEvent);
    }

  }, [peer])


  return (
    <PeerContext.Provider value={{ peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream }}>
      {props.children}
    </PeerContext.Provider>
  )
}

export default PeerProvider