import { useQuestionnaire } from "../../contexts/QuestionnaireContext";

export const MentalHealthForm = () => {
  const { getSection, updateField } = useQuestionnaire();
  const section = "mentalHealth";
  const values = getSection(section);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Mental Health</h2>

      <div>
        <label className="block mb-1 font-medium">How would you describe your current stress levels?</label>
        <select
          name="stressLevel"
          value={values.stressLevel || ""}
          onChange={(e) => updateField(section, "stressLevel", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select...</option>
          <option>Low</option>
          <option>Moderate</option>
          <option>High</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Do you currently experience symptoms of anxiety, depression, or other emotional struggles?
        </label>
        <textarea
          name="emotionalSymptoms"
          rows={3}
          value={values.emotionalSymptoms || ""}
          onChange={(e) => updateField(section, "emotionalSymptoms", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Describe your experience in your own words"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Have you ever been diagnosed with a mental health condition or intellectual disability? If so, are you currently receiving treatment, or have you received treatment for it in the past?</label>
        <textarea
          name="mentalHealthDiagnosis"
          rows={3}
          value={values.mentalHealthDiagnosis || ""}
          onChange={(e) => updateField(section, "mentalHealthDiagnosis", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., PTSD, OCD, ADHD, ASD, generalized anxiety disorder"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">How do you typically cope with emotional stress?</label>
        <textarea
          name="copingMechanisms"
          rows={2}
          value={values.copingMechanisms || ""}
          onChange={(e) => updateField(section, "copingMechanisms", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., exercise, talking with friends, journaling"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Have you experienced any major emotional traumas?</label>
        <textarea
          name="emotionalTraumas"
          rows={3}
          value={values.emotionalTraumas || ""}
          onChange={(e) => updateField(section, "emotionalTraumas", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Describe if comfortable"
        />
      </div>
    </div>
  );
};