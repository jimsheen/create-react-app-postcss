export default class RenderHelper {
  constructor(initialProps, markup) {
    this.initialProps = initialProps;
    this.markup = markup;
  }

  render(newProps) {
    const props = {
      ...this.initialProps,
      ...newProps,
    }
    this.props = props;
    return this.markup(props);
  }

  getProps() {
    return this.props;
  }
}
