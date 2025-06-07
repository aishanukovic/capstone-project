import { useQuestionnaire } from "../../contexts/QuestionnaireContext";

export const MedicalHistoryForm = () => {
  const { getSection, updateField } = useQuestionnaire();
  const section = "medicalHistory";
  const values = getSection(section);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Medical History</h2>

      <div>
        <label className="block mb-1 font-medium">Do you currently have any diagnosed medical conditions?</label>
        <textarea
          name="currentConditions"
          rows={3}
          value={values.currentConditions || ""}
          onChange={(e) => updateField(section, "currentConditions", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., diabetes, hypertension, asthma..."
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">List any past medical conditions or surgeries</label>
        <textarea
          name="pastConditions"
          rows={3}
          value={values.pastConditions || ""}
          onChange={(e) => updateField(section, "pastConditions", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Include dates if known"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Are you currently taking any prescription medications?</label>
        <textarea
          name="currentMedications"
          rows={3}
          value={values.currentMedications || ""}
          onChange={(e) => updateField(section, "currentMedications", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Name, dosage, frequency"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Have you had any recent bloodwork or lab tests?</label>
        <textarea
          name="recentBloodwork"
          rows={3}
          value={values.recentBloodwork || ""}
          onChange={(e) => updateField(section, "recentBloodwork", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Include types of tests, date, and known results if applicable"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Known Allergies</label>
        <textarea
          name="allergies"
          rows={2}
          value={values.allergies || ""}
          onChange={(e) => updateField(section, "allergies", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="List any food or environmental allergies"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Do you currently experience any ongoing dental or oral health issues?</label>
        <textarea
          name="dentalIssues"
          rows={3}
          value={values.dentalIssues || ""}
          onChange={(e) => updateField(section, "dentalIssues", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="(e.g., tooth sensitivity, gum bleeding, jaw tension, bad breath)"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">How often do you visit a dentist or dental hygienist for routine check-ups or cleanings?</label>
        <select
          name="dentalCheckups"
          value={values.dentalCheckups || ""}
          onChange={(e) => updateField(section, "dentalCheckups", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select...</option>
          <option>Every 6 months</option>
          <option>Once a year</option>
          <option>Less than once a year</option>
          <option>Only when I have a problem</option>
          <option>Never</option>
        </select>
      </div>
    </div>
  );
};