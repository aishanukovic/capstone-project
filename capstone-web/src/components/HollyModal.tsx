type HollyModalProps = {
  onClose: () => void;
};

export default function HollyModal({ onClose }: HollyModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg text-center relative">
        <img
          src="/ai-gif.gif"
          alt="Holly"
          className="w-44 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-purple-700 mb-2">Hi, I'm Holly!</h2>
        <p className="text-gray-700 mb-4">
          Welcome! Please take your time to complete this health questionnaire.
          The more details you share and the more fields you complete, the better I’ll be able to understand your unique health profile.
          Your answers will help me provide more accurate insights and deeply personalized naturopathic advice tailored just for you!
        </p>
        <button
          className="mt-2 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700"
          onClick={onClose}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}