import { useQuestionnaire } from "../../contexts/QuestionnaireContext";

export const ActivitiesForm = () => {
  const { getSection, updateField } = useQuestionnaire();
  const section = "activities";
  const values = getSection(section);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Activities & Exercise</h2>

      <div>
        <label className="block mb-1 font-medium">How often do you engage in physical activity?</label>
        <select
          name="exerciseFrequency"
          value={values.exerciseFrequency || ""}
          onChange={(e) => updateField(section, "exerciseFrequency", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select...</option>
          <option>Rarely / Never</option>
          <option>1–2 days per week</option>
          <option>3–4 days per week</option>
          <option>5–6 days per week</option>
          <option>Daily</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">What types of exercise or physical activity do you typically engage in?</label>
        <textarea
          name="exerciseTypes"
          rows={3}
          value={values.exerciseTypes || ""}
          onChange={(e) => updateField(section, "exerciseTypes", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., walking, running, yoga, strength training, sports"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">On average, how long do your exercise sessions last?</label>
        <input
          type="text"
          name="exerciseDuration"
          value={values.exerciseDuration || ""}
          onChange={(e) => updateField(section, "exerciseDuration", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., 30 minutes, 1 hour"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Do you have any physical limitations or injuries that affect your ability to exercise?</label>
        <textarea
          name="exerciseLimitations"
          rows={3}
          value={values.exerciseLimitations || ""}
          onChange={(e) => updateField(section, "exerciseLimitations", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., chronic pain, joint issues, injuries, mobility challenges, or medical conditions that limit physical activity"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">How would you rate your overall physical energy throughout the day?</label>
        <select
          name="energyLevel"
          value={values.energyLevel || ""}
          onChange={(e) => updateField(section, "energyLevel", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select...</option>
          <option>Very low</option>
          <option>Low</option>
          <option>Moderate</option>
          <option>High</option>
          <option>Very high</option>
        </select>
      </div>
    </div>
  );
};