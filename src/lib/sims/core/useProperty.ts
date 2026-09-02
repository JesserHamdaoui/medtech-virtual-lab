import { useSyncExternalStore } from "react";
import { Property } from "./Property";

export function useProperty<T>(property: Property<T>): T {
  return useSyncExternalStore(
    (callback) => property.lazyLink(callback),
    () => property.value,
    () => property.value,
  );
}
