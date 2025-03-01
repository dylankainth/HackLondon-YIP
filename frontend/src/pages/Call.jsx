import { useNavigate } from 'react-router-dom';
// import { button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import { MicOff, CameraOff, Timer, PhoneOff } from "lucide-react";
import Timeline from '../components/Timeline';

function Call() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    }

    return (
        // <div>
        //     <button onClick={handleGoHome}>Go Home</button>
        // </div>

        <div className="grid grid-cols-3 h-screen p-4 gap-4">
            {/* Left 2/3 - Video Call Section */}
            <div className="col-span-2 flex flex-col bg-gray-900 rounded-2xl overflow-hidden">
                {/* Top Bar */}
                <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
                    <div className="flex items-center gap-2">

                        {/* <Timer size={20} /> */}
                        <span>Time Elapsed: 00:00</span>
                    </div>
                    <button onClick={handleGoHome} variant="destructive">

                        {/* <PhoneOff />  */}

                        End Call</button>
                </div>

                {/* Video Section */}
                <div className="flex-grow flex items-center justify-center text-white">

                    // PUT THE VIDEO HERE




                    <p className="text-lg">Your Video Feed</p>
                </div>

                {/* Bottom Bar */}
                <div className="flex justify-center gap-4 p-4 bg-gray-800 text-white">
                    <button variant="outline">
                        {/* <MicOff /> */}


                        Mute</button>
                    <button variant="outline">
                        {/* <CameraOff />  */}

                        Toggle Video</button>
                </div>
            </div>

            {/* Right 1/3 - Timeline Section */}
            <div className="flex flex-col bg-white rounded-2xl p-4 shadow-md">
                <h3 className="text-lg font-semibold">This is the Timeline</h3>
                <Timeline className="flex-grow mt-4 overflow-auto border p-4">
                    {/* <CardContent className="h-full">
                        <p className="text-gray-500 text-sm">Timeline logs will appear here...</p>
                    </CardContent> */}
                </Timeline>
            </div>
        </div>
    )
}

export default Call;