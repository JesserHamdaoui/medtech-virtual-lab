export class Emitter<T = void> {
  private listeners: Set<(value: T) => void> = new Set();

  emit(value: T) {
    this.listeners.forEach((listener) => listener(value));
  }

  addListener(callback: (value: T) => void) {
    this.listeners.add(callback);
  }

  removeListener(callback: (value: T) => void) {
    this.listeners.delete(callback);
  }

  clearListeners() {
    this.listeners.clear();
  }
}
