import { SVGProps } from 'react';
const FilterIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
        {...props}
    >
        <path
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={0.3}
            strokeWidth={1.5}
            d="M6.125 3.5h5.688m-5.688 0a.875.875 0 1 1-1.75 0m1.75 0a.875.875 0 1 0-1.75 0m-2.188 0h2.188m1.75 7h5.688m-5.688 0a.875.875 0 0 1-1.75 0m1.75 0a.875.875 0 0 0-1.75 0m-2.188 0h2.188M9.625 7h2.188M9.624 7a.875.875 0 1 1-1.75 0m1.75 0a.875.875 0 1 0-1.75 0M2.187 7h5.688"
        />
    </svg>
);
export default FilterIcon;
