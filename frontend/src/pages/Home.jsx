import { useNavigate } from 'react-router-dom';
import SubjectSearch from '../partials/SubjectSearch';
import HeroHome from '../partials/HeroHome';
import FeaturesHome from '../partials/FeaturesHome';
import FeaturesBlock from '../partials/FeaturesBlock';
import Testimonials from '../partials/Testimonials';
import Footer from '../partials/Footer';
import Header from '../partials/Header';


function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 text-gray-900 flex-grow w-screen">

            <Header />

            <main className="flex-grow w-screen">

                <HeroHome />
                <FeaturesHome />

                <SubjectSearch navigate={navigate} />

            </main>

            <Footer />

        </div>
    );
}

export default Home;
