declare module 'dom-to-image-more';
declare module 'audio2textjs';
type SpeechRecognition = typeof window.SpeechRecognition;
interface Window {
  webkitSpeechRecognition: any;
}
