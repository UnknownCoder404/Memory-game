import React from "react";
import { defaultProps, SpinnerProps } from "./helpers";
import { SpinnersProps, withSharedProps } from "./withSharedProps";

const coords = [
    { x: 22, y: -20 },
    { x: 29, y: 0 },
    { x: 22, y: 20 },
    { x: 0, y: 30 },
    { x: -23, y: 20 },
    { x: -30, y: 0 },
    { x: -23, y: -20 },
    { x: 0, y: -30 },
];

// Custom keyframe animations defined as classes
const spinnerDottedCenterKeyframes = `
@keyframes spinners-react-dotted-center {
    0%, 15%, 85%, 100% { transform: scale(0); }
    40%, 50% { transform: scale(1); }
    84% { transform: scale(0.45); }
}`;

const spinnerDottedShrinkKeyframes = `
@keyframes spinners-react-dotted-shrink {
    50% { transform: translate(0, 0); }
}`;

export type SpinnerDottedProps = SpinnersProps & SpinnerProps;

export function Component({
    speed = defaultProps.speed,
    still = defaultProps.still,
    thickness = defaultProps.thickness,
    ...svgProps
}: SpinnerDottedProps) {
    const duration = 200 / speed;

    const generateCircleStyle = (i: number) =>
        !still
            ? {
                  animationName: "spinners-react-dotted-shrink",
                  animationDuration: `${duration}s`,
                  animationTimingFunction: "cubic-bezier(0, 0.9, 0, 0.9)",
                  animationDelay: `${(duration / 20) * i}s`,
                  animationIterationCount: "infinite",
              }
            : {};

    const centerStyle = !still
        ? {
              animationName: "spinners-react-dotted-center",
              animationDuration: `${duration}s`,
              animationTimingFunction: "ease-out",
              animationIterationCount: "infinite",
              transformOrigin: "center",
          }
        : { display: "none" };

    return (
        <>
            {/* Inject keyframe styles */}
            <style>{spinnerDottedCenterKeyframes}</style>
            <style>{spinnerDottedShrinkKeyframes}</style>

            <svg className="fill-none" viewBox="0 0 66 66" {...svgProps}>
                {coords.map((c, i) => (
                    <circle
                        key={`${c.x}-${c.y}`}
                        cx="33"
                        cy="33"
                        className="fill-current"
                        r={3 * (thickness / 100)}
                        style={{
                            transform: `translate(${c.x}px, ${c.y}px)`,
                            ...generateCircleStyle(i),
                        }}
                    />
                ))}
                <circle
                    cx="33"
                    cy="33"
                    className="fill-current"
                    r={6 * (thickness / 100)}
                    style={centerStyle}
                />
            </svg>
        </>
    );
}

export const SpinnerDotted = withSharedProps(Component);

export default SpinnerDotted;
