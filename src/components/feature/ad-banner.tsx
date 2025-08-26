import { useEffect, useRef } from "react";

const AdBanner: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current) {
      // remove previous scripts if component re-renders
      adRef.current.innerHTML = "";

      // first script (inline config)
      const script1 = document.createElement("script");
      script1.type = "text/javascript";
      script1.innerHTML = `
        atOptions = {
          'key': '7904558c8e1965b3cd10c5ed2bb182ff',
          'format': 'iframe',
          'height': 60,
          'width': 468,
          'params': {}
        };
      `;

      // second script (external src)
      const script2 = document.createElement("script");
      script2.type = "text/javascript";
      script2.src = "//statespiecehooter.com/7904558c8e1965b3cd10c5ed2bb182ff/invoke.js";

      // append both
      adRef.current.appendChild(script1);
      adRef.current.appendChild(script2);
    }
  }, []);

  return (
    <div
      ref={adRef}
      style={{ width: 468, height: 60 }}
      id="ad-banner"
    />
  );
};

export default AdBanner;
