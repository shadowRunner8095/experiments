export class ObserverWithState<T> {
  protected listeners = new Set<() => void>();
  protected value: T;

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  getValue(): T {
    return this.value;
  }

  unsubscribe(listener: () => void): void {
    this.listeners.delete(listener);
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    listener(); // Immediately notify with current state
    return () => {
      this.unsubscribe(listener);
    };
  }

  emit(updater: (prev: T) => T): void {
    this.value = updater(this.value);
    this.listeners.forEach(cb => cb());
  }
}

export class ChildObserver<C, P> extends ObserverWithState<C> {
  constructor(
    initialValue: C,
    private parent: ObserverWithState<P>,
    private onParentUpdate: (parentValue: P, childPrev: C) => C
  ) {
    super(initialValue);

    this.parent.subscribe(() => {

      super.emit((childPrev) => this.onParentUpdate(this.parent.getValue(), childPrev));
    });
  }

  emit(updater: (childPrev: C, parentValue: P) => C): void {
    const parentValue = this.parent.getValue();

    super.emit((childPrev) => updater(childPrev, parentValue));
  }
}
