import React, { Component } from "react";
import PropTypes from "prop-types";

let idSwitch = -1;
export default class Switch extends Component {
  static create(id) {
    const newID = id ? id : ++idSwitch;
    return {
      key: 0,
      id: newID,
      dir: 0
    };
  }

  static getKey() {
    const keys = [...arguments].reduce(
      (total, { key }) => total.concat(key),
      []
    );
    return keys.join(".");
  }

  constructor(props) {
    super(props);
    this._length = React.Children.toArray(props.children).length;
    this._refComponentFN = component => (this._refComponent = component);
    this._updateTags();
    this._history = {
      push: this._push.bind(this), // it goes to a specified child by passing a Number index position or a String tag important: tag must be specified
      goForward: this._goForward.bind(this), // it goes one step forward
      goBack: this._goBack.bind(this) // it goes one step backward
    };
  }

  componentDidMount() {
    this.props.onHistory(this._history);
    this.props.onEnter(this._refComponent);
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.switchState.key !== this.props.switchState.key ||
      nextProps.children !== this.props.children
    );
  }

  componentWillUnmount() {
    this._callback && this._callback(this._refComponent); // in case of stateless functional component this._refComponent will be undefined
    this.props.onLeave(this._refComponent);
  }

  // it goes to a specified child by passing a Number index position or a String tag
  // important: tag must be specified as props
  _push(key, callback) {
    if (typeof key === "string") {
      this._pushToTag(key, callback);
    } else if (typeof key === "number") {
      this._pushToID(key, callback);
    } else {
      console.error("Must be a number or a string");
    }
  }

  _pushToTag(tag, callback) {
    if (typeof this._childrenTags[tag] !== "undefined") {
      this._pushToID(this._childrenTags[tag], callback);
    } else {
      console.error("Tag does not exist: " + tag);
    }
  }

  _pushToID(key, callback) {
    if (key >= 0 && key < this._length) {
      const dir = this.props.switchState.key - key < 0 ? 1 : -1;
      this._onSwitchChange(key, dir, callback);
    } else {
      console.error("VALUE OUT OF RANGE");
    }
  }

  _goBack(callback) {
    const newPos = this.props.switchState.key - 1;
    const key = newPos >= 0 ? newPos : this._length - 1;
    this._onSwitchChange(key, 1, callback);
  }

  _goForward(callback) {
    const newPos = this.props.switchState.key + 1;
    const key = newPos < this._length ? newPos : 0;
    this._onSwitchChange(key, 1, callback);
  }

  _onSwitchChange(key, dir, callback) {
    this._callback = callback;
    this.props.onChange({ ...this.props.switchState, key, dir });
  }

  _onlifeCycle(lifeCycleMethod) {
    if (!this._refComponent || this._refComponent === null) return; // it prevents stateless functional component issues
    if (this._refComponent._onlifeCycle) {
      this._refComponent._onlifeCycle(lifeCycleMethod);
    } else {
      const ref =
        typeof this._refComponent.getWrappedInstance === "function"
          ? this._refComponent.getWrappedInstance()
          : this._refComponent;
      ref[lifeCycleMethod] && ref[lifeCycleMethod]();
    }
  }

  _getRef() {
    return this._isSwitchComponent() &&
      typeof this._refComponent._getRef === "function"
      ? this._refComponent._getRef()
      : this._refComponent;
  }

  _getDir() {
    return this._isSwitchComponent()
      ? this._refComponent._getDir()
      : this.props.switchState.dir;
  }

  _getClassName() {
    return this._isSwitchComponent()
      ? this._refComponent._getClassName() || this.props.className
      : this.props.className;
  }

  _isSwitchComponent() {
    return (
      this._refComponent &&
      this._refComponent !== null &&
      this._refComponent instanceof Switch
    );
  }

  _updateTags() {
    this._childrenTags = {};
    React.Children.forEach(this.props.children, (element, idx) => {
      if (element.props.tag) this._childrenTags[element.props.tag] = idx;
    });
  }

  _isStateless(Component) {
    return typeof Component !== "string" && !Component.type.prototype.render;
  }

  render() {
    const { switchState, children } = this.props;
    const element = React.Children.toArray(children)[switchState.key];

    if (React.isValidElement(element)) {
      if (this._isStateless(element)) {
        return element;
      } else {
        return React.cloneElement(element, {
          ref: this._refComponentFN,
          history: { ...this._history }
        });
      }
    }

    return null;
  }
}

Switch.defaultProps = {
  onHistory() {},
  onChange() {},
  onEnter() {},
  onLeave() {}
};

Switch.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  onHistory: PropTypes.func,
  className: PropTypes.string,
  switchState: PropTypes.object.isRequired
};
