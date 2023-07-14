import React from "react";

interface FileNameDisplayProps {
    fileName: string
    className? : string
}

export function FileNameDisplay(props: FileNameDisplayProps): JSX.Element{
    const slicedName = props.fileName
        .substring(props.fileName.lastIndexOf('/') + 1)
    
    return (
        <p className={props.className ?? ''}>
            {slicedName}
        </p>
    )
}