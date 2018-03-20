/* eslint react/no-multi-comp: 0 */
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });
import { Switch, TransitionReplace } from "../src/index";
import { FunctionalComponent, ClassComponent } from "./mocks/components";

describe("TransitionReplace", () => {
  let switchState = Switch.create("switchState");
  let key = Switch.getKey(switchState);
  let switchHistory;

  const props = {
    onChange: newSwitchState => (switchState = newSwitchState),
    className: "swap-transition",
    onHistory: history => (switchHistory = history)
  };

  const wrapper = mount(
    <TransitionReplace>
      <Switch key={key} {...props} switchState={switchState}>
        <FunctionalComponent className="child1" tag="child1" />
        <ClassComponent className="child2" tag="child2" />
        <ClassComponent className="child3" tag="child3" />
      </Switch>
    </TransitionReplace>
  );

  it("should render the first child", () => {
    expect(wrapper.contains(<div className="child1" />)).toBeTruthy();
  });

  it("should render the second child", () => {
    switchHistory.goForward();
    key = Switch.getKey(switchState);
    wrapper.setProps({
      children: (
        <Switch key={key} {...props} switchState={switchState}>
          <FunctionalComponent className="child1" tag="child1" />
          <ClassComponent className="child2" tag="child2" />
          <ClassComponent className="child3" tag="child3" />
        </Switch>
      )
    });
    expect(wrapper.contains(<div className="child2" />)).toBeTruthy();
  });

  it("should render the third child", () => {
    switchHistory.push("child3");
    key = Switch.getKey(switchState);
    wrapper.setProps({
      children: (
        <Switch key={key} {...props} switchState={switchState}>
          <FunctionalComponent className="child1" tag="child1" />
          <ClassComponent className="child2" tag="child2" />
          <ClassComponent className="child3" tag="child3" />
        </Switch>
      )
    });
    expect(wrapper.contains(<div className="child3" />)).toBeTruthy();
  });
});
