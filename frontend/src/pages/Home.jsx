import { useNavigate } from 'react-router-dom';

import HeroHome from '../partials/HeroHome';
import FeaturesHome from '../partials/FeaturesHome';
import Footer from '../partials/Footer';
import Header from '../partials/Header';
import HowItWorks from '../partials/HowItWorks';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900">
            {/* Header */}
            <Header navigate={navigate} />

            {/* Main Content */}
            <main className="flex-grow w-screen mt-16">
                <HeroHome />
                <HowItWorks />
                <FeaturesHome />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default Home;
