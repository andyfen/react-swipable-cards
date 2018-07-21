import { IAppState } from "./AppProvider";

export function setStorage(key: string, value: IAppState) {
  if (key && typeof value !== "undefined") {
    window.localStorage[key] = JSON.stringify(value);
  }
}

export function getStorage(key: string) {
  const value = window.localStorage[key];

  return value ? JSON.parse(value) : undefined;
}