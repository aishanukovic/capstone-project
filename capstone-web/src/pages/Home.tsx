import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import type { RedirectLoginOptions } from '@auth0/auth0-react';
import axios from 'axios';
import './Home.css';
import ReviewsCarousel from '../components/ReviewsCarousel';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

export default function Home() {
  const {
    loginWithRedirect,
    isAuthenticated,
    user,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'treatments' | 'services'>('treatments');

  useEffect(() => {
    const syncUserToDatabase = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          await axios.post(
            `${import.meta.env.VITE_API_URL}/users`,
            {
              name: user.name,
              email: user.email,
              auth0Id: user.sub,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('User synced to MongoDB');
        } catch (err) {
          console.error('Failed to sync user:', err);
        }
      }
    };
    syncUserToDatabase();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="bg-[#f7f7f7] min-h-screen flex flex-col">
      <header className="px-4 sm:px-6 lg:px-16 xl:px-40 mb-12 mt-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-3">
          <img
            src="/logo.png"
            alt="Naturopathia Logo"
            className="h-12 w-fit"
          />
          <p className="font-noto text-xl sm:text-sm lg:text-lg xl:text-xl text-gray-700">
            Your personalized, AI-powered holistic health assistant.
          </p>
        </div>

        {!isAuthenticated && (
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <button
              onClick={() =>
                loginWithRedirect({ authorizationParams: { screen_hint: 'login', prompt: 'login', } } as RedirectLoginOptions)
              }
              className="text-gray-700 hover:text-gray-500 transition"
            >
              Log In
            </button>
            <button
              onClick={() =>
                loginWithRedirect({ authorizationParams: { screen_hint: 'signup', prompt: 'login', } } as RedirectLoginOptions)
              }
              className="bg-gray-700 text-white px-4 py-1.5 rounded-md hover:bg-gray-500 transition"
            >
              Register
            </button>
          </div>
        )}
      </header>

      <div className="px-4 sm:px-6 lg:px-16 xl:px-40 mb-24">
        <div className="flex gap-4 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('treatments')}
            className={`py-2 px-4 font-semibold transition ${
              activeTab === 'treatments'
                ? 'border-b-4 border-purple-700 text-purple-700'
                : 'text-gray-600 hover:text-purple-700'
            }`}
          >
            Treatments
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`py-2 px-4 font-semibold transition ${
              activeTab === 'services'
                ? 'border-b-4 border-purple-700 text-purple-700'
                : 'text-gray-600 hover:text-purple-700'
            }`}
          >
            Services
          </button>
        </div>

        {activeTab === 'treatments' && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg">
              <img
                src="/treatments.gif"
                alt="Treatments"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative col-span-1 row-span-1 overflow-hidden rounded-lg">
              <img src="/symptom.jpg" alt="Symptom" className="w-full h-full object-cover" />
              <div className="absolute top-0 left-0 p-4 text-gray-700 font-bold text-lg">
                Symptom Checker
              </div>
            </div>
            <div className="relative col-span-1 row-span-1 overflow-hidden rounded-lg">
              <img src="/supplements.jpg" alt="Supplements" className="w-full h-full object-cover" />
              <div className="absolute top-0 left-0 p-4 text-gray-700 font-bold text-lg">
                Herbal & Supplement Therapy
              </div>
            </div>
            <div className="relative col-span-1 row-span-1 overflow-hidden rounded-lg">
              <img src="/nutrition.jpg" alt="Nutrition" className="w-full h-full object-cover" />
              <div className="absolute top-0 left-0 p-4 text-gray-700 font-bold text-lg">
                Personalized Nutrition Plans
              </div>
            </div>
            <div className="relative col-span-1 row-span-1 overflow-hidden rounded-lg">
              <img src="/lifestyle.jpg" alt="Lifestyle" className="w-full h-full object-cover" />
              <div className="absolute top-0 left-0 p-4 text-white font-bold text-lg">
                Lifestyle Support
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="bg-purple-50 rounded-lg shadow p-4">
              <img src="/stethoscope.png" alt="Service 1" className="rounded-md mb-3" />
              <h3 className="font-bold text-lg text-gray-700">AI-Powered Virtual Naturopathic Consultations</h3>
              <p className="text-sm text-gray-700">
                Secure, judgment-free, and cost-effective access to holistic health advice tailored to your needs.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg shadow p-4">
              <img src="/clipboard.png" alt="Service 2" className="rounded-md mb-3" />
              <h3 className="font-bold text-lg text-gray-700">Personalized Treatment Plans</h3>
              <p className="text-sm text-gray-700">
                Custom naturopathic guidance based on your health profile, lifestyle, and diagnostic questionnaire.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg shadow p-4">
              <img src="/heartRate.png" alt="Service 2" className="rounded-md mb-3" />
              <h3 className="font-bold text-lg text-gray-700">Health Data Upload & Intelligent Analysis</h3>
              <p className="text-sm text-gray-700">
                Upload blood work, fitness test results, and other health documents for AI-assisted insights and recommendations.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg shadow p-4">
              <img src="/book.png" alt="Service 2" className="rounded-md mb-3" />
              <h3 className="font-bold text-lg text-gray-700">Verified Wellness Content</h3>
              <p className="text-sm text-gray-700">
                Weekly refresh of educational articles written by licensed naturopaths and health professionals.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg shadow p-4">
              <img src="/symptoms.png" alt="Service 2" className="rounded-md mb-3" />
              <h3 className="font-bold text-lg text-gray-700">Symptom Checker & Progress Tracker</h3>
              <p className="text-sm text-gray-700">
                Monitor your health over time and get feedback on new symptoms as they arise.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg shadow p-4">
              <img src="/lock.png" alt="Service 2" className="rounded-md mb-3" />
              <h3 className="font-bold text-lg text-gray-700">Secure Profile Dashboard</h3>
              <p className="text-sm text-gray-700">
                Centralized, encrypted dashboard to manage your health data, track changes, and update your goals.
              </p>
            </div>
          </div>
        )}
      </div>

      <section className="px-0">
        <div className="how-it-works-container">
          <h2 className="how-it-works-title">How Naturopathia works</h2>
          <div className="how-it-works-steps">
            <div className="how-it-works-row">
              <div className="step-content">
                <div className="step-divider" />
                <div className="step-number">Step 1</div>
                <h3 className="step-title">Create your profile</h3>
                <p className="step-desc">
                  Sign up using your email and password to get started with the platform.
                </p>
              </div>
              <div className="step-image">
                <img src="/createProfile.png" alt="Create your profile" />
              </div>
            </div>

            <div className="how-it-works-row">
              <div className="step-content">
                <div className="step-divider" />
                <div className="step-number">Step 2</div>
                <h3 className="step-title">Fill out the diagnostic health questionnaire</h3>
                <p className="step-desc">
                  Like your first consultation with a naturopath, our diagnostic questionnaire helps us understand your unique needs.
                </p>
              </div>
              <div className="step-image">
                <img src="/questionnairePhoto.png" alt="Questionnaire" />
              </div>
            </div>

            <div className="how-it-works-row">
              <div className="step-content">
                <div className="step-divider" />
                <div className="step-number">Step 3</div>
                <h3 className="step-title">Receive your personalized plan</h3>
                <p className="step-desc">
                  Our AI, Holly, crafts a treatment plan tailored to your health and lifestyle.
                </p>
              </div>
              <div className="step-image">
                <img src="/receivePlan.png" alt="Personalized Plan" />
              </div>
            </div>

            <div className="how-it-works-row">
              <div className="step-content">
                <div className="step-divider" />
                <div className="step-number">Step 4</div>
                <h3 className="step-title">Access ongoing support</h3>
                <p className="step-desc">
                  Track your progress and receive continuous care with Holly using our accessible website.
                </p>
              </div>
            <div className="step-image">
              <img src="/accessSupport.png" alt="Ongoing Support" />
            </div>
            </div>
          </div>
        </div>

        <div className="h-16 bg-[#f7f7f7]" />
        
        <div className="reviews-section">
          <ReviewsCarousel />
        </div>

        <div className="h-16 bg-[#f7f7f7]" />

        <div className="bg-[#f9f9ff] py-20 text-white shadow-[inset_0_6px_6px_-6px_rgba(0,0,0,0.1),inset_0_-6px_6px_-6px_rgba(0,0,0,0.1)]">
          <FAQSection />
        </div>
      </section>

      <Footer />
    </div>
  );
}