import { useQuestionnaire } from "../../contexts/QuestionnaireContext";

export const FamilyHistoryForm = () => {
  const { getSection, updateField } = useQuestionnaire();
  const section = "familyHistory";
  const values = getSection(section);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Family History</h2>

      <div>
        <label className="block mb-1 font-medium">Does anyone in your immediate family have a history of chronic illnesses?</label>
        <textarea
          name="chronicIllnesses"
          rows={3}
          value={values.chronicIllnesses || ""}
          onChange={(e) => updateField(section, "chronicIllnesses", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., diabetes, cancer, heart disease, autoimmune conditions"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Any known genetic conditions or hereditary diseases in your family?</label>
        <textarea
          name="geneticConditions"
          rows={3}
          value={values.geneticConditions || ""}
          onChange={(e) => updateField(section, "geneticConditions", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., BRCA gene mutation, Huntington’s disease, etc."
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Please describe your ethnic background (optional)</label>
        <input
          type="text"
          name="ethnicBackground"
          value={values.ethnicBackground || ""}
          onChange={(e) => updateField(section, "ethnicBackground", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="May inform certain genetic risk factors"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Are there any mental health conditions in your family?</label>
        <textarea
          name="mentalHealthFamily"
          rows={2}
          value={values.mentalHealthFamily || ""}
          onChange={(e) => updateField(section, "mentalHealthFamily", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., depression, anxiety, bipolar disorder"
        />
      </div>
    </div>
  );
};