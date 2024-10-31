import { useRef, useState } from "react";
import ReactPlayer from "react-player";

type Props = {
  videoURL: string;
};

type Cut = {
  image: string;
  startAt: number;
};

export function Capture(props: Props) {
  const playerRef = useRef<ReactPlayer>(null);
  const [screenshots, setScreenshots] = useState<Cut[]>([]);
  const [validNumberOfScreenshots, setValidNumberOfScreenshots] = useState(8);

  const captureScreenshot = () => {
    if (screenshots.length < validNumberOfScreenshots) {
      const player = playerRef.current?.getInternalPlayer() as HTMLVideoElement;

      if (player) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = player.videoWidth / 4;
        canvas.height = player.videoHeight / 4;

        ctx?.drawImage(player, 0, 0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL("image/png");
        const list = [
          ...screenshots,
          { image: dataURL, startAt: playerRef.current.getCurrentTime() },
        ];
        setScreenshots(
          list.sort((ss1, ss2) => {
            return ss1.startAt > ss2.startAt ? 1 : -1;
          })
        );
      }
    } else {
      alert("Too many screenshots!");
    }
  };

  const onClickDelete = (startAt: number) => {
    const newList = screenshots.filter((screenshot) => {
      return screenshot.startAt !== startAt;
    });
    setScreenshots(newList);
  };

  const getLengthOfColumn = () => {
    switch (validNumberOfScreenshots / 2) {
      case 4:
        return "grid-cols-4";
      case 5:
        return "grid-cols-5";
      case 6:
        return "grid-cols-6";
    }
  }

  const ScreenshotsHistory = () => {
    return (
      <div className="w-full mt-6">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Screenshot History
          </h2>
          <label>
            Valid number of screenshots is:
            <select
              name="selectedFruit"
              className="ml-4"
              onChange={(e) => {
                const newValidNumberOfScreenshots = Number(e.target.value);
                setValidNumberOfScreenshots(newValidNumberOfScreenshots);
              }}
            >
              <option value="8" disabled={screenshots.length > 8}>
                8枚カット
              </option>
              <option value="10" disabled={screenshots.length > 10}>
                10枚カット
              </option>
              <option value="12" disabled={screenshots.length > 12}>
                12枚カット
              </option>
            </select>
          </label>
        </div>
        <div
          className={`grid ${getLengthOfColumn()} gap-6 overflow-x-auto py-4 border-t-2 border-gray-300`}
        >
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md
             hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              <p className="text-sm text-gray-600 mb-2">
                Captured at: {screenshot.startAt.toFixed(5)}s
              </p>
              <img
                src={screenshot.image}
                alt={`Screenshot ${index + 1}`}
                className="w-full h-auto rounded-lg mb-4"
              />
              <a
                href={screenshot.image}
                download={`screenshot-${index + 1}.png`}
                className="w-full text-center px-4 py-2 my-2 bg-green-500 text-white rounded-md 
               hover:bg-green-600 transition-all duration-300"
              >
                Download Screenshot
              </a>
              <button
                onClick={() => onClickDelete(screenshot.startAt)}
                className="w-full text-center px-4 py-2 my-2 bg-red-500 text-white rounded-md 
               hover:bg-red-600 transition-all duration-300"
              >
                Delete Screenshot
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 p-6 bg-gray-50 rounded-lg shadow-xl max-w-6xl mx-auto">
      <ReactPlayer
        ref={playerRef}
        url={props.videoURL}
        playing
        controls
        className="rounded-lg shadow-lg overflow-hidden"
        width="100%"
        height="100%"
      />
      <button
        onClick={captureScreenshot}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md 
               hover:bg-blue-600 transition-all duration-300 ease-in-out"
      >
        Capture Screenshot
      </button>
      <ScreenshotsHistory></ScreenshotsHistory>
    </div>
  );
}
