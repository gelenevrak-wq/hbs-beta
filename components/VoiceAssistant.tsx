"use client";

import { useState, useEffect } from "react";

interface VoiceAssistantProps {
  onAdjustQuantity: (delta: number) => void;
  onSetShelf: (shelfCode: string) => void;
  activeShelf: string;
}

export default function VoiceAssistant({ onAdjustQuantity, onSetShelf, activeShelf }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supportSpeech, setSupportSpeech] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSupportSpeech(true);
      }
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "tr-TR"; // Support Turkish voice commands natively!
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("Dinleniyor... (Örn: 'ekle', 'çıkar', 'raf A-01')");
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript.toLowerCase().trim();
      setTranscript(`Algılanan: "${resultText}"`);

      // 1. Quantity Adjustments Command parsing
      if (resultText.includes("arttır") || resultText.includes("artır") || resultText.includes("ekle") || resultText.includes("artış")) {
        // Parse digit if spoken (e.g. "5 ekle")
        const match = /\d+/.exec(resultText);
        const delta = match ? parseInt(match[0]) : 1;
        onAdjustQuantity(delta);
      } else if (resultText.includes("azalt") || resultText.includes("çıkar") || resultText.includes("düşür") || resultText.includes("eksilt")) {
        const match = /\d+/.exec(resultText);
        const delta = match ? parseInt(match[0]) : 1;
        onAdjustQuantity(-delta);
      }

      // 2. Shelf Command parsing (e.g. "raf a bir", "raf b iki", "konum a-01")
      if (resultText.includes("raf") || resultText.includes("konum")) {
        // Extract code patterns like A-01, B-12
        // Match letter followed by number
        const match = /([a-z])\s*[-–]?\s*(\d+)/i.exec(resultText);
        if (match) {
          const letter = match[1].toUpperCase();
          const num = match[2].padStart(2, '0');
          const shelfCode = `${letter}-${num}`;
          onSetShelf(shelfCode);
        } else {
          // Fallback simple word matching
          if (resultText.includes("a1") || resultText.includes("a 1")) onSetShelf("A-01");
          if (resultText.includes("a2") || resultText.includes("a 2")) onSetShelf("A-02");
          if (resultText.includes("b1") || resultText.includes("b 1")) onSetShelf("B-01");
          if (resultText.includes("b2") || resultText.includes("b 2")) onSetShelf("B-02");
        }
      }
    };

    recognition.start();
  };

  if (!supportSpeech) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🎙️</span>
          <span className="text-xs font-black text-slate-800">Sesli Depo Asistanı (Hands-Free)</span>
        </div>
        <button
          type="button"
          onClick={startListening}
          className={`h-7 w-7 rounded-full flex items-center justify-center transition border ${
            isListening
              ? "bg-rose-50 border-rose-200 text-rose-600 animate-ping"
              : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 active:scale-90"
          }`}
          title="Konuşmayı Başlat"
        >
          {isListening ? "⏹" : "🎤"}
        </button>
      </div>

      <p className="text-[10px] text-slate-600 font-semibold leading-relaxed">
        {transcript || "Mikrofona tıklayıp konuşun. Ses komutlarıyla eller serbest sayım yapabilirsiniz."}
      </p>

      {activeShelf && (
        <div className="text-[9px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-md w-fit">
          Aktif Raf: {activeShelf}
        </div>
      )}
    </div>
  );
}
