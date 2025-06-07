import { useQuestionnaire } from "../../contexts/QuestionnaireContext";

export const ReproductiveHealthForm = () => {
  const { getSection, updateField } = useQuestionnaire();
  const section = "reproductiveHealth";
  const values = getSection(section);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Reproductive Health</h2>

      <div>
        <label className="block mb-1 font-medium">
          Have you ever been diagnosed with a hormonal imbalance, or have you experienced symptoms that may suggest one?
        </label>
        <textarea
          name="hormonalImbalance"
          rows={4}
          value={values.hormonalImbalance || ""}
          onChange={(e) => updateField(section, "hormonalImbalance", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="For women: irregular periods, acne, hair loss or growth, weight changes, mood swings, low libido, fatigue, or hot flashes. For men: low energy, reduced muscle mass, weight gain, low libido, mood changes, or hair thinning."
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Do you currently menstruate?</label>
        <select
          name="menstruating"
          value={values.menstruating || ""}
          onChange={(e) => updateField(section, "menstruating", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select...</option>
          <option>Yes</option>
          <option>No</option>
          <option>Perimenopausal</option>
          <option>Menopausal</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Is your menstrual cycle regular?</label>
        <select
          name="cycleRegularity"
          value={values.cycleRegularity || ""}
          onChange={(e) => updateField(section, "cycleRegularity", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select...</option>
          <option>Yes</option>
          <option>No</option>
          <option>N/A</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Please describe any past or current symptoms/issues you experience with your cycle or menopause
        </label>
        <textarea
          name="cycleSymptoms"
          rows={3}
          value={values.cycleSymptoms || ""}
          onChange={(e) => updateField(section, "cycleSymptoms", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., cramps, irregularity, heavy bleeding, hot flashes"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Are you currently using birth control?</label>
        <select
          name="birthControl"
          value={values.birthControl || ""}
          onChange={(e) => updateField(section, "birthControl", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select...</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Are you currently pregnant or planning to conceive?</label>
        <select
          name="pregnancyStatus"
          value={values.pregnancyStatus || ""}
          onChange={(e) => updateField(section, "pregnancyStatus", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select...</option>
          <option>Pregnant (without fertility treatments)</option>
          <option>Pregnant (with the help of fertility treatments)</option>
          <option>Trying to conceive (without fertility treatments)</option>
          <option>Trying to conceive (without fertility treatments, experiencing challenges)</option>
          <option>Trying to conceive (with the help of fertility treatments)</option>
          <option>Not currently pregnant or trying to conceive</option>
        </select>
      </div>
    </div>
  );
};