import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BasicInfo from '../components/profile/BasicInfo';
import DiagnosticData from '../components/profile/DiagnosticData';
import UploadedFiles from '../components/profile/UploadedFiles';

const Profile: React.FC = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [questionnaire, setQuestionnaire] = useState<any>(null);

  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'uploads' ? 2 : 0;
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      if (user?.sub && isAuthenticated) {
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

          setQuestionnaire(res.data);
        } catch (err) {
          console.error('Failed to fetch questionnaire:', err);
        }
      }
    };

    fetchQuestionnaire();
  }, [user, isAuthenticated, getAccessTokenSilently]);

  const tabs = [
    {
      name: 'Basic Information',
      component: (
        <BasicInfo
          name={questionnaire?.answers?.personalMetrics?.name}
          email={user?.email}
        />
      ),
    },
    {
      name: 'Diagnostic Health Questionnaire',
      component: (
        <DiagnosticData
          answers={questionnaire?.answers}
        />
      ),
    },
    { name: 'Uploaded Health Data', component: <UploadedFiles /> },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f7f7f7] text-gray-800">
      <Navbar />

      <main className="flex-grow w-full pb-20 px-6 md:px-12 max-w-4xl mx-auto space-y-10">
        <h2 className="text-3xl font-normal font-noto text-purple-900 mb-6 mt-4">Your Profile</h2>

        <div className="bg-white rounded-2xl shadow-lg">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                className={`flex-1 text-center py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === idx
                    ? 'text-purple-800 border-purple-800 bg-purple-50'
                    : 'text-gray-500 border-transparent hover:text-purple-600 hover:bg-purple-100'
                }`}
                onClick={() => setActiveTab(idx)}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="p-6">{tabs[activeTab].component}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;