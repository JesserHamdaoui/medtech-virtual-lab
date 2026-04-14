type NumericRange = {
  min: number;
  max: number;
};

type PropertyOptions = {
  range?: NumericRange;
};

export class Property<T> {
  private _value: T;
  private readonly _defaultValue: T;
  private _range?: NumericRange;
  private listeners: Set<(value: T) => void> = new Set();

  constructor(initialValue: T, options: PropertyOptions = {}) {
    this._value = initialValue;
    this._defaultValue = initialValue;
    this._range = options.range;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (
      this._range &&
      typeof this._value === "number" &&
      typeof newValue === "number"
    ) {
      if (newValue < this._range.min || newValue > this._range.max) {
        return;
      }
    }

    this._value = newValue;
    this.notifyListeners();
  }

  get range(): NumericRange | undefined {
    return this._range;
  }

  set range(range: NumericRange | undefined) {
    this._range = range;

    if (!range) {
      return;
    }

    if (typeof this._value === "number") {
      const clampedValue = Math.min(Math.max(this._value, range.min), range.max);
      this._value = clampedValue as T;
      this.notifyListeners();
    }
  }

  link(callback: (value: T) => void) {
    this.listeners.add(callback);
    callback(this._value);
    return () => this.unlink(callback);
  }

  lazyLink(callback: (value: T) => void) {
    this.listeners.add(callback);
    return () => this.unlink(callback);
  }

  unlink(callback: (value: T) => void) {
    this.listeners.delete(callback);
  }

  reset() {
    this.value = this._defaultValue;
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this._value));
  }
}
