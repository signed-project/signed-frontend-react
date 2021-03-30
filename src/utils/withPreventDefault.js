/**
 * Wrap handler and call `preventDefault` method on `event`.
 */
export default (fn) => {
  return (event) => {
    event.preventDefault();
    fn();
  };
};
