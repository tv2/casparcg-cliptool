import React from "react";
import ThumbnailOverlay from "./thumbnail-overlay/thumbnail-overlay";

interface LoadedThumbnailOverlayProps {
  classNames?: string
}

export default function LoadedThumbnailOverlay(props: LoadedThumbnailOverlayProps): JSX.Element {
  return (
    <ThumbnailOverlay classNames={`loaded ${props.classNames ?? ''}`}>
      LOADED     
    </ThumbnailOverlay>
  )
}