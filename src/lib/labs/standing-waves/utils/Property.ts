export class Property<T> {
  private _value: T;
  private _defaultValue: T;
  private _range?: { min: number; max: number };
  private listeners: ((value: T) => void)[] = [];

  constructor(
    initialValue: T,
    options: { range?: { min: number; max: number } } = {},
  ) {
    this._value = initialValue;
    this._defaultValue = initialValue;
    this._range = options.range;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (this._range && typeof newValue === "number") {
      const numValue = newValue as number;
      if (numValue < this._range.min || numValue > this._range.max) {
        console.warn(
          `Value ${numValue} outside range [${this._range.min}, ${this._range.max}]`,
        );
        return;
      }
    }
    this._value = newValue;
    this.notifyListeners();
  }

  set range(range: { min: number; max: number }) {
    this._range = range;
    // Validate current value against new range
    if (typeof this._value === "number") {
      const numValue = this._value as number;
      if (numValue < range.min || numValue > range.max) {
        const clampedValue = Math.min(Math.max(numValue, range.min), range.max);
        this._value = clampedValue as T;
        this.notifyListeners();
      }
    }
  }

  link(callback: (value: T) => void) {
    this.listeners.push(callback);
    callback(this._value); // Initial call
    return () => this.unlink(callback); // Return unlink function
  }

  lazyLink(callback: (value: T) => void) {
    this.listeners.push(callback);
    return () => this.unlink(callback);
  }

  unlink(callback: (value: T) => void) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  reset() {
    this.value = this._defaultValue;
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this._value));
  }
}
