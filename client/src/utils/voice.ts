import { showInfoToast } from "./Toast";

 export const handleTextToSpeech = (text:string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      showInfoToast("Text-to-Speech is not supported in your browser.");
    }
  };
 export const stopTextToSpeech = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};
