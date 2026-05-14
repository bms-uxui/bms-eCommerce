export default function CrownIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g clipPath="url(#clip0_crown)">
        <path
          d="M6.33203 4.99992H9.16536C9.99379 4.99992 10.6654 5.67149 10.6654 6.49992C10.6654 7.32835 9.99379 7.99992 9.16536 7.99992H6.33203H9.4987C10.3271 7.99992 10.9987 8.67149 10.9987 9.49992C10.9987 10.3283 10.3271 10.9999 9.4987 10.9999H6.33203M6.33203 4.99992H5.33203M6.33203 4.99992V10.9999M6.33203 10.9999H5.33203M6.66536 3.99992V4.99992M6.66536 10.9999V11.9999M8.66536 3.99992V4.99992M8.66536 10.9999V11.9999M14.6654 7.99992C14.6654 11.6818 11.6806 14.6666 7.9987 14.6666C4.3168 14.6666 1.33203 11.6818 1.33203 7.99992C1.33203 4.31802 4.3168 1.33325 7.9987 1.33325C11.6806 1.33325 14.6654 4.31802 14.6654 7.99992Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_crown">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
