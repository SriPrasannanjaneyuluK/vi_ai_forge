import { useEffect, useState } from "react";

/** True when the primary input is mouse/trackpad (not touch). */
export function useFinePointer() {
  const [finePointer, setFinePointer] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(pointer: fine)").matches
      : true
  );

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return finePointer;
}
