import React from "react";
import PropTypes from "prop-types";

const STATUS = {
  start: "start",
  progress: "progress",
  idle: "idle"
};

const LIFECYCLE = {
  componentWillLeave: "componentWillLeave",
  componentWillEnter: "componentWillEnter",
  componentDidLeave: "componentDidLeave",
  componentDidEnter: "componentDidEnter"
};

const styles = {
  wrapper: {
    height: "100%",
    width: "100%",
    position: "relative",
    top: 0,
    left: 0,
    overflow: "hidden"
  }
};
export default class TransitionReplace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: React.Children.only(props.children),
      next: null
    };
    this.curretElementFN = elm => (this.curretElement = elm);
    this.nextElementFN = elm => (this.nextElement = elm);
    this.currentSwitchFN = elm => (this.currentSwitch = elm);
    this.nextSwitchFN = elm => (this.nextSwitch = elm);
    this._transitionStatus = STATUS.idle;
  }

  componentWillReceiveProps(nextProps) {
    const next = React.Children.only(nextProps.children);
    const current = React.Children.only(this.props.children);
    if (next !== null && next.key !== current.key) {
      this._transitionStatus = STATUS.start;
      this.setState({
        next,
        current
      });
    }
  }

  shouldComponentUpdate() {
    return (
      this._transitionStatus === STATUS.start ||
      this._transitionStatus === STATUS.progress
    );
  }

  componentDidUpdate() {
    if (this._transitionStatus === STATUS.start) {
      this._transitionStatus = STATUS.progress;

      typeof this.currentSwitch._onlifeCycle === "function" &&
        this.currentSwitch._onlifeCycle(LIFECYCLE.componentWillLeave);
      typeof this.nextSwitch._onlifeCycle === "function" &&
        this.nextSwitch._onlifeCycle(LIFECYCLE.componentWillEnter);

      const dir =
        typeof this.nextSwitch._getDir === "function"
          ? this.nextSwitch._getDir()
          : 1;
      this.curretElement.setAttribute("data-dir", dir);
      this.nextElement.setAttribute("data-dir", dir);

      this.curretElement.setAttribute("data-transition", "start");
      this.nextElement.setAttribute("data-transition", "start");

      this._callEvents("onLeaving", this.currentSwitch, this.curretElement);
      this._callEvents("onEntering", this.nextSwitch, this.nextElement);

      this.nextElement.scrollTop;

      this.curretElement.className = this.curretElement.className.replace(
        "leave-from",
        "leave-to"
      );
      this.nextElement.className = this.nextElement.className.replace(
        "enter-from",
        "enter-to"
      );

      let transitionTobeCompleted = {
        componentDidLeave: STATUS.progress,
        componentDidEnter: STATUS.progress
      };
      const resolve = typeTransition => {
        delete transitionTobeCompleted[typeTransition];
        if (Object.keys(transitionTobeCompleted).length === 0) {
          this.setState(
            {
              current: this.state.next,
              next: null
            },
            () => {
              this._transitionStatus = STATUS.idle;
            }
          );
        }
      };

      const fnDidLeave = this._transitionFN(
        this.currentSwitch,
        LIFECYCLE.componentDidLeave,
        resolve,
        this.curretElement
      );

      this.curretElement.addEventListener("transitionend", fnDidLeave, false);

      const fnDidEnter = this._transitionFN(
        this.nextSwitch,
        LIFECYCLE.componentDidEnter,
        resolve,
        this.nextElement
      );
      this.nextElement.addEventListener("transitionend", fnDidEnter, false);
    }
  }

  _callEvents(eventName, typeSwitch, nodeElement) {
    if (typeof typeSwitch._getRef === "function") {
      this.props[eventName](typeSwitch._getRef() || nodeElement); // it returns the nodeElement if the ref is a functional component
    } else {
      this.props[eventName](nodeElement);
    }
  }

  _transitionFN(switchElm, lifecycle, resolve, element) {
    const fn = event => {
      event.preventDefault();
      if (element === event.target) {
        element.setAttribute("data-transition", "end");
        typeof switchElm._onlifeCycle === "function" &&
          switchElm._onlifeCycle(lifecycle);
        if (lifecycle === LIFECYCLE.componentDidLeave)
          this._callEvents("onLeave", switchElm, element);
        if (lifecycle === LIFECYCLE.componentDidEnter)
          this._callEvents("onEnter", switchElm, element);
        event.target.removeEventListener("transitionend", fn, false);
        resolve(lifecycle);
      }
    };
    return fn;
  }

  render() {
    const { current, next } = this.state;
    const className =
      this.currentSwitch && this.currentSwitch._getClassName
        ? this.currentSwitch._getClassName() || this.props.className
        : this.props.className;
    const classNameCurrent =
      next === null ? className : `${className} ${className}-leave-from`;
    const style = this.props.classNameWrapper
      ? { ...this.props.style }
      : { ...styles.wrapper, ...this.props.style };
    return (
      <div className={this.props.classNameWrapper} style={style}>
        <span
          key={current.key}
          ref={this.curretElementFN}
          className={classNameCurrent}
        >
          {React.cloneElement(current, { ref: this.currentSwitchFN })}
        </span>
        {next !== null && (
          <span
            key={next.key}
            ref={this.nextElementFN}
            className={`${className} ${className}-enter-from`}
          >
            {React.cloneElement(next, { ref: this.nextSwitchFN })}
          </span>
        )}
      </div>
    );
  }
}

TransitionReplace.defaultProps = {
  onEntering() {},
  onLeaving() {},
  onEnter() {},
  onLeave() {}
};

TransitionReplace.propTypes = {
  className: PropTypes.string,
  classNameWrapper: PropTypes.string,
  children: PropTypes.element,
  style: PropTypes.object,
  onEntering: PropTypes.func,
  onLeaving: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func
};
