import { useQuestionnaire } from "../../contexts/QuestionnaireContext";
import { useState } from "react";

const serviceOptions = [
  "Personalized nutrition plans",
  "Supplement guidance",
  "Stress and sleep optimization",
  "Cycle tracking & hormone support",
  "AI-generated lifestyle plans",
  "Lab test analysis",
  "Other",
];

export const HealthGoalsForm = () => {
  const { getSection, updateField } = useQuestionnaire();
  const section = "healthGoals"
  const values = getSection(section);

  const [otherServiceText, setOtherServiceText] = useState(values.otherInterestedService || "");

  const toggleService = (service: string) => {
    const current = values.interestedServices || [];
    const updated = current.includes(service)
      ? current.filter((s: string) => s !== service)
      : [...current, service];

    updateField(section, "interestedServices", updated);

    if (service === "Other" && !current.includes("Other")) {
      updateField(section, "otherInterestedService", otherServiceText);
    } else if (service === "Other" && current.includes("Other")) {
      updateField(section, "otherInterestedService", "");
      setOtherServiceText("");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Health Goals & Symptom Overview</h2>

      <div>
        <label className="block mb-1 font-medium">
          What are your current symptoms or health concerns and when did they start? Which are most significantly impacting your health?
        </label>
        <textarea
          name="currentSymptoms"
          value={values.currentSymptoms || ""}
          onChange={(e) => updateField(section, "currentSymptoms", e.target.value)}
          rows={3}
          className="w-full border rounded px-3 py-2"
          placeholder="List any symptoms you're currently experiencing and severity"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Have you received any treatments for your symptoms and if so, have they been useful?
        </label>
        <textarea
          name="treatments"
          value={values.pastSymptoms || ""}
          onChange={(e) => updateField(section, "treatments", e.target.value)}
          rows={3}
          className="w-full border rounded px-3 py-2"
          placeholder="List current and past treatments e.g., massage therapy, acupuncture, physiotherapy"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          What are your top health goals or priorities?
        </label>
        <textarea
          name="healthObjectives"
          value={values.healthObjectives || ""}
          onChange={(e) => updateField(section, "healthObjectives", e.target.value)}
          rows={3}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., improve energy, regulate cycles, manage stress, optimize digestion"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          What are you hoping to achieve through this platform?
        </label>
        <textarea
          name="desiredOutcomes"
          value={values.desiredOutcomes || ""}
          onChange={(e) => updateField(section, "desiredOutcomes", e.target.value)}
          rows={2}
          className="w-full border rounded px-3 py-2"
          placeholder="Describe your ideal outcome or experience"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          What services are you interested in? (Select all that apply)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {serviceOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={(values.interestedServices || []).includes(option)}
                onChange={() => toggleService(option)}
                className="accent-purple-600"
              />
              <span>{option}</span>
            </label>
          ))}

          {(values.interestedServices || []).includes("Other") && (
            <input
              type="text"
              value={otherServiceText}
              onChange={(e) => {
                setOtherServiceText(e.target.value);
                updateField(section, "otherInterestedService", e.target.value);
              }}
              placeholder="Please specify"
              className="border rounded px-3 py-2 col-span-1 sm:col-span-2"
            />
          )}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">
          What do you feel are your biggest obstacles to achieving better health?
        </label>
        <textarea
          name="obstacles"
          value={values.obstacles || ""}
          onChange={(e) => updateField(section, "obstacles", e.target.value)}
          rows={3}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., time, stress, finances, consistency"
        />
      </div>
    </div>
  );
};