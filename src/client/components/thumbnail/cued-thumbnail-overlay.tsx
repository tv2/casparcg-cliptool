import React from "react";
import ThumbnailOverlay from "./thumbnail-overlay/thumbnail-overlay";

interface CuedThumbnailOverlayProps {
  classNames?: string
}

export default function CuedThumbnailOverlay(props: CuedThumbnailOverlayProps): JSX.Element {
  return (
    <ThumbnailOverlay classNames={`cued ${props.classNames ?? ''}`}>
      CUED     
    </ThumbnailOverlay>
  )
}