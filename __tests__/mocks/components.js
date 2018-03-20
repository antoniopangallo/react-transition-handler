/* eslint react/no-multi-comp: 0 */
/* eslint react/prop-types: 0 */
import React from "react";
export const FunctionalComponent = props => (
  <div className={props.className}>{props.content}</div>
);

export class ClassComponent extends React.Component {
  componentWillLeave() {}
  componentWillEnter() {}
  componentDidLeave() {}
  componentDidEnter() {}
  render() {
    return <div className={this.props.className}>{this.props.content}</div>;
  }
}
