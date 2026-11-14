const locks = new WeakMap();

// Nested dialogs may unmount together; restoring each previous value can leave
// the page permanently locked when their cleanup order differs from open order.
export function lockScroll(element) {
  let state = locks.get(element);
  if (!state) {
    state = { count: 0, previous: element.style.overflow };
    locks.set(element, state);
  }
  state.count += 1;
  element.style.overflow = 'hidden';
  let released = false;
  return () => {
    if (released) return;
    released = true;
    state.count -= 1;
    if (state.count === 0) {
      element.style.overflow = state.previous;
      locks.delete(element);
    }
  };
}
