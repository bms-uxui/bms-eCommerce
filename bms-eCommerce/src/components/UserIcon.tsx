export default function UserIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g clipPath="url(#user-clip)">
        <path d="M3.54289 12.9589C3.94844 12.0034 4.89531 11.3333 5.9987 11.3333H9.9987C11.1021 11.3333 12.0489 12.0034 12.4545 12.9589M10.6654 6.33325C10.6654 7.80601 9.47146 8.99992 7.9987 8.99992C6.52594 8.99992 5.33203 7.80601 5.33203 6.33325C5.33203 4.86049 6.52594 3.66659 7.9987 3.66659C9.47146 3.66659 10.6654 4.86049 10.6654 6.33325ZM14.6654 7.99992C14.6654 11.6818 11.6806 14.6666 7.9987 14.6666C4.3168 14.6666 1.33203 11.6818 1.33203 7.99992C1.33203 4.31802 4.3168 1.33325 7.9987 1.33325C11.6806 1.33325 14.6654 4.31802 14.6654 7.99992Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="user-clip">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
