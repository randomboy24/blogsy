export function BlogsyLogo({ height }: { height: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 130 50"
      role="img"
      aria-label="Blogsy logo"
      style={{ width: "auto", height: `${height}px` }}
    >
      <text
        x="0"
        y="35"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="500"
        fontSize="36"
        fill="#333333"
      >
        Blogsy
      </text>
    </svg>
  );
}
