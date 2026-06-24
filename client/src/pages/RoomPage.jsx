import React from 'react'
import { useSocket } from '../providers/SocketProvider'
import { useEffect, useCallback, useRef, useState } from 'react';
import { usePeer } from '../providers/PeerProvider';

function RoomPage() {
    const { socket } = useSocket();
    const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer();
    const [myStream, setMyStream] = useState();
    const videoRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const remoteEmailRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && myStream) {
            videoRef.current.srcObject = myStream;
        }
    }, [myStream]);

    useEffect(() => {
        if (remoteStreamRef.current && remoteStream) {
            remoteStreamRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    useEffect(() => {
        const handleNegotiation = async () => {
            if (remoteEmailRef.current) {
                const offer = await createOffer();
                socket.emit("call-user", { emailId: remoteEmailRef.current, offer });
            }
        };
        peer.addEventListener("negotiationneeded", handleNegotiation);
        return () => {
            peer.removeEventListener("negotiationneeded", handleNegotiation);
        };
    }, [peer, createOffer, socket]);

    const handleNewUserJoin = useCallback(async (data) => {
        const { emailId } = data;
        console.log(`New joined user : ${emailId}`);
        remoteEmailRef.current = emailId;

        if (myStream) {
            const offer = await createOffer()
            socket.emit("call-user", { emailId, offer });
        }
    }, [createOffer, socket, myStream]);

    const handleIncomingCall = useCallback(async (data) => {
        const { from, offer } = data;
        console.log("incoming call from", from, offer);
        remoteEmailRef.current = from;

        const ans = await createAnswer(offer);
        socket.emit("call-accept", { emailId: from, ans });
    }, [createAnswer, socket]);

    const handleCallAccept = useCallback(async (data) => {
        const { ans } = data;
        await setRemoteAnswer(ans);
        console.log("call accepted", ans);
    }, [])

    const handleStream = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        sendStream(stream);
        setMyStream(stream);
    }, []);

    useEffect(() => {
        socket.on('user-joined', handleNewUserJoin);
        socket.on('incoming-call', handleIncomingCall);
        socket.on('call-accept', handleCallAccept);

        return () => {
            socket.off('user-joined', handleNewUserJoin);
            socket.off('incoming-call', handleIncomingCall);
            socket.off('call-accept', handleCallAccept)
        };
    }, [socket, handleNewUserJoin, handleIncomingCall, handleCallAccept]);

    useEffect(() => {
        handleStream();
    }, [handleStream])


    return (
        <div>
            <h1>Room Page</h1>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                width: "100vw"
            }}>
                <div>
                    <h1>My video</h1>
                    {myStream && <video ref={videoRef} autoPlay muted playsInline style={{ width: '400px' }} />}

                </div>
                <div>
                    <h1>Remote stream</h1>
                    {<video ref={remoteStreamRef} autoPlay playsInline style={{ width: '400px', borderRadius: '10px' }} />}

                </div>
            </div>
        </div>
    )
}

export default RoomPage