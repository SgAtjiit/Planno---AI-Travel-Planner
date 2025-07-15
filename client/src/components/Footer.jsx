import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-6 mt-16 ">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">
            Planno - AI Travel Planner
          </span>{" "}
          ✈️ — Made with ❤️ for seamless travel experiences.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a
            href="https://drive.google.com/file/d/1Z8HHjv4X613gLAZ5gO_sCU0B1emsQ3QI/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white text-sm transition duration-200"
          >
            Portfolio
          </a>
          <a
            target="_blank"
            href="https://github.com/SgAtjiit"
            className="hover:text-white text-sm transition duration-200"
          >
            Github
          </a>
          <a
            target="_blank"
            href="https://www.linkedin.com/in/shrish-gupta-94711b280"
            className="hover:text-white text-sm transition duration-200"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
