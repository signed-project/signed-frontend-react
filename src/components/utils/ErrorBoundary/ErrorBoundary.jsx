import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    this.props.onError && this.props.onError(error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  onError: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default ErrorBoundary;
