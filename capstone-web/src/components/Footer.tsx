import { BsHeartFill } from "react-icons/bs";

const Footer = () => (
  <footer className="bg-gray-100 text-gray-600 text-sm py-4 text-center shadow-inner flex flex-col sm:flex-row justify-center items-center gap-1 px-4">
    <div className="text-center">
      © {new Date().getFullYear()} Naturopathia • Built with <BsHeartFill className="inline-block text-purple-600" /> by Aisha Nukovic for holistic well-being
    </div>
  </footer>
);

export default Footer;