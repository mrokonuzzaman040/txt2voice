'use client';

interface DemoInstructionsProps {
  isRecording: boolean;
  supported: boolean;
  isClient: boolean;
}

export function DemoInstructions({ isRecording, supported, isClient }: DemoInstructionsProps) {
  if (!isClient || !supported || isRecording) return null;

  return (
    <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 mb-6">
      <h3 className="text-sm font-medium text-amber-200 mb-3">🎤 How to Use Bengali Voice Typing (Like Google Docs):</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-medium text-amber-300 mb-2">Basic Usage:</h4>
          <ol className="text-xs text-amber-300 space-y-1">
            <li>1. Click "Start Dictation"</li>
            <li>2. Speak in Bengali clearly</li>
            <li>3. Watch your words appear in real-time</li>
            <li>4. Click "Stop & Save" when done</li>
          </ol>
        </div>
        <div>
          <h4 className="text-xs font-medium text-amber-300 mb-2">Voice Commands:</h4>
          <ul className="text-xs text-amber-300 space-y-1">
            <li>• Say "comma" for ,</li>
            <li>• Say "period" for .</li>
            <li>• Say "new paragraph" for new line</li>
            <li>• Say "question mark" for ?</li>
            <li>• Use Insert menu for more formatting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
