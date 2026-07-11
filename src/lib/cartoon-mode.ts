import { useEffect, useState } from "react";

const KEY = "nonagon:cartoon-mode";

export function useCartoonMode(): [boolean, (v: boolean) => void, () => void] {
  const [on, setOn] = useState(false);

  useEffect(() => {
    try {
      setOn(localStorage.getItem(KEY) === "1");
    } catch {
      /* noop */
    }
  }, []);

  const set = (v: boolean) => {
    setOn(v);
    try {
      localStorage.setItem(KEY, v ? "1" : "0");
    } catch {
      /* noop */
    }
  };

  const toggle = () => set(!on);

  return [on, set, toggle];
}
