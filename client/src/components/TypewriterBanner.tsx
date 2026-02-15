import { useState, useEffect } from 'react';

const TypewriterBanner = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = "PILLARVALE INC 2026";
  const speed = isDeleting ? 50 : 150;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
      } else {
        setText(fullText.substring(0, isDeleting ? text.length - 1 : text.length + 1));
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting]);

  return (
    <footer className="fixed bottom-0 w-full py-6 border-t border-white/5 bg-black/20 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-8 flex justify-center">
        <p className="font-mono text-[10px] tracking-[0.5em] text-zinc-500 uppercase">
          {text}<span className="animate-pulse">_</span>
        </p>
      </div>
    </footer>
  );
};

export default TypewriterBanner;