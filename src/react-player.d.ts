declare module "react-player" {
    import { ComponentType } from "react";
  
    export interface ReactPlayerProps {
      url: string;
      playing?: boolean;
      loop?: boolean;
      controls?: boolean;
      volume?: number;
      muted?: boolean;
      width?: string | number;
      height?: string | number;
      style?: React.CSSProperties;
    }
  
    const ReactPlayer: ComponentType<ReactPlayerProps>;
    export default ReactPlayer;
  }
  
declare module '*.mp4' {
    const src: string;
    export default src;
  }
  