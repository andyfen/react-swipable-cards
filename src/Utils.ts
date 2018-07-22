export function isTouch(e: React.TouchEvent | React.MouseEvent): e is React.TouchEvent {
  return e.nativeEvent instanceof TouchEvent;
}