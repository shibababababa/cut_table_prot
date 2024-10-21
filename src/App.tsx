import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./App.css"; // Ensure Tailwind CSS or custom styles are imported
import VideoGuideLocalPath from "./movie/sample.mp4";

function App() {
  const playerRef = useRef<ReactPlayer>(null); // ReactPlayer ref
  const [screenshots, setScreenshots] = useState<string[]>([]); // Store history of screenshots

  // Capture Screenshot Function
  const captureScreenshot = () => {
    const player = playerRef.current?.getInternalPlayer() as HTMLVideoElement;

    if (player) {
      // Create a temporary canvas element programmatically
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas size (scaling down 4x for smaller screenshot)
      canvas.width = player.videoWidth / 4;
      canvas.height = player.videoHeight / 4;

      // Draw the video frame on the canvas
      ctx?.drawImage(player, 0, 0, canvas.width, canvas.height);

      // Convert the canvas content to a Data URL and store it
      const dataURL = canvas.toDataURL("image/png");
      setScreenshots((prev) => [...prev, dataURL]); // Append to screenshot history
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <h1 className="text-2xl font-bold">React Player Screenshot</h1>

      {/* ReactPlayer with controls */}
      <ReactPlayer
        ref={playerRef}
        url={VideoGuideLocalPath}
        playing
        controls
        className="rounded-lg shadow-lg"
      />

      {/* Capture Screenshot Button */}
      <button
        onClick={captureScreenshot}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Capture Screenshot
      </button>
      {/* Display Screenshot History */}
      <div className="items-center gap-4 w-full">
        <h2 className="text-lg font-semibold">Screenshot History</h2>
        <div className="flex gap-4 overflow-x-auto">
          {screenshots.map((screenshot, index) => (
            <div key={index} className="flex flex-col items-center gap-2 py-8">
              <img
                src={screenshot}
                alt={`Screenshot ${index + 1}`}
                className="w-40 h-auto rounded shadow-md"
              />
              <div>
                <a
                  href={screenshot}
                  download={`screenshot-${index + 1}.png`}
                  className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Download Screenshot
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
