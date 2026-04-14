export class Emitter<T = void> {
  private listeners: ((value: T) => void)[] = [];

  emit(value: T) {
    this.listeners.forEach((listener) => listener(value));
  }

  addListener(callback: (value: T) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (value: T) => void) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }
}
