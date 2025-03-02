import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import Timeline from '../components/Timeline';
import Modal from '../components/Modal'
import io from 'socket.io-client';
import { IIceCandidateDto, ILogs, ISdpDto, ISignalDto, Progress, WinnerResult } from '../types';
import { signalingServerUrl } from '../consts';

console.log('signalingServerUrl: ', signalingServerUrl);
const socket = io(signalingServerUrl);
let endCall = false;
let tickTime = true;


function Call() {


    const timelineRef = useRef(null);
    const opponentTimelineRef = useRef(null);

    const [showWinner, setShowWinner] = useState(false);
    const [popupAddProgress, setPopupAddProgress] = useState(false)
    const [progressInput, setProgressInput] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0);

    const [countdownTime, setCountdownTime] = useState(() => {
        const savedTime = localStorage.getItem('checkInTime');
        return savedTime ? JSON.parse(savedTime) * 60 : 30 * 60; // Default value 30 minutes in seconds
    });

    const originalTime = useRef(countdownTime);

    useEffect(() => {
        const savedTime = localStorage.getItem('checkInTime');
        originalTime.current = savedTime ? JSON.parse(savedTime) * 60 : 30 * 60;
        setCountdownTime(originalTime.current);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {

            if (tickTime) {

                setElapsedTime(prev => prev + 1);
                setCountdownTime(prev => (prev > 0 ? prev - 1 : 0));
            }


        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdownTime === 0) {
            setPopupAddProgress(true);
        }
    }, [countdownTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    //const navigate = useNavigate();


    // take the user back to the home page
    const handleGoHome = () => {
        removeMyStream();
        socket.disconnect();
        if (peerRef.current) {
            peerRef.current.close();
        }
        window.location.href = '/findpartners'; // Navigate to FindPartners
        // navigate('/findpartners'); // Uncomment if using useNavigate
    }


    // ending the session, pop up modal to show winner
    const handleEndSession = () => {

        endCall = true
        tickTime = false

        socket.emit('generateResults', roomId);
        

    }



    // Call handling code
    const { roomId } = useParams();
    const { user, setUser } = useAuth();
    const nickname = user?.name;

    // take in user's progress input and do something...
    const handleSubmitProgress = (event: React.FormEvent) => {
        event.preventDefault();
        // Do your modal submission logic here
        // Remove the beforeunload listener:
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        setPopupAddProgress(false);

        // Reset countdown timer
        setCountdownTime(originalTime.current);

        //timelineRef.current?.addEntry(progressInput,Date.now());
        socket.emit('timelineUpdate', { roomId, nickname, progressInput });
        setProgressInput('');
        //console.log(progressInput);
    }

    const [otherUserNickname, setOtherUserNickname] = useState<string | undefined>(undefined);
    const [logs, setLogs] = useState<ILogs>({
        myNickname: nickname,
        roomId,
        callerSocketId: undefined,
        mySocketId: undefined,
        answeredSocketId: undefined,
        localDescription: undefined,
        remoteDescription: undefined,
        receivedOffers: [],
        sentOffers: [],
        receivedAnswers: [],
        sentAnswers: [],
        sentICECandidates: [],
        receivedICECandidates: [],
    });

    // using Ref because I don't need page refresh on this variables updates
    const myVideo = useRef<HTMLVideoElement>(null!);
    const partnerVideo = useRef<HTMLVideoElement>(null!);

    const peerRef = useRef<RTCPeerConnection>(null!);
    const otherUserId = useRef<string>(null!);
    const myStream = useRef<MediaStream>(null!);
    const winnerName = useRef<string>(null!);
    const winReason = useRef<string>(null!);

    //const 

    // Create a ref to store the promise
    const cameraStreamPromise = useRef<Promise<MediaStream>>(Promise.resolve(new MediaStream()));
    const rtcInitialized = useRef(false);


    // on page update, if rtc not initialized, initialize it and the video stream
    useEffect(() => {
        if (rtcInitialized.current) return;
        rtcInitialized.current = true;

        // Request and store the camera feed in a promise
        cameraStreamPromise.current = navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (myVideo.current) {
                    myVideo.current.srcObject = stream;

                    myStream.current = stream;

                    try {
                        rtcPeerLogic();
                    } catch (err) {
                        console.error(err);
                        removeMyStream();
                    }
                }
                return stream;
            })
            .catch((error) => {
                console.error("Error accessing camera and microphone:", error);
                throw error;
            });
    }, []);

    const rtcPeerLogic = () => {

        socket.connect();
        setLogs(prev => ({ ...prev, mySocketId: socket.id }));

        // notify the server that someone joined the room
        socket.emit('joinRoom', { roomId, nickname });
        console.log('tried');


        socket.on('otherUserId', (args: ISignalDto) => {
            const { otherUserNickname, otherUserSocketId } = args;

            //message.success(`Successfully accepted: ${otherUserNickname}`, 5);
            console.log(`Successfully accepted: ${otherUserNickname}`);
            setLogs(prev => ({ ...prev, callerSocketId: otherUserSocketId }));
            otherUserId.current = otherUserSocketId;
            peerRef.current = createPeer(otherUserSocketId);

            // 1 track for the video and 1 for the audio
            // gives access to the video and audio stream to our peer
            myStream.current?.getTracks().forEach(track => peerRef.current?.addTrack(track, myStream.current));
        });

        socket.on('opponentUpdate', (args: Progress) => {
            const { text, time } = args;
            opponentTimelineRef.current?.addEntry(text, time);
        });

        socket.on('summaryResult', (args: Progress) => {
            const { text, time } = args;
            timelineRef.current?.addEntry(text, time);
        });

        socket.on('userJoined', (args: ISignalDto) => {
            const { otherUserSocketId, otherUserNickname } = args;
            socket.emit('callAccepted', { roomId, nickname });
            setOtherUserNickname(otherUserNickname);
            setLogs(prev => ({ ...prev, answeredSocketId: otherUserSocketId }));
            otherUserId.current = otherUserSocketId;
        });

        socket.on('resultsReceived', (args: WinnerResult) => {
            const { winner, reason } = args;
            console.log("winner", winner);
            console.log("reason", reason);
            winnerName.current = winner;
            winReason.current = reason;
            endCall = true;
            tickTime = false;
            setShowWinner(true)
        });

        socket.on('acceptedBy', (name: string) => {
            //message.success(`Successfully accepted by user: ${name}`, 6);
            console.log(`Successfully accepted by user: ${name}`);
            setOtherUserNickname(name);
        });

        socket.on('waitingToBeAcceptedBy', (name: string) => {
            //message.warning(`Waiting to be accepted by ${name}`);
            console.log(`Waiting to be accepted by ${name}`);
        });

        socket.on('otherUserDisconnected', (name: string) => {
            //message.warning(`${name} just disconnected!`, 6);
            console.log(`${name} just disconnected!`);
            partnerVideo.current.srcObject = null;
        });

        socket.on('offer', async (offer: ISdpDto) => {
            try {
                setLogs(prev => ({ ...prev, receivedOffers: [...prev.receivedOffers, offer] }));
                // we are receiving the offer (call), we are not initiating the call, so we do not send the offer
                // no need to pass the otherUserId
                peerRef.current = createPeer();
                const description = new RTCSessionDescription(offer.sdp);
                await peerRef.current.setRemoteDescription(description);
                setLogs(prev => ({ ...prev, remoteDescription: JSON.parse(JSON.stringify(description)) }));

                await cameraStreamPromise.current;
                myStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, myStream.current));

                const answer = await peerRef.current.createAnswer();
                setLogs(prev => ({ ...prev, localDescription: JSON.parse(JSON.stringify(answer)) }));
                await peerRef.current.setLocalDescription(answer);

                const payload: ISdpDto = {
                    target: offer.caller,
                    caller: socket.id!,
                    sdp: peerRef.current.localDescription!,
                };
                setLogs(prev => ({ ...prev, sentAnswers: [...prev.sentAnswers, payload] }));
                socket.emit('answer', payload);
            } catch (err) {
                console.error(err);
            }
        });

        socket.on('answer', async (answer: ISdpDto) => {
            try {
                setLogs(prev => ({ ...prev, receivedAnswers: [...prev.receivedAnswers, answer] }));
                const description = new RTCSessionDescription(answer.sdp);
                await peerRef.current.setRemoteDescription(description);
                setLogs(prev => ({ ...prev, remoteDescription: JSON.parse(JSON.stringify(description)) }));
            } catch (err) {
                console.error(err);
            }
        });

        socket.on('ICECandidate', async (ICECandidate) => {
            try {
                console.log('ICECandidate');
                setLogs(prev => ({ ...prev, receivedICECandidates: [...prev.receivedICECandidates, ICECandidate] }));
                const candidate = new RTCIceCandidate(ICECandidate);
                await peerRef.current.addIceCandidate(candidate);
            } catch (err) {
                console.error(err);
            }
        });

    };

    const createPeer = (otherUserSocketId?: string): RTCPeerConnection => {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: 'stun:stun.stunprotocol.org',
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com',
                },
                {
                    urls: 'turn:192.158.29.39:3478?transport=udp',
                    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    username: '28224511:1379330808',
                },
                {
                    urls: 'turn:192.158.29.39:3478?transport=tcp',
                    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    username: '28224511:1379330808',
                },
                {
                    urls: 'turn:turn.bistri.com:80',
                    credential: 'homeo',
                    username: 'homeo',
                },
                {
                    urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
                    credential: 'webrtc',
                    username: 'webrtc',
                },
            ],
        });

        peer.onicecandidate = (event) => {
            console.log('onicecandidate');
            if (event.candidate) {
                const payload: IIceCandidateDto = {
                    target: otherUserId.current,
                    candidate: event.candidate,
                };
                setLogs(prev => ({ ...prev, sentICECandidates: [...prev.sentICECandidates, payload] }));
                socket.emit('ICECandidate', payload);
            }
        };

        peer.ontrack = (event) => {
            if (partnerVideo.current.srcObject) return;
            partnerVideo.current.srcObject = event.streams[0];
        };


        // will be triggered only by the Peer 1
        peer.onnegotiationneeded = async () => {
            try {
                if (otherUserId) {
                    const offer = await peerRef.current.createOffer();
                    await peerRef.current.setLocalDescription(offer);
                    setLogs(prev => ({ ...prev, localDescription: JSON.parse(JSON.stringify(offer)) }));

                    // signal
                    const payload: ISdpDto = {
                        target: otherUserSocketId!,
                        caller: socket.id!,
                        sdp: peerRef.current.localDescription!,
                    };
                    setLogs(prev => ({ ...prev, sentOffers: [...prev.sentOffers, payload] }));
                    socket.emit('offer', payload);
                }
            } catch (err) {
                console.error(err);
            }
        };

        return peer;
    };

    const removeMyStream = () => {
        myStream.current.getTracks().forEach((track) => {
            track.stop();
            track.dispatchEvent(new Event('ended'));
        });
    };

    const onCallHangUp = () => {

        removeMyStream();
        socket.disconnect();
        if (peerRef.current) {
            peerRef.current.close();
        }
        console.log("hung up");
        //navigate('/');
        window.location.href = '/';
    };

    /**
     * On page close / refresh
     */
    window.addEventListener('beforeunload', (ev) => {
        ev.preventDefault();
        removeMyStream();
        socket.disconnect();
        if (peerRef.current) {
            peerRef.current.close();
        }
        console.log("unloaded");
        return true;
    });

    const beforeUnloadHandler = useCallback((ev: BeforeUnloadEvent) => {
        ev.preventDefault();
    }, []);

    // Attach the beforeunload handler for unsaved changes (or active call)
    useEffect(() => {
        window.addEventListener('beforeunload', beforeUnloadHandler);
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, [beforeUnloadHandler]);

    return (
        <div className="grid w-full h-screen overflow-hidden">
            {popupAddProgress && (
                <Modal handleCloseModal={() => { setPopupAddProgress(false) }}>
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full h-full flex flex-col">
                        {/* Title */}
                        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 flex-shrink-0">
                            📌 Add Progress
                        </h2>

                        {/* Form */}
                        <form onSubmit={handleSubmitProgress} className="flex flex-col flex-grow space-y-4 h-full">
                            {/* Textarea Input */}
                            <textarea
                                type="text"
                                placeholder="What have you done..."
                                value={progressInput}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setProgressInput(value);
                                }}
                                className="w-full flex-grow p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder-gray-500 text-gray-900"
                            />

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300">
                                Submit Progress
                            </button>
                        </form>
                    </div>
                </Modal>
            )}

            {showWinner && (
                <Modal handleCloseModal={() => {

                    setShowWinner(false)


                }}>
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full h-full flex flex-col">
                        {/* Title */}
                        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 flex-shrink-0">
                            THE WINNER IS... {winnerName.current}<br></br>{winReason.current}
                        </h2>
                        
                    </div>
                </Modal>
            )}



            {/* Main Grid Layout */}
            <div className="grid w-full h-full overflow-hidden grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 p-6 mx-auto">
                {/* Left 2/3 - Video Call Section */}
                <div className="flex flex-col bg-gray-900 rounded-2xl overflow-hidden h-full shadow-lg flex-grow">
                    {/* Top Bar */}
                    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
                        <span className="text-sm font-medium">Time Elapsed: {formatTime(elapsedTime)}</span>
                        <span className="text-sm font-medium">Time Remaining: {formatTime(countdownTime)}</span>

                        {endCall ? (<button
                            onClick={handleGoHome}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-md shadow-md transition">
                            End Call
                        </button>) :
                            (<button
                                onClick={handleEndSession}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-md shadow-md transition">
                                End Session
                            </button>)



                        }


                        {/* <button
                            onClick={handleGoHome}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-md shadow-md transition">
                            End Call
                        </button> */}
                    </div>

                    {/* Video Section - Bigger */}
                    <div className="flex-grow flex items-center justify-center text-white min-h-0">
                        <div className="relative w-full max-w-3xl aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">

                            {/* Main Video - Fullscreen */}
                            <video
                                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                                ref={partnerVideo} autoPlay
                            />

                            {/* Partner Video - Small & Bottom Right */}
                            <video
                                className="absolute bottom-4 right-4 w-1/4 h-auto object-cover rounded-lg opacity-100 shadow-lg border-2 border-white"
                                ref={myVideo} autoPlay muted
                            />
                        </div>
                    </div>


                    {/* Bottom Bar */}
                    <div className="flex justify-center gap-4 p-4 bg-gray-800 text-white">
                        <button
                            onClick={() => setPopupAddProgress(true)}
                            className=" px-4 py-2  bg-blue-500 hover:bg-blue-600 text-white text-base font-semibold rounded-lg shadow-md transition">
                            ➕ Add Progress
                        </button>

                    </div>
                </div>

                {/* Right 1/3 - Timeline Section (Bigger) */}
                <div className="flex flex-col bg-white rounded-2xl p-6 shadow-lg h-full flex-grow">
                    {/* Top Timeline - Scrollable */}
                    <div className="flex flex-col flex-1 bg-white rounded-xl p-4 shadow-md overflow-hidden border border-gray-200 min-h-0">
                        <h3 className="text-lg font-semibold text-gray-800">📌 This is the Top Timeline</h3>
                        <div className="flex-grow mt-4 overflow-y-auto bg-gray-50 rounded-md w-full h-full">
                            <Timeline ref={timelineRef} />
                        </div>
                    </div>

                    {/* Bottom Timeline - Scrollable */}
                    <div className="flex flex-col flex-1 bg-white rounded-xl p-4 shadow-md overflow-hidden border border-gray-200 mt-4 min-h-0">
                        <h3 className="text-lg font-semibold text-gray-800">📌 This is the Bottom Timeline</h3>
                        <div className="flex-grow mt-4 overflow-y-auto bg-gray-50 rounded-md w-full h-full">
                            <Timeline ref={opponentTimelineRef} />
                        </div>
                    </div>
                </div>


            </div>

        </div>
    );
}


export default Call;