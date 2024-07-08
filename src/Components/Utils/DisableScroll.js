export function disableScroll(isDisabled) {
  if (isDisabled) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
}
