export const BizForzTheme = {
  // Primary brand identity (Lime greens)
  primary: {
    main: '#C8F135',        // The signature vibrant lime green/yellow (rgb 200 241 53)
    dark: '#9DBB2D',        // Darker lime green for hover/active states (rgb 157 187 45)
    light: '#D7FF00',       // Brightest lime green (rgba 215 255 0)
    pale: '#F4F6DD',        // Pale lime green background (rgb 244 246 221)
    translucent: 'rgba(200, 241, 53, 0.22)', // Subtle translucent lime for glows/shadows
  },

  // Deep contrast brand colors (Indigos & Deep Blues)
  secondary: {
    main: '#06006B',        // Deep navy blue used for major headers/gradient highlights
    dark: '#030047',        // Ultra-dark blue/black
    light: '#3B82F6',       // Standard Tailwind/Vibrant blue accent
  },

  // General layout backgrounds
  background: {
    default: '#FFFFFF',     // Pure white background
    soft: '#F4F4F2',        // Signature soft off-white/light gray background
    neutral: '#F7F7F4',     // Alternative soft background tint
    card: '#FCFCFC',        // Distinct off-white card backgrounds
    dark: '#111111',        // True dark theme / dark section background
  },

  // Typography colors
  text: {
    primary: '#111111',     // Almost black for primary headings/body text
    secondary: '#7E8792',   // Slate gray for subtitles and body captions
    muted: '#9CA3AF',       // Tailwind gray-400 for disabled/placeholder text
    light: '#FFFFFF',       // White text for dark headers/sections
  },

  // Structural borders and lines
  border: {
    default: '#E6E6E3',     // Soft gray border line
    light: '#E5E7EB',      // Standard Tailwind gray-200 border
  },

  // Utility colors (Alerts, Statuses, etc.)
  status: {
    success: '#E8F6E9',     // Soft green success background
    error: '#FBE9E4',       // Soft red/pink error background
    info: '#EFF6FF',        // Soft blue info background
    warning: '#FFFBEB',     // Soft yellow warning background
  },

  // Box shadows matching the application design
  shadows: {
    glow: '0 10px 24px rgba(200, 241, 53, 0.22)',
    button: '0 14px 30px rgba(199, 240, 0, 0.24)',
    card: '0 8px 30px rgba(0, 0, 0, 0.06)',
  }
};

export type ThemeType = typeof BizForzTheme;
