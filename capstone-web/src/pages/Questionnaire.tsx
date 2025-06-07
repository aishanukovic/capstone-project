import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuestionnaire, QuestionnaireProvider } from "../contexts/QuestionnaireContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProgressBody from "../components/ProgressBody";
import HollyModal from "../components/HollyModal";
import HollyCelebrationModal from "../components/HollyCelebrationModal";
import { PersonalMetricsForm } from "../components/questionnaire/PersonalMetricsForm";
import { MedicalHistoryForm } from "../components/questionnaire/MedicalHistoryForm";
import { FamilyHistoryForm } from "../components/questionnaire/FamilyHistoryForm";
import { MentalHealthForm } from "../components/questionnaire/MentalHealthForm";
import { ReproductiveHealthForm } from "../components/questionnaire/ReproductiveHealthForm";
import { NutritionalHistoryForm } from "../components/questionnaire/NutritionalHistoryForm";
import { ActivitiesForm } from "../components/questionnaire/ActivitiesForm";
import { LifestyleForm } from "../components/questionnaire/LifestyleForm";
import { HealthGoalsForm } from "../components/questionnaire/HealthGoalsForm";

const sections = [
  { id: 0, name: "Personal Metrics", Component: PersonalMetricsForm },
  { id: 1, name: "Medical History", Component: MedicalHistoryForm },
  { id: 2, name: "Family History", Component: FamilyHistoryForm },
  { id: 3, name: "Mental Health", Component: MentalHealthForm },
  { id: 4, name: "Reproductive Health", Component: ReproductiveHealthForm },
  { id: 5, name: "Nutritional History", Component: NutritionalHistoryForm },
  { id: 6, name: "Activities", Component: ActivitiesForm },
  { id: 7, name: "Lifestyle", Component: LifestyleForm },
  { id: 8, name: "Health Goals", Component: HealthGoalsForm },
];

function QuestionnaireContent() {
  const [currentSection, setCurrentSection] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showHollyModal, setShowHollyModal] = useState(true);
  const { getAccessTokenSilently, user } = useAuth0();
  const { data, setAll } = useQuestionnaire();
  const location = useLocation();
  const prefill = location.state?.prefill;
  const isEditing = !!prefill;
  const hasPrefilled = useRef(false);
  const [loading, setLoading] = useState(true);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  const SectionComponent = sections[currentSection].Component;

  const next = () => setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  const back = () => setCurrentSection((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    if (prefill && !hasPrefilled.current) {
      setAll(prefill);
      setShowHollyModal(false);
      setHasSubmitted(true);
      hasPrefilled.current = true;
    }
    setLoading(false);
  }, [prefill, setAll]);

  useEffect(() => {
    const fetchSubmissionStatus = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/questionnaires/${user?.sub}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res?.data) {
          setHasSubmitted(true);
          setShowHollyModal(false);
        }
      } catch {
        console.log("No prior questionnaire submission.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.sub && !prefill) fetchSubmissionStatus();
    else setLoading(false);
  }, [getAccessTokenSilently, user, prefill]);

  const handleSubmit = async () => {
    try {
      const token = await getAccessTokenSilently();
      const endpoint = `${import.meta.env.VITE_API_URL}/questionnaires/${user?.sub}`;
      const method = isEditing ? "put" : "post";

      await axios[method](endpoint, { answers: data }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHasSubmitted(true);
      setShowHollyModal(false);
      setShowCelebrationModal(true);
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      alert("There was a problem submitting your responses.");
    }
  };

  return (
    <div className="relative bg-[#f7f7f7] p-8 flex flex-col items-center w-full">
      {!loading && !hasSubmitted && showHollyModal && (
        <HollyModal onClose={() => setShowHollyModal(false)} />
      )}

      {!loading && !hasSubmitted && !showHollyModal && (
        <button
          className="fixed bottom-6 right-6 z-40 bg-purple-700 shadow-xl rounded-full p-3 hover:scale-105 transition"
          onClick={() => setShowHollyModal(true)}
          aria-label="Open Holly Modal"
        >
          <img src="/ai-inverted.png" alt="Holly" className="w-16 h-16" />
        </button>
      )}

      {showCelebrationModal && <HollyCelebrationModal onClose={() => setShowCelebrationModal(false)} />}

      <h1 className="text-3xl font-bold text-center mb-4">Health Questionnaire</h1>
      <p className="text-gray-600 mb-6 text-center">
        Section {currentSection + 1} of {sections.length}: {sections[currentSection].name}
      </p>

      <div className="relative w-full flex justify-center">
        <ProgressBody sectionIndex={currentSection} total={sections.length} />

        <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-lg z-10">
          <SectionComponent />
        </div>
      </div>

      <div className="mt-6 flex justify-between w-full max-w-3xl">
        <button
          onClick={back}
          disabled={currentSection === 0}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Back
        </button>

        {currentSection === sections.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {isEditing ? "Update" : "Submit"}
          </button>
        ) : (
          <button
            onClick={next}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default function QuestionnairePage() {
  return (
    <QuestionnaireProvider>
      <Navbar />
      <QuestionnaireContent />
      <Footer />
    </QuestionnaireProvider>
  );
}