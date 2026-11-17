import React, { useLayoutEffect, useRef } from "react";

export default function AutoGrowTextarea({ value, ...props }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const field = ref.current;
    if (!field) return;
    field.style.height = "auto";
    field.style.height = `${field.scrollHeight + 2}px`;
  }, [value]);
  return <textarea {...props} ref={ref} className={`auto-textarea ${props.className || ""}`.trim()} value={value} rows={1} />;
}
