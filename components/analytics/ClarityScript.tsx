'use client';

import Script from 'next/script';

export function ClarityScript() {
  return (
    <Script
      id="microsoft-clarity"
      strategy="beforeInteractive"
    >
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "v2objst5qo");

        // Grabar 100% de las sesiones sin sampling
        window.clarity("set", "upgradeSession");
      `}
    </Script>
  );
}
