
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-prep-dark">PrepPathwayPro</h3>
            <p className="text-gray-600 text-sm">
              Your ultimate preparation toolkit for acing interviews and advancing your career.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 text-prep-dark">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-gray-600 hover:text-prep-secondary">Flash Cards</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-prep-secondary">Quizzes</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-prep-secondary">Role Guides</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 text-prep-dark">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-gray-600 hover:text-prep-secondary">About Us</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-prep-secondary">Contact</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-prep-secondary">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 text-prep-dark">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-gray-600 hover:text-prep-secondary">Twitter</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-prep-secondary">LinkedIn</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-prep-secondary">Instagram</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-sm text-center text-gray-500">
            © {new Date().getFullYear()} PrepPathwayPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
