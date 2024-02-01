import React from "react";

function Footer() {
  return (
    <footer className="bg-slate-800/50 text-white p-4 text-center">
      <p className="text-lg">
        Design inspired by{" "}
        <a
          href="https://newretrowave.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-300 hover:text-orange-400 underline hover:no-underline"
          aria-label="Visit New Retro Wave website (opens in a new tab)"
        >
          New Retro Wave
        </a>
      </p>
    </footer>
  );
}

export default Footer;
