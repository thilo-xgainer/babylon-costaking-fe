import React from 'react'

interface Props {
  color?: string
  size?: number
}

export const ClockIcon: React.FC<Props> = ({ color = 'fill-[#8DA5BF]', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size }}
    >
      <path
        className={`${color}`}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      />
      <path
        className={`${color}`}
        d="M12 7C11.4477 7 11 7.44772 11 8V13C11 13.5523 11.4477 14 12 14H16C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12H13V8C13 7.44772 12.5523 7 12 7Z"
      />
    </svg>
  )
}
