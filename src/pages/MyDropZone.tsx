import { useState, useCallback, useMemo } from "react";
import { useDropzone, DropzoneRootProps } from "react-dropzone";

import { Capture } from "./Capture";

const baseStyle: DropzoneRootProps = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

// フォーカスが当たったときの枠の色
const focusedStyle = {
  borderColor: "#2196f3",
};

// 受け入れ可能なファイルをドラッグしたときの色
const acceptStyle = {
  borderColor: "#00e676",
};

// 受け入れできないファイルをドラッグしたときの色
const rejectStyle = {
  borderColor: "#ff1744",
};

export function MyDropzone() {
  const [videoURL, setVideoURL] = useState<string>();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const reader = new FileReader();
    reader.onload = () => {
      const videoURL = reader.result as string;
      setVideoURL(videoURL)  
    };
    reader.readAsDataURL(acceptedFiles[0])
  }, []);
  const onDelete = () => {
    setVideoURL(undefined)
  }


  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive,
  } = useDropzone({
    maxFiles: 1,
    accept: {
      "video/mp4": ["mp4"],
    },
    onDrop,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <>
      {videoURL == null ? (
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>Drag drop a file here, or click to select file</p>
          )}
        </div>
      ) : (
        <div>
          <button onClick={onDelete}>動画削除</button>
          <Capture videoURL={videoURL}></Capture>
        </div>
      )}
    </>
  );
}
