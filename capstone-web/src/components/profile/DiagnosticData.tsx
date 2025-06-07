import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answers?: Record<string, Record<string, any>>;
}

const DiagnosticData: React.FC<Props> = ({ answers }) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  if (!answers) {
    return (
      <p className="text-sm text-gray-500">
        No diagnostic data available.{' '}
        Click{' '}
        <Link to="/questionnaire" className="text-purple-700 hover:underline">
          here
        </Link>{' '}
        to complete your questionnaire.
      </p>
    );
  }

  const sections = Object.entries(answers);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatKey = (key: string) =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

  const handleEdit = () => {
    navigate('/questionnaire', { state: { prefill: answers } });
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your diagnostic questionnaire?')) return;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://capstone-api",
        },
      });

      await axios.delete(`${import.meta.env.VITE_API_URL}/questionnaires/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Questionnaire deleted successfully.");
      window.location.reload();
    } catch (err) {
      console.error('Failed to delete questionnaire:', err);
      alert('An error occurred while deleting your questionnaire.');
    }
  };

  return (
    <div className="space-y-6 text-sm">
      {sections.map(([sectionKey, sectionData]) => {
        const isOpen = openSections[sectionKey];
        return (
          <div key={sectionKey} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(sectionKey)}
              className="w-full flex justify-between items-center px-4 py-2 bg-slate-50 hover:bg-slate-200 text-slate-800 font-semibold"
            >
              <span>{formatKey(sectionKey)}</span>
              {isOpen ? <FaMinus className="text-xs" /> : <FaPlus className="text-xs" />}
            </button>

            {isOpen && (
              <div className="px-4 py-3 bg-white border-t space-y-2">
                {Object.entries(sectionData).map(([field, value]) => (
                  <div key={field} className="mb-3 flex flex-col">
                    <div className="flex justify-between items-start gap-4">
                      <span className="font-medium text-gray-700 whitespace-nowrap">{formatKey(field)}:</span>
                      <div className="text-right text-gray-900 text-sm whitespace-pre-line leading-relaxed flex-1">
                        {Array.isArray(value)
                          ? value.join(', ')
                          : typeof value === 'boolean'
                          ? value ? 'Yes' : 'No'
                          : value || '—'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-purple-700 text-white text-sm rounded-md hover:bg-purple-800 transition"
        >
          Edit Questionnaire
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
        >
          Delete Questionnaire
        </button>
      </div>
    </div>
  );
};

export default DiagnosticData;