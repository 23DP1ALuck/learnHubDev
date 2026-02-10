import * as React from "react"
import { SVGProps } from "react"
const ChevronRight = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 6 10"
        {...props}
    >
        <path
            fill="#000"
            fillOpacity={0.3}
            fillRule="evenodd"
            d="M5.122 4.503c.17.171.17.448 0 .619L.747 9.497a.438.438 0 0 1-.619-.619l4.066-4.066L.128.747A.437.437 0 1 1 .747.128l4.375 4.375Z"
            clipRule="evenodd"
        />
    </svg>
)
export default ChevronRight;
