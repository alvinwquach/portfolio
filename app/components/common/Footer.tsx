import { press_start_2p } from "@/utils/fonts";

function Footer() {
  return (
    <footer
      className={`${press_start_2p.className} bg-slate-800/50 text-white p-4 text-center`}
    >
      <p className="text-lg">
        Design inspired by{" "}
        <a
          href="https://www.youtube.com/@NewRetroWave"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-orange-300 hover:text-orange-400 underline hover:no-underline"
          aria-label="Visit New Retro Wave's Youtube Channel (opens in a new tab)"
        >
          New Retro Wave
        </a>
      </p>
    </footer>
  );
}

export default Footer;
