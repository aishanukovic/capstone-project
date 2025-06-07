import { useQuestionnaire } from "../../contexts/QuestionnaireContext";
import { useState } from "react";

const dietOptions = [
  "Halal",
  "Kosher",
  "Gluten-Free",
  "Vegan",
  "Vegetarian",
  "Pescatarian",
  "Keto",
  "Paleo",
  "Intermittent Fasting",
  "Other",
];

export const NutritionalHistoryForm = () => {
  const { getSection, updateField } = useQuestionnaire();
  const section = "nutritionalHistory";
  const values = getSection(section);

  const [otherDietText, setOtherDietText] = useState(values.otherDiet || "");

  const toggleDiet = (diet: string) => {
    const current = values.dietType || [];
    const updated = current.includes(diet)
      ? current.filter((s: string) => s !== diet)
      : [...current, diet];

    updateField(section, "dietType", updated);

    if (diet === "Other" && !current.includes("Other")) {
      updateField(section, "otherDiet", otherDietText);
    } else if (diet === "Other" && current.includes("Other")) {
      updateField(section, "otherDiet", "");
      setOtherDietText("");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Nutritional History</h2>

      <div>
        <label className="block mb-1 font-medium">What does a typical day of eating look like for you?</label>
        <textarea
          name="dailyDiet"
          rows={4}
          value={values.dailyDiet || ""}
          onChange={(e) => updateField(section, "dailyDiet", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Include meals, snacks, beverages"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Do you follow any specific type of diet or have any dietary restrictions? (Select all that Apply)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {dietOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={(values.dietType || []).includes(option)}
                onChange={() => toggleDiet(option)}
                className="accent-purple-600"
              />
              <span>{option}</span>
            </label>
          ))}

          {(values.dietType || []).includes("Other") && (
            <input
              type="text"
              value={values.otherDiet || ""}
              onChange={(e) => updateField(section, "otherDiet", e.target.value)}
              placeholder="Please specify"
              className="border rounded px-3 py-2 col-span-1 sm:col-span-2"
            />
          )}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Do you experience any digestive issues?</label>
        <textarea
          name="digestiveIssues"
          rows={3}
          value={values.digestiveIssues || ""}
          onChange={(e) => updateField(section, "digestiveIssues", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., bloating, constipation, acid reflux"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Do you currently take any supplements?</label>
        <textarea
          name="supplements"
          rows={2}
          value={values.supplements || ""}
          onChange={(e) => updateField(section, "supplements", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="List names, dosages, and frequency"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Do you consume caffeine, alcohol, tobacco, or recreational drugs?</label>
        <textarea
          name="substanceUse"
          rows={2}
          value={values.substanceUse || ""}
          onChange={(e) => updateField(section, "substanceUse", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Include type and frequency"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">How much water do you drink per day?</label>
        <select
          name="waterIntake"
          value={values.waterIntake || ""}
          onChange={(e) => updateField(section, "waterIntake", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select...</option>
          <option>Less than 2 cups (under 500 mL / 17 oz)</option>
          <option>2–4 cups (500 mL – 1 L / 17–34 oz)</option>
          <option>5–7 cups (1.25 – 1.75 L / 42–59 oz)</option>
          <option>8–10 cups (2 – 2.5 L / 68–85 oz)</option>
          <option>11–13 cups (2.75 – 3.25 L / 93–110 oz)</option>
          <option>More than 13 cups (over 3.25 L / 110 oz)</option>
          <option>I’m not sure</option>
        </select>
      </div>
    </div>
  );
};