import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import VideoGuideLocalPath from "../movie/sample.mp4";

type Props = {
  videoURL: string;
}

export function Capture(props: Props) {
  const playerRef = useRef<ReactPlayer>(null); 
  const [screenshots, setScreenshots] = useState<string[]>([]); 

  const captureScreenshot = () => {
    const player = playerRef.current?.getInternalPlayer() as HTMLVideoElement;

    if (player) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = player.videoWidth / 4;
      canvas.height = player.videoHeight / 4;

      ctx?.drawImage(player, 0, 0, canvas.width, canvas.height);

      const dataURL = canvas.toDataURL("image/png");
      setScreenshots((prev) => [...prev, dataURL]); 
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <ReactPlayer
        ref={playerRef}
        url={props.videoURL}
        playing
        controls
        className="rounded-lg shadow-lg"
      />

      <button
        onClick={captureScreenshot}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Capture Screenshot
      </button>
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