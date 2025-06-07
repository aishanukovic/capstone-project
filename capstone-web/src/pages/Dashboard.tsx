import React, { useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Todo from '../components/Todo';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const hasSyncedRef = useRef(false);
  const articleRef = useRef<HTMLDivElement>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const syncUserToDatabase = async () => {
      if (!user || !isAuthenticated || hasSyncedRef.current) return;
      hasSyncedRef.current = true;

      try {
        const token = await getAccessTokenSilently({
          authorizationParams: { audience: "https://capstone-api" },
        });

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
    };

    syncUserToDatabase();
  }, [user, isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      if (!user || !isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently({
          authorizationParams: { audience: "https://capstone-api" },
        });

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/questionnaires/${user.sub}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const answers = res.data?.answers;
        if (answers) {
          const fullName = answers?.personalMetrics?.name;
          const first = fullName?.split(' ')[0];
          setFirstName(first || null);
          setQuestionnaireAnswers(answers);
        }
      } catch {
        console.warn('No questionnaire found yet');
      }
    };

    fetchQuestionnaire();
  }, [user, isAuthenticated, getAccessTokenSilently]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
      <Navbar />

      <main className="flex-grow px-6 py-10 max-w-5xl mx-auto">
        {firstName === null ? (
          <h1 className="text-4xl font-bold text-gray-700 font-noto mb-2">Welcome!</h1>
        ) : (
          <h1 className="text-4xl font-bold text-gray-700 font-noto mb-2">
            Welcome, {firstName.trim()}!
          </h1>
        )}
        <p className="text-lg text-gray-700 mb-8">
          Here’s your personalized wellness hub. Explore insights, access resources, and take control of your holistic health.
        </p>

        <Todo
          hasCompletedQuestionnaire={!!firstName}
          prefillData={questionnaireAnswers ?? undefined}
        />

        <section id="featured-articles" ref={articleRef}>
          <h2 className="text-2xl font-semibold text-purple-800 mb-6">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/articles/sleep" className="group bg-white rounded-xl shadow p-4 pb-12 transition hover:shadow-lg relative">
              <img src="/sleep.jpg" alt="Sleep and Hormones" className="rounded-lg mb-3 h-40 w-full object-cover" />
              <h3 className="text-lg font-semibold text-gray-800">How Sleep Impacts Your Hormones</h3>
              <p className="text-sm text-gray-600 mt-1">
                Discover how restful sleep is key to hormone balance and stress recovery.
              </p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-700 text-sm flex items-center gap-1">
                Read more <span>→</span>
              </div>
            </Link>

            <Link to="/articles/nutrition" className="group bg-white rounded-xl shadow p-4 transition hover:shadow-lg relative">
              <img src="/apple.jpg" alt="Personalized Nutrition" className="rounded-lg mb-3 h-40 w-full object-cover" />
              <h3 className="text-lg font-semibold text-gray-800">Personalized Nutrition 101</h3>
              <p className="text-sm text-gray-600 mt-1">
                Learn how to tailor your nutrition based on your unique metabolic needs.
              </p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-700 text-sm flex items-center gap-1">
                Read more <span>→</span>
              </div>
            </Link>

            <Link to="/articles/gut-brain" className="group bg-white rounded-xl shadow p-4 transition hover:shadow-lg relative">
              <img src="/brain.jpg" alt="Gut-Brain Axis" className="rounded-lg mb-3 h-40 w-full object-cover" />
              <h3 className="text-lg font-semibold text-gray-800">Mental Health & the Gut-Brain Axis</h3>
              <p className="text-sm text-gray-600 mt-1">
                Explore how your gut health may influence your mood and cognition.
              </p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-700 text-sm flex items-center gap-1">
                Read more <span>→</span>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;