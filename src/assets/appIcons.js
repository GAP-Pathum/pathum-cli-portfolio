// macOS/iOS App Icons
export const appIcons = {
  finder: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="finderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#54A6DD;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3182CE;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#finderGrad)"/>
      <path d="M32 14 C32 14 28 14 22 20 C22 20 20 22 20 24 L20 42 C20 44 22 46 24 46 L40 46 C42 46 44 44 44 42 L44 24 C44 22 42 20 42 20 C36 14 32 14 32 14 Z" fill="white" opacity="0.25"/>
      <path d="M16 28 L16 46 C16 49 18 51 21 51 L43 51 C46 51 48 49 48 46 L48 28 Z" fill="white" opacity="0.9"/>
      <path d="M32 16 L22 26 L16 26 L16 28 L48 28 L48 26 L42 26 Z" fill="#4A9CD9"/>
      <circle cx="20" cy="23" r="1.2" fill="#FF5F57"/>
      <circle cx="24" cy="23" r="1.2" fill="#FFBD2E"/>
      <circle cx="28" cy="23" r="1.2" fill="#28CA42"/>
      <path d="M24 35 L28 39 L40 27" stroke="#3182CE" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  `,
  
  safari: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="safariGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#00D4FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0082FB;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="safariCenter">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:white;stop-opacity:0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#safariGrad)"/>
      <circle cx="32" cy="32" r="24" fill="url(#safariCenter)"/>
      <g opacity="0.9">
        <line x1="32" y1="6" x2="32" y2="11" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <line x1="32" y1="53" x2="32" y2="58" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <line x1="6" y1="32" x2="11" y2="32" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <line x1="53" y1="32" x2="58" y2="32" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <line x1="13" y1="13" x2="16.5" y2="16.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="47.5" y1="47.5" x2="51" y2="51" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="51" y1="13" x2="47.5" y2="16.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="16.5" y1="47.5" x2="13" y2="51" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      </g>
      <path d="M32 32 L42 20" stroke="#FF3B30" stroke-width="3" stroke-linecap="round"/>
      <path d="M32 32 L22 44" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <circle cx="32" cy="32" r="2.5" fill="white"/>
    </svg>
  `,
  
  mail: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#3DB0F7;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1890F1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#mailGrad)"/>
      <rect x="8" y="16" width="48" height="32" rx="4" fill="white"/>
      <path d="M8 20 L32 36 L56 20" fill="none" stroke="#1890F1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 20 L8 16 C8 16 8 16 12 16 L52 16 C56 16 56 16 56 16 L56 20 L32 36 Z" fill="#1890F1" opacity="0.15"/>
    </svg>
  `,
  
  messages: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="messagesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#5DFC77;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00DC3E;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#messagesGrad)"/>
      <g transform="translate(32, 32)">
        <path d="M-20 -10 C-20 -14 -17 -17 -13 -17 L13 -17 C17 -17 20 -14 20 -10 L20 8 C20 12 17 15 13 15 L-5 15 L-15 22 L-15 15 L-13 15 C-17 15 -20 12 -20 8 Z" fill="white"/>
      </g>
    </svg>
  `,
  
  terminal: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="terminalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#323232;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0D0D0D;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#terminalGrad)"/>
      <rect x="10" y="10" width="44" height="44" rx="2" fill="#000000" opacity="0.6"/>
      <path d="M18 24 L24 30 L18 36" stroke="#00FF7F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <line x1="28" y1="34" x2="40" y2="34" stroke="#00FF7F" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
  
  photos: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="photosGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF5733;stop-opacity:1" />
          <stop offset="20%" style="stop-color:#FF8B42;stop-opacity:1" />
          <stop offset="40%" style="stop-color:#FFD93D;stop-opacity:1" />
          <stop offset="60%" style="stop-color:#6BCF7F;stop-opacity:1" />
          <stop offset="80%" style="stop-color:#4D96FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#9D4EDD;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#photosGrad)"/>
      <g transform="translate(32, 32) rotate(-45)">
        <circle cx="0" cy="-11" r="7" fill="white"/>
        <circle cx="9.5" cy="-5.5" r="7" fill="white"/>
        <circle cx="9.5" cy="5.5" r="7" fill="white"/>
        <circle cx="0" cy="11" r="7" fill="white"/>
        <circle cx="-9.5" cy="5.5" r="7" fill="white"/>
        <circle cx="-9.5" cy="-5.5" r="7" fill="white"/>
        <circle cx="0" cy="0" r="7" fill="white"/>
        <circle cx="0" cy="0" r="4" fill="#FFC837"/>
      </g>
    </svg>
  `,
  
  notes: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="notesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFE44D;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FFBD03;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#notesGrad)"/>
      <rect x="8" y="8" width="48" height="48" rx="2" fill="#FFFEF5"/>
      <line x1="8" y1="18" x2="56" y2="18" stroke="#FFE44D" stroke-width="1.5"/>
      <text x="14" y="15" font-family="-apple-system, 'SF Pro Display'" font-size="6" font-weight="700" fill="#8B7234">10:47</text>
      <text x="14" y="29" font-family="-apple-system, 'SF Pro Display'" font-size="7" font-weight="600" fill="#1C1C1E">Portfolio Notes</text>
      <line x1="14" y1="35" x2="50" y2="35" stroke="#E5E5E5" stroke-width="1" stroke-linecap="round"/>
      <line x1="14" y1="40" x2="48" y2="40" stroke="#E5E5E5" stroke-width="1" stroke-linecap="round"/>
      <line x1="14" y1="45" x2="44" y2="45" stroke="#E5E5E5" stroke-width="1" stroke-linecap="round"/>
      <line x1="14" y1="50" x2="40" y2="50" stroke="#E5E5E5" stroke-width="1" stroke-linecap="round"/>
    </svg>
  `,
  
  settings: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="settingsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#A8A8AD;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6E6E73;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#settingsGrad)"/>
      <g transform="translate(32, 32)">
        <path d="M0,-20 L2,-16 L6,-16 L8,-14 L8,-10 L12,-8 L14,-6 L16,-2 L16,2 L14,6 L12,8 L8,10 L8,14 L6,16 L2,16 L0,20 L-2,16 L-6,16 L-8,14 L-8,10 L-12,8 L-14,6 L-16,2 L-16,-2 L-14,-6 L-12,-8 L-8,-10 L-8,-14 L-6,-16 L-2,-16 Z" fill="white"/>
        <circle cx="0" cy="0" r="7" fill="url(#settingsGrad)"/>
        <circle cx="0" cy="0" r="4" fill="white" opacity="0.9"/>
      </g>
    </svg>
  `,
    chatbot: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chatbotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4285F4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#34A853;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#chatbotGrad)"/>
      <ellipse cx="32" cy="38" rx="18" ry="12" fill="#fff" opacity="0.9"/>
      <ellipse cx="32" cy="28" rx="14" ry="10" fill="#fff" opacity="0.7"/>
      <circle cx="24" cy="32" r="2.5" fill="#4285F4"/>
      <circle cx="40" cy="32" r="2.5" fill="#34A853"/>
      <rect x="28" y="40" width="8" height="3" rx="1.5" fill="#B0BEC5"/>
    </svg>
  `,
  chatbotMobile: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chatbotMobileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4285F4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#34A853;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#chatbotMobileGrad)"/>
      <ellipse cx="32" cy="40" rx="18" ry="12" fill="#fff" opacity="0.9"/>
      <ellipse cx="32" cy="30" rx="14" ry="10" fill="#fff" opacity="0.7"/>
      <circle cx="24" cy="34" r="2.5" fill="#4285F4"/>
      <circle cx="40" cy="34" r="2.5" fill="#34A853"/>
      <rect x="28" y="44" width="8" height="3" rx="1.5" fill="#B0BEC5"/>
    </svg>
  `,

  // iOS-specific icons with rounded square backgrounds
  terminalMobile: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="terminalMobileGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#323232;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0D0D0D;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#terminalMobileGrad)"/>
      <rect x="10" y="10" width="44" height="44" rx="2" fill="#000000" opacity="0.6"/>
      <path d="M18 24 L24 30 L18 36" stroke="#00FF7F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <line x1="28" y1="34" x2="40" y2="34" stroke="#00FF7F" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,

  photosMobile: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="photosMobileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF5733;stop-opacity:1" />
          <stop offset="20%" style="stop-color:#FF8B42;stop-opacity:1" />
          <stop offset="40%" style="stop-color:#FFD93D;stop-opacity:1" />
          <stop offset="60%" style="stop-color:#6BCF7F;stop-opacity:1" />
          <stop offset="80%" style="stop-color:#4D96FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#9D4EDD;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#photosMobileGrad)"/>
      <g transform="translate(32, 32) rotate(-45)">
        <circle cx="0" cy="-11" r="7" fill="white"/>
        <circle cx="9.5" cy="-5.5" r="7" fill="white"/>
        <circle cx="9.5" cy="5.5" r="7" fill="white"/>
        <circle cx="0" cy="11" r="7" fill="white"/>
        <circle cx="-9.5" cy="5.5" r="7" fill="white"/>
        <circle cx="-9.5" cy="-5.5" r="7" fill="white"/>
        <circle cx="0" cy="0" r="7" fill="white"/>
        <circle cx="0" cy="0" r="4" fill="#FFC837"/>
      </g>
    </svg>
  `,

  notesMobile: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="notesMobileGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFE44D;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FFBD03;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#notesMobileGrad)"/>
      <rect x="8" y="8" width="48" height="48" rx="2" fill="#FFFEF5"/>
      <line x1="8" y1="18" x2="56" y2="18" stroke="#FFE44D" stroke-width="1.5"/>
      <text x="14" y="15" font-family="-apple-system, 'SF Pro Display'" font-size="6" font-weight="700" fill="#8B7234">10:47</text>
      <text x="14" y="29" font-family="-apple-system, 'SF Pro Display'" font-size="7" font-weight="600" fill="#1C1C1E">Portfolio Notes</text>
      <line x1="14" y1="35" x2="50" y2="35" stroke="#E5E5E5" stroke-width="1" stroke-linecap="round"/>
      <line x1="14" y1="40" x2="48" y2="40" stroke="#E5E5E5" stroke-width="1" stroke-linecap="round"/>
      <line x1="14" y1="45" x2="44" y2="45" stroke="#E5E5E5" stroke-width="1" stroke-linecap="round"/>
      <line x1="14" y1="50" x2="40" y2="50" stroke="#E5E5E5" stroke-width="1" stroke-linecap="round"/>
    </svg>
  `,

  pdf: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pdfGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FF4444;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#CC0000;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="6" fill="url(#pdfGrad)"/>
      <path d="M12 8 L42 8 L52 18 L52 56 L12 56 Z" fill="white" opacity="0.15"/>
      <path d="M42 8 L42 18 L52 18" fill="white" opacity="0.1"/>
      <text x="32" y="40" font-family="-apple-system, 'SF Pro Display'" font-size="18" font-weight="900" fill="white" text-anchor="middle" letter-spacing="1">PDF</text>
    </svg>
  `,

  pdfMobile: `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pdfMobileGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FF4444;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#CC0000;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#pdfMobileGrad)"/>
      <path d="M16 12 L40 12 L48 20 L48 52 L16 52 Z" fill="white" opacity="0.2"/>
      <path d="M40 12 L40 20 L48 20" fill="white" opacity="0.15"/>
      <text x="32" y="38" font-family="-apple-system, 'SF Pro Display'" font-size="16" font-weight="900" fill="white" text-anchor="middle" letter-spacing="1">PDF</text>
    </svg>
  `
};
