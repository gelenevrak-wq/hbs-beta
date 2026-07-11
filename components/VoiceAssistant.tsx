import { useState, useEffect } from "react";

interface VoiceAssistantProps {
  onAdjustQuantity: (delta: number) => void;
  onSetShelf: (shelfCode: string) => void;
  activeShelf: string;
  language?: string;
}

interface LangConfig {
  code: string;
  incKeywords: string[];
  decKeywords: string[];
  shelfKeywords: string[];
  listeningPlaceholder: string;
}

const langConfigs: Record<string, LangConfig> = {
  tr: {
    code: "tr-TR",
    incKeywords: ["arttır", "artir", "ekle", "artış", "art"],
    decKeywords: ["azalt", "çıkar", "cikar", "düşür", "dusur", "eksilt"],
    shelfKeywords: ["raf", "konum"],
    listeningPlaceholder: "Dinleniyor... (Örn: 'ekle', 'çıkar', 'raf A-01')"
  },
  en: {
    code: "en-US",
    incKeywords: ["add", "plus", "increase", "increment"],
    decKeywords: ["remove", "minus", "decrease", "decrement", "subtract"],
    shelfKeywords: ["shelf", "location", "position"],
    listeningPlaceholder: "Listening... (e.g. 'add', 'remove', 'shelf A-01')"
  },
  de: {
    code: "de-DE",
    incKeywords: ["hinzufügen", "plus", "erhöhen", "addieren", "mehr"],
    decKeywords: ["entfernen", "minus", "verringern", "abziehen", "weniger"],
    shelfKeywords: ["regal", "position", "fach"],
    listeningPlaceholder: "Zuhören... (z. B. 'hinzufügen', 'entfernen', 'Regal A-01')"
  },
  ru: {
    code: "ru-RU",
    incKeywords: ["добавить", "плюс", "увеличить", "прибавить"],
    decKeywords: ["удалить", "минус", "уменьшить", "убрать", "отнять"],
    shelfKeywords: ["полка", "ячейка", "место"],
    listeningPlaceholder: "Прослушивание... (например, 'добавить', 'удалить', 'полка A-01')"
  },
  ka: {
    code: "ka-GE",
    incKeywords: ["დაამატე", "პლიუსი", "გაზარდე", "მიუმატე"],
    decKeywords: ["წაშალе", "წაშალე", "მინუსი", "შეამცირე", "მოაკელი"],
    shelfKeywords: ["თარო", "ლოკაცია", "ადგილი"],
    listeningPlaceholder: "მოსმენა... (მაგ: 'დაამატე', 'წაშალე', 'თარო A-01')"
  }
};

const texts = {
  tr: {
    title: "Sesli Depo Asistanı (Hands-Free)",
    startListening: "Konuşmayı Başlat",
    defaultMessage: "Mikrofona tıklayıp konuşun. Ses komutlarıyla eller serbest sayım yapabilirsiniz.",
    detected: "Algılanan:",
    activeShelf: "Aktif Raf"
  },
  en: {
    title: "Voice Warehouse Assistant (Hands-Free)",
    startListening: "Start Listening",
    defaultMessage: "Click the microphone and speak. You can do hands-free stock counts with voice commands.",
    detected: "Detected:",
    activeShelf: "Active Shelf"
  },
  de: {
    title: "Sprachassistent für Lager (Freihändig)",
    startListening: "Spracherkennung starten",
    defaultMessage: "Klicken Sie auf das Mikrofon und sprechen Sie. Sie können Inventuren freihändig per Sprachbefehl durchführen.",
    detected: "Erkannt:",
    activeShelf: "Aktives Regal"
  },
  ru: {
    title: "Голосовой помощник склада (Hands-Free)",
    startListening: "Начать запись",
    defaultMessage: "Нажмите на микрофон и говорите. Вы можете выполнять инвентаризацию без рук с помощью голосовых команд.",
    detected: "Распознано:",
    activeShelf: "Активная полка"
  },
  ka: {
    title: "საწყობის ხმოვანი ასისტენტი (Hands-Free)",
    startListening: "საუბრის დაწყება",
    defaultMessage: "დააწკაპუნეთ მიკროფონს და ისაუბრეთ. შეგიძლიათ განახორციელოთ ინვენტარიზაცია ხმოვანი ბრძანებებით.",
    detected: "ამოცნობილია:",
    activeShelf: "აქტიური თარო"
  }
};

export default function VoiceAssistant({ onAdjustQuantity, onSetShelf, activeShelf, language = "tr" }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supportSpeech, setSupportSpeech] = useState(false);

  const activeLang = (language && texts[language as keyof typeof texts]) ? language : "tr";
  const t = texts[activeLang as keyof typeof texts] || texts.tr;
  const config = langConfigs[activeLang] || langConfigs.tr;

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
    recognition.lang = config.code;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript(config.listeningPlaceholder);
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
      setTranscript(`${t.detected} "${resultText}"`);

      // 1. Quantity Adjustments Command parsing
      const isInc = config.incKeywords.some(keyword => resultText.includes(keyword));
      const isDec = config.decKeywords.some(keyword => resultText.includes(keyword));

      if (isInc) {
        const match = /\d+/.exec(resultText);
        const delta = match ? parseInt(match[0]) : 1;
        onAdjustQuantity(delta);
      } else if (isDec) {
        const match = /\d+/.exec(resultText);
        const delta = match ? parseInt(match[0]) : 1;
        onAdjustQuantity(-delta);
      }

      // 2. Shelf Command parsing
      const isShelfCommand = config.shelfKeywords.some(keyword => resultText.includes(keyword));
      if (isShelfCommand) {
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
          <span className="text-xs font-black text-slate-800">{t.title}</span>
        </div>
        <button
          type="button"
          onClick={startListening}
          className={`h-7 w-7 rounded-full flex items-center justify-center transition border ${
            isListening
              ? "bg-rose-50 border-rose-200 text-rose-600 animate-ping"
              : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 active:scale-90"
          }`}
          title={t.startListening}
        >
          {isListening ? "⏹" : "🎤"}
        </button>
      </div>

      <p className="text-[10px] text-slate-600 font-semibold leading-relaxed">
        {transcript || t.defaultMessage}
      </p>

      {activeShelf && (
        <div className="text-[9px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-md w-fit">
          {t.activeShelf}: {activeShelf}
        </div>
      )}
    </div>
  );
}
