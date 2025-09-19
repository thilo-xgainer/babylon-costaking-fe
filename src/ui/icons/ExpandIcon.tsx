import { SVGProps } from 'react'

export const ExpandIcon = (props: SVGProps<SVGElement>) => {
  return (
    <svg
      className={props.className}
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.3125 5.6875L11.375 1.625" stroke={props.stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.66699 1.625H11.3753V4.33333" stroke={props.stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M11.375 7.58333V10.2917C11.375 10.579 11.2609 10.8545 11.0577 11.0577C10.8545 11.2609 10.579 11.375 10.2917 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V2.70833C1.625 2.42102 1.73914 2.14547 1.9423 1.9423C2.14547 1.73914 2.42102 1.625 2.70833 1.625H5.41667"
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
