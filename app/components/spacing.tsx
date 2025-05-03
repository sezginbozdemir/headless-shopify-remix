type SpacingProps = {
  direction?: "vertical" | "horizontal";
  size?: number;
};

export function Spacing({ direction = "vertical", size = 4 }: SpacingProps) {
  const style =
    direction === "vertical"
      ? { height: `${size}rem`, width: "100%" }
      : { width: `${size}rem`, height: "100%" };

  return <div style={style} />;
}
