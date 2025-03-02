import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Timeline from '../components/Timeline';
import Modal from '../components/Modal'
import io from 'socket.io-client';
import { IIceCandidateDto, ILogs, ISdpDto, ISignalDto,Progress, TSummary } from '../types';
import { signalingServerUrl } from '../consts';

console.log('signalingServerUrl: ', signalingServerUrl);
const socket = io(signalingServerUrl);

function Call() {
    const timelineRef = useRef(null);
    const opponentTimelineRef = useRef(null);

    const [popupAddProgress, setPopupAddProgress] = useState(false)
    const [progressInput, setProgressInput] = useState('');


    //const navigate = useNavigate();


    // take the user back to the home page
    const handleGoHome = () => {
        removeMyStream();
        socket.disconnect();
        if (peerRef.current) {
            peerRef.current.close();
        }
        window.location.href = '/';
        //navigate('/');
    }



    // Call handling code
    const { nickname, roomId } = useParams();

    const getResults= () => {
        socket.emit('generateResults',roomId);
    }

    // take in user's progress input and do something...
    const handleSubmitProgress = (event: React.FormEvent) => {
        event.preventDefault();
        // Do your modal submission logic here
        // Remove the beforeunload listener:
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        setPopupAddProgress(false);

        //timelineRef.current?.addEntry(progressInput,Date.now());
        socket.emit('timelineUpdate', {roomId, nickname, progressInput });
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
            opponentTimelineRef.current?.addEntry(text,time);
        });

        socket.on('summaryResult', (args: Progress) => {
            const { text,time } = args;
            timelineRef.current?.addEntry(text,time);
        });

        socket.on('userJoined', (args: ISignalDto) => {
            const { otherUserSocketId, otherUserNickname } = args;
            socket.emit('callAccepted', { roomId, nickname });
            setOtherUserNickname(otherUserNickname);
            setLogs(prev => ({ ...prev, answeredSocketId: otherUserSocketId }));
            otherUserId.current = otherUserSocketId;
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
        <div className="grid w-full h-screen overflow-hidden grid-cols-3 gap-4 p-4 mx-auto max-w-screen-px-4">



            {popupAddProgress && (
                <Modal handleCloseModal={() => { setPopupAddProgress(false) }}>
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-full flex flex-col h-full">
                        <h2 className="text-xl font-bold mb-4 text-center">Add Progress</h2>

                        <form onSubmit={handleSubmitProgress} className="flex flex-col flex-grow h-full">
                            <textarea
                                type="text"
                                placeholder="What have you done..."
                                value={progressInput}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setProgressInput(value);
                                }}
                                className="flex-grow p-3 border rounded w-full resize-none"
                            />
                            <button type="submit" className="p-2 bg-blue-500 text-white rounded self-center mt-4 w-1/2">
                                Submit
                            </button>
                        </form>
                    </div>
                </Modal>
            )}






            {/* Left 2/3 - Video Call Section */}
            <div className="col-span-2 flex flex-col bg-gray-900 rounded-2xl overflow-hidden h-full">
                {/* Top Bar */}
                <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
                    <div className="flex items-center gap-2">
                        {/* <Timer size={20} /> */}
                        <span>Time Elapsed: 00:00</span>
                    </div>
                    <button onClick={handleGoHome} variant="destructive">
                        {/* <PhoneOff />  */}
                        End Call
                    </button>
                </div>

                {/* Video Section */}
                <div className="flex-grow flex items-center justify-center text-white">
                    <div className={'video-container'}>
                        {/*ME*/}
                        <video
                            className={'my-video'}
                            ref={myVideo}
                            autoPlay={true}
                            muted={true} />

                        {/*PARTNER*/}
                        <video
                            className={'partner-video'}
                            //controls={true}
                            ref={partnerVideo}
                            autoPlay={true}
                            muted={true} />

                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex justify-center gap-4 p-4 bg-gray-800 text-white">
                    <button variant="outline">
                        {/* <MicOff /> */}
                        Mute
                    </button>
                    <button variant="outline">
                        {/* <CameraOff />  */}
                        Toggle Video
                    </button>
                </div>
            </div>

            {/* Right 1/3 - Timeline Section */}
            <div className="col-span-1 flex flex-col bg-white rounded-2xl p-4 shadow-md overflow-hidden h-full">


                {/* Top Timeline */}
                <div className="flex flex-col flex-1 bg-white rounded-2xl p-4 shadow-md overflow-hidden">
                    <h3 className="text-lg font-semibold">This is the Top Timeline</h3>
                    <Timeline ref={timelineRef} className="flex-grow mt-4 overflow-auto border p-4">
                        {/* Timeline content */}
                    </Timeline>
                </div>

                {/* Bottom Timeline */}
                <div className="flex flex-col flex-1 bg-white rounded-2xl p-4 shadow-md overflow-hidden">
                    <h3 className="text-lg font-semibold">This is the Bottom Timeline</h3>
                    <Timeline ref={opponentTimelineRef} className="flex-grow mt-4 overflow-auto border p-4">
                        {/* Timeline content */}
                    </Timeline>
                </div>





            </div>
            <button onClick={() => { setPopupAddProgress(true) }

            }>Add Progress</button>
            <button onClick={() => { getResults() }

            }>Report</button>
        </div>
    )
}

export default Call;