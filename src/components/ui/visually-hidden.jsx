import React from "react";

/**
 * A utility component to visually hide content while keeping it accessible to screen readers.
 */
const VisuallyHidden = ({ children }) => {
    return (
        <span
            style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: 0,
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: 0,
            }}
        >
            {children}
        </span>
    );
};

export default VisuallyHidden;
