import { useState } from "react";

export function useFormObject(initialState) {
  const [state, setState] = useState(initialState);

  const updateField = (key, value) => {
    setState(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return [state, updateField];
}
