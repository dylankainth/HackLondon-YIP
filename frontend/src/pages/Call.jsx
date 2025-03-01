import { useNavigate } from 'react-router-dom';
import Timeline from '../components/Timeline';
import Modal from '../components/Modal'
import { useState } from 'react'


function Call() {

    const [popupAddProgress, setPopupAddProgress] = useState(false)
    const [progressInput, setProgressInput] = useState('');


    const navigate = useNavigate();


    // take the user back to the home page
    const handleGoHome = () => {
        navigate('/');
    }

    // take in user's progress input and do something...
    const handleSubmitProgress = () => {

    }





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
                    PUT THE VIDEO HERE
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
                <h3 className="text-lg font-semibold">This is the Timeline</h3>
                <Timeline className="flex-grow mt-4 overflow-auto border p-4">
                    {/* <CardContent className="h-full">
                        <p className="text-gray-500 text-sm">Timeline logs will appear here...</p>
                    </CardContent> */}
                </Timeline>
            </div>
            <button onClick={() => { setPopupAddProgress(true) }

            }>Add Progress</button>
        </div>
    )
}

export default Call;