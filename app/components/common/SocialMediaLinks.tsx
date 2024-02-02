import {
  RxGithubLogo,
  RxLinkedinLogo,
  RxEnvelopeOpen,
  RxEnvelopeClosed,
  RxDownload,
} from "react-icons/rx";

interface SocialMediaLinksProps {
  handleMouseToggle: () => void;
  isEnvelopeIconClosed: boolean;
}

function SocialMediaLinks({
  handleMouseToggle,
  isEnvelopeIconClosed,
}: SocialMediaLinksProps) {
  return (
    <ul className="flex items-center ml-1 mt-8" aria-label="Social media">
      <li className="mr-5 text-xs shrink-0">
        <a
          href="https://github.com/alvinwquach"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub (opens in a new tab)"
          title="GitHub"
          className="text-white focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150  hover:bg-slate-800/50"
        >
          <span className="sr-only">GitHub</span>
          <RxGithubLogo className="block h-6 w-6" />
        </a>
      </li>
      <li className="mr-5 text-xs shrink-0">
        <a
          href="https://www.linkedin.com/in/a-quach/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn (opens in a new tab)"
          title="LinkedIn"
          className="text-white focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150  hover:bg-slate-800/50"
        >
          <span className="sr-only">LinkedIn</span>
          <RxLinkedinLogo className="block h-6 w-6" />
        </a>
      </li>
      <li className="mr-5 text-xs shrink-0">
        <a
          href="mailto: alvinwquach@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Email (opens in a new tab)"
          title="Email"
          className="text-white focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150 hover:bg-slate-800/50"
          onMouseEnter={handleMouseToggle}
          onMouseLeave={handleMouseToggle}
        >
          <span className="sr-only">Email</span>
          {isEnvelopeIconClosed ? (
            <RxEnvelopeOpen className="block h-6 w-6" />
          ) : (
            <RxEnvelopeClosed className="block h-6 w-6" />
          )}
        </a>
      </li>
      <li className="mr-5 text-xs shrink-0">
        <a
          href="/resume/alvin-quach-resume-fullstack.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Resume (Opens in a new tab)"
          title="Download Resume"
          download
          className="text-white focus-ring-base flex flex-row items-center justify-center rounded-full p-2 transition-colors duration-150  hover:bg-slate-800/50"
        >
          <RxDownload className="block h-6 w-6" />
        </a>
      </li>
    </ul>
  );
}

export default SocialMediaLinks;
