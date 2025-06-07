import { useQuestionnaire } from "../../contexts/QuestionnaireContext";

export const PersonalMetricsForm = () => {
  const { getSection, updateField } = useQuestionnaire();
  const section = "personalMetrics";
  const values = getSection(section);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Personal Metrics</h2>

      <div>
        <label className="block mb-1 font-medium">Full Name</label>
        <input
          type="text"
          name="name"
          value={values.name || ""}
          onChange={(e) => updateField(section, "name", e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Age</label>
          <input
            type="number"
            name="age"
            value={values.age || ""}
            onChange={(e) => updateField(section, "age", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            name="gender"
            value={values.gender || ""}
            onChange={(e) => updateField(section, "gender", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={values.height || ""}
            onChange={(e) => updateField(section, "height", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={values.weight || ""}
            onChange={(e) => updateField(section, "weight", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Body Measurements (optional)</label>
        <textarea
          name="bodyMeasurements"
          rows={3}
          value={values.bodyMeasurements || ""}
          onChange={(e) => updateField(section, "bodyMeasurements", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., waist, hip, chest..."
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Blood Type</label>
        <select
            name="bloodType"
            value={values.bloodType || ""}
            onChange={(e) => updateField(section, "bloodType", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
            <option>I don't know</option>
          </select>
      </div>
    </div>
  );
};