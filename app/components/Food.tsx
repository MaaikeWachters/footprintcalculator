// SpeechRecognition not recognized: npm install --save @types/dom-speech-recognition

"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";

export default function Food() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        setTranscript(transcriptResult);
      };

      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
      };
    } else {
      setError("Speech recognition is not supported in this browser.");
    }

    if (isListening && recognition) {
      recognition.start();
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div>
      <main>
        <div>What did you eat today?</div>

        <div
          onClick={toggleListening}
          className={`w-full h-16 text-lg ${
            isListening
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="mr-2 h-6 w-6" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="mr-2 h-6 w-6" />
              Start Listening
            </>
          )}
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="bg-white p-4 rounded-md min-h-[150px] border border-gray-200 shadow-sm">
          <p className="font-semibold mb-2 text-black">Your meal:</p>
          <p className="break-words text-black">
            {transcript ||
              'Tap "Start Listening" and start speaking to see your transcribed meal here.'}
          </p>
        </div>
      </main>
    </div>
  );
}
