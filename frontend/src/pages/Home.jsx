import { useNavigate } from 'react-router-dom';
import SubjectSearch from '../partials/SubjectSearch';
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
            <Header />

            {/* Main Content */}
            <main className="flex-grow w-screen">
                <HeroHome />
                <HowItWorks />
                <FeaturesHome />
                <SubjectSearch navigate={navigate} />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default Home;
