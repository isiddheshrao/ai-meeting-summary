import { useRef, useState } from "react";
import { encodeWav } from "../lib/wavEncoder";
import { CAPTURE } from "../lib/copy";
import { MicIcon, StopIcon, AlertIcon } from "./icons";

export function CaptureControls({ onRecordingReady }: { onRecordingReady: (blob: Blob) => void }) {
  const [recording, setRecording] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const chunksRef = useRef<Float32Array[]>([]);

  async function startCapture() {
    setCaptureError(null);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((t) => t.stop());
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        setCaptureError(CAPTURE.noAudioTrackError);
        return;
      }
      const audioOnlyStream = new MediaStream(audioTracks);
      audioStreamRef.current = audioOnlyStream;

      const audioContext = new AudioContext();
      await audioContext.resume();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(audioOnlyStream);
      sourceRef.current = source;
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      const silentGain = audioContext.createGain();
      silentGain.gain.value = 0;

      chunksRef.current = [];
      processor.onaudioprocess = (e) => {
        chunksRef.current.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };
      source.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(audioContext.destination);

      setRecording(true);
    } catch (e) {
      setCaptureError(e instanceof Error ? e.message : CAPTURE.genericError);
    }
  }

  function stopCapture() {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    audioStreamRef.current?.getTracks().forEach((t) => t.stop());

    const sampleRate = audioContextRef.current?.sampleRate ?? 48000;
    const totalLength = chunksRef.current.reduce((sum, c) => sum + c.length, 0);
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of chunksRef.current) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }
    audioContextRef.current?.close();
    setRecording(false);

    const wavBlob = encodeWav(merged, sampleRate);
    onRecordingReady(wavBlob);
  }

  return (
    <div>
      {!recording ? (
        <button
          onClick={startCapture}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 active:bg-rose-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500"
        >
          <MicIcon className="w-4 h-4" />
          {CAPTURE.startButton}
        </button>
      ) : (
        <button
          onClick={stopCapture}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-500"
        >
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <StopIcon className="w-4 h-4" />
          {CAPTURE.stopButton}
        </button>
      )}
      {!recording && <p className="text-xs text-zinc-400 mt-2">{CAPTURE.caveat}</p>}
      {captureError && (
        <div className="flex items-start gap-2 mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          <AlertIcon className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{captureError}</span>
        </div>
      )}
    </div>
  );
}
