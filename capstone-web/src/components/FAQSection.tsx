import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    question: 'What is Naturopathia?',
    answer:
      'Naturopathia is your personalized, AI-powered holistic health assistant, offering customized recommendations based on your health data and goals.',
  },
  {
    question: 'How is my data protected?',
    answer:
      'All health data is encrypted and securely stored. We follow best practices in data protection and comply with industry security standards.',
  },
  {
    question: 'Is this a replacement for a real naturopath?',
    answer:
      'No, Naturopathia is a virtual assistant designed to complement—not replace—professional medical advice. Always consult a licensed practitioner for critical decisions.',
  },
  {
    question: 'What kind of health data can I upload?',
    answer:
      'You can upload blood work, fitness test results, medical history, and lifestyle information. Our AI uses this to tailor your wellness plan.',
  },
  {
    question: 'Can I track my health progress over time?',
    answer:
      'Yes! You’ll have access to a secure dashboard that helps you monitor symptoms, habits, and improvements in your health journey.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-16 xl:px-40 mb-8">
      <h2 className="text-4xl font-noto font-medium text-[#4b2e83] mb-8 ">Frequently Asked Questions</h2>
      <div className="divide-y divide-gray-300">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="py-4 cursor-pointer group"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800 group-hover:text-purple-700 transition">
                {faq.question}
              </h3>
              <FaChevronDown
                className={`text-purple-600 transform transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-gray-700 text-sm">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}