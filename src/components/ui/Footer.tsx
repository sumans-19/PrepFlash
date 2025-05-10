import React from 'react';
import { Sparkles, Facebook, Twitter, Linkedin, Instagram, Github } from 'lucide-react';

export function Footer() {
  // Color palette meticulously matched to "Screenshot 2025-05-09 011530.png"
  const themeColors = {
    // Main footer background - this is crucial to get right.
    // Eyedropper from screenshot suggests a color like #201A3D or similar.
    background: 'bg-[#201A3D]', // Target: Very dark, desaturated purple

    // Border color for subtle separation
    border: 'border-purple-800/30', // Very subtle, dark translucent purple

    // Text Colors
    brandText: 'text-indigo-300', // For "PrepFlash" brand - a distinct light purple/lavender
    headingText: 'text-indigo-300', // For column titles like "Product", "Resources"
    paragraphText: 'text-gray-400',  // For the main descriptive paragraph
    linkText: 'text-gray-400',       // For individual links in columns and bottom
    linkTextHover: 'text-indigo-200',// Brighter lavender/purple on hover for links

    // Icon Colors
    mainIcon: 'text-indigo-300',     // For the Sparkles icon next to PrepFlash
    socialIconColor: 'text-indigo-300', // Social media icons themselves (Facebook, Twitter, etc.)
    socialIconBg: 'bg-transparent', // Social icon background should be transparent or match footer exactly
    socialIconBgHover: 'bg-purple-900/20', // Very subtle hover background for social icons
  };

  return (
    <footer className={`${themeColors.background} border-t ${themeColors.border} pt-6 pb-2`}>
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className={`w-8 h-8 ${themeColors.mainIcon}`} />
              <span className={`text-xl font-bold ${themeColors.brandText}`}>
                PrepFlash
              </span>
            </div>
            <p className={`${themeColors.paragraphText} mb-6 max-w-md`}>
              Revolutionizing interview preparation with AI-powered tools, personalized learning experiences,
              and a supportive global community.
            </p>
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {[
                { icon: <Facebook className="w-5 h-5" />, label: "Facebook", href: "#" },
                { icon: <Twitter className="w-5 h-5" />, label: "Twitter", href: "#" },
                { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", href: "#" },
                { icon: <Instagram className="w-5 h-5" />, label: "Instagram", href: "#" },
                { icon: <Github className="w-5 h-5" />, label: "GitHub", href: "#" }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  // The social icons in the screenshot are very minimal, almost just the icon color.
                  className={`w-10 h-10 rounded-full ${themeColors.socialIconBg} flex items-center justify-center hover:${themeColors.socialIconBgHover} transition-colors duration-200 ${themeColors.socialIconColor} group`}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {React.cloneElement(social.icon, { className: `w-5 h-5 ${themeColors.socialIconColor} group-hover:text-indigo-200 transition-colors duration-200` })}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {[
            {
              title: "Product",
              links: ["Features", "Roadmap"]
            },
            {
              title: "Resources",
              links: ["Documentation", "Blog"]
            },
            {
              title: "Company",
              links: ["About Us", "Careers"]
            }
          ].map((column) => (
            <div key={column.title}>
              <h3 className={`font-semibold ${themeColors.headingText} mb-4`}>{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className={`${themeColors.linkText} hover:${themeColors.linkTextHover} transition-colors duration-200`}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer Section */}
        <div className={`border-t ${themeColors.border} pt-8 flex flex-col md:flex-row justify-between items-center`}>
          <p className={`${themeColors.linkText} text-sm mb-4 md:mb-0`}>
            © {new Date().getFullYear()} PrepFlash. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <a href="#" className={`${themeColors.linkText} hover:${themeColors.linkTextHover} transition-colors duration-200`}>Privacy Policy</a>
            <a href="#" className={`${themeColors.linkText} hover:${themeColors.linkTextHover} transition-colors duration-200`}>Terms of Service</a>
            <a href="#" className={`${themeColors.linkText} hover:${themeColors.linkTextHover} transition-colors duration-200`}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}