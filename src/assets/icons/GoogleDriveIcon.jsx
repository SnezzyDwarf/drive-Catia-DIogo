export default function GoogleDriveIcon({ size = 24, className }) {
  return (
    <div>
      <svg
        viewBox="0 0 15 15"
        width={size}
        height={size}
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M5 1.5L0.5 9.5L2.5 13.5M5 1.5L7.5 5.5L2.5 13.5M5 1.5H10L14.5 9.5M5 1.5L10 9.5H14.5M2.5 13.5L5 9.5H14.5M2.5 13.5H12.5L14.5 9.5"
            stroke="currentColor"
            stroke-linejoin="round"
          ></path>{" "}
        </g>
      </svg>
    </div>
  );
}
