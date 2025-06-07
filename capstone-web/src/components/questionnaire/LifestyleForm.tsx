import { useQuestionnaire } from "../../contexts/QuestionnaireContext";

export const LifestyleForm = () => {
  const { getSection, updateField } = useQuestionnaire();
  const section = "lifestyle";
  const values = getSection(section);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Lifestyle & Environment</h2>

      <div>
        <label className="block mb-1 font-medium">Do you practice any mindfulness or wellness activities?</label>
        <textarea
          name="mindfulnessPractices"
          rows={3}
          value={values.mindfulnessPractices || ""}
          onChange={(e) => updateField(section, "mindfulnessPractices", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., meditation, yoga, breathwork, journaling"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Would you be open to receiving recommendations for wellness practices?</label>
        <select
          name="openToWellness"
          value={values.openToWellness || ""}
          onChange={(e) => updateField(section, "openToWellness", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select...</option>
          <option>Yes</option>
          <option>No</option>
          <option>Maybe</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">What type of environment do you live in?</label>
        <select
          name="environmentType"
          value={values.environmentType || ""}
          onChange={(e) => updateField(section, "environmentType", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select...</option>
          <option>Urban</option>
          <option>Suburban</option>
          <option>Rural</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Are you regularly exposed to pollutants, chemicals, or radiation?</label>
        <textarea
          name="toxinExposure"
          rows={2}
          value={values.toxinExposure || ""}
          onChange={(e) => updateField(section, "toxinExposure", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Include job-related or environmental exposures"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">How would you describe your current sleep habits?</label>
        <textarea
          name="sleepHabits"
          rows={3}
          value={values.sleepHabits || ""}
          onChange={(e) => updateField(section, "sleepHabits", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Include bedtime, wake time, sleep quality"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Do you track your sleep with a device?</label>
        <select
          name="trackSleep"
          value={values.trackSleep || ""}
          onChange={(e) => updateField(section, "trackSleep", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select...</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">How would you describe your social support system?</label>
        <textarea
          name="socialSupport"
          rows={2}
          value={values.socialSupport || ""}
          onChange={(e) => updateField(section, "socialSupport", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., close friends, family, community groups"
        />
      </div>
    </div>
  );
};