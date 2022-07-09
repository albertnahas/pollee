import * as React from "react"
import { MedalProps } from "../Medal"
import "./../medal.css"

export const BlueMedal = ({ label, ...props }: MedalProps) => (
  <svg
    className="animated_badge_svg"
    viewBox="0 0 76 100"
    fill="none"
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="badge_ribbon"
      d="M16 86.7506V62C16 59.2386 18.2386 57 21 57H55C57.7614 57 60 59.2386 60 62V86.8112C60 88.7561 58.8722 90.5246 57.1087 91.3448L40.5616 99.0411C39.2517 99.6504 37.7424 99.6633 36.4223 99.0766L18.9693 91.3197C17.1637 90.5172 16 88.7266 16 86.7506Z"
      fill="#71A1F4"
    />
    <path
      className="badge_ribbon"
      d="M16 86.7506V62C16 59.2386 18.2386 57 21 57H55C57.7614 57 60 59.2386 60 62V86.8112C60 88.7561 58.8722 90.5246 57.1087 91.3448L40.5616 99.0411C39.2517 99.6504 37.7424 99.6633 36.4223 99.0766L18.9693 91.3197C17.1637 90.5172 16 88.7266 16 86.7506Z"
      fill="#71A1F4"
    />
    <path
      className="badge_ribbon"
      d="M16 86.7506V62C16 59.2386 18.2386 57 21 57H55C57.7614 57 60 59.2386 60 62V86.8112C60 88.7561 58.8722 90.5246 57.1087 91.3448L40.5616 99.0411C39.2517 99.6504 37.7424 99.6633 36.4223 99.0766L18.9693 91.3197C17.1637 90.5172 16 88.7266 16 86.7506Z"
      fill="url(#paint0_linear)"
    />
    <mask
      id="mask0"
      mask-type="alpha"
      maskUnits="userSpaceOnUse"
      x="16"
      y="57"
      width="44"
      height="43"
    >
      <path
        d="M16 86.7506V62C16 59.2386 18.2386 57 21 57H55C57.7614 57 60 59.2386 60 62V86.8112C60 88.7561 58.8722 90.5246 57.1087 91.3448L40.5616 99.0411C39.2517 99.6504 37.7424 99.6633 36.4223 99.0766L18.9693 91.3197C17.1637 90.5172 16 88.7266 16 86.7506Z"
        fill="#71A1F4"
      />
      <path
        d="M16 86.7506V62C16 59.2386 18.2386 57 21 57H55C57.7614 57 60 59.2386 60 62V86.8112C60 88.7561 58.8722 90.5246 57.1087 91.3448L40.5616 99.0411C39.2517 99.6504 37.7424 99.6633 36.4223 99.0766L18.9693 91.3197C17.1637 90.5172 16 88.7266 16 86.7506Z"
        fill="url(#paint1_linear)"
      />
    </mask>
    <g className="badge_ribbon" mask="url(#mask0)">
      <rect x="30" y="60" width="15" height="40" fill="#ABC7F9" />
    </g>
    <circle
      className="badge_circle"
      cx="37.5"
      cy="37.5"
      r="33.5"
      fill="#71A1F4"
      stroke="#CEDCF5"
      strokeWidth="8"
    />
    {!!label && (
      <text
        x="32"
        y="42"
        className="badge_number"
        style={{ fontSize: "1.3em" }}
        fill="white"
      >
        {label}
      </text>
    )}
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="38"
        y1="57"
        x2="38"
        y2="89.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#27539F" />
        <stop offset="1" stopColor="#71A1F4" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint1_linear"
        x1="38"
        y1="57"
        x2="38"
        y2="89.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#27539F" />
        <stop offset="1" stopColor="#71A1F4" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
)
