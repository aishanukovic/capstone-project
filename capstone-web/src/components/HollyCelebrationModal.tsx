import { Link } from "react-router-dom";
import { FaFileAlt, FaCloudUploadAlt, FaHome } from "react-icons/fa";

type HollyCelebrationModalProps = {
  onClose: () => void;
};

export default function HollyCelebrationModal({ onClose }: HollyCelebrationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg text-center relative">
        <img
          src="/ai-celebrate.gif"
          alt="Holly Celebrating"
          className="w-44 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-purple-700 mb-2">Congratulations!</h2>
        <p className="text-gray-700 mb-4">
          You’ve successfully submitted your Diagnostic Health Questionnaire! What would you like to do next?
        </p>
        <ul className="text-left justify-self-center space-y-4 font-medium text-gray-800">
          <li className="flex items-center space-x-3">
            <FaFileAlt className="text-purple-700" />
            <Link to="/search" className="hover:underline text-purple-700">
              Analyze your questionnaire responses
            </Link>
          </li>
          <li className="flex items-center space-x-3">
            <FaCloudUploadAlt className="text-purple-700" />
            <Link to="/profile?tab=uploads" className="hover:underline text-purple-700">
              Upload additional health files
            </Link>
          </li>
          <li className="flex items-center space-x-3">
            <FaHome className="text-purple-700" />
            <Link to="/dashboard" className="hover:underline text-purple-700">
              Return to your dashboard
            </Link>
          </li>
        </ul>
        <button
          className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}