/**
 * DJ Scene Constants
 * ==================
 * Playlist and configuration for the DJ scene.
 */

export interface Track {
  url: string;
  title: string;
  artist: string;
}

// SoundCloud tracks playlist
export const PLAYLIST: Track[] = [
  {
    url: 'https://soundcloud.com/larryjunetfm/who-coppin',
    title: 'Who Coppin',
    artist: 'Larry June',
  },
  {
    url: 'https://soundcloud.com/vince-staples-official/aye-free-the-homies',
    title: 'Aye! (Free the Homies)',
    artist: 'Vince Staples',
  },
  {
    url: 'https://soundcloud.com/vince-staples-official/black-blue',
    title: 'Black & Blue',
    artist: 'Vince Staples',
  },
];
