import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });
import { Switch } from "../src/index";
import { FunctionalComponent, ClassComponent } from "./mocks/components";

describe("Switch", () => {
  let switchState;

  const props = {
    switchState: Switch.create("switchState"),
    onChange: newSwitchState => (switchState = newSwitchState),
    className: "swap-transition"
  };
  const spyComponentDidEnter = jest.spyOn(
    ClassComponent.prototype,
    "componentDidEnter"
  );

  const wrapper = mount(
    <Switch {...props}>
      <FunctionalComponent className="child1" tag="child1" content="content1" />
      <FunctionalComponent className="child2" tag="child2" content="content2" />
      <ClassComponent className="child3" tag="child3" content="content3" />
    </Switch>
  );

  it("should render the first child", () => {
    expect(
      wrapper.contains(<div className="child1">content1</div>)
    ).toBeTruthy();
  });

  it("should render the second child", () => {
    wrapper.instance()._history.goForward();
    wrapper.setProps({ switchState });
    expect(
      wrapper.contains(<div className="child2">content2</div>)
    ).toBeTruthy();
  });

  it("should render the third child", () => {
    wrapper.instance()._history.push(2);
    wrapper.setProps({ switchState });

    expect(
      wrapper.contains(<div className="child3">content3</div>)
    ).toBeTruthy();
  });

  it("should goBack and render the second child", () => {
    wrapper.instance()._history.goBack();
    wrapper.setProps({ switchState });
    expect(
      wrapper.contains(<div className="child2">content2</div>)
    ).toBeTruthy();
  });

  it("should render the child with tag=child1", () => {
    wrapper.instance()._history.push("child1");
    wrapper.setProps({ switchState });
    expect(
      wrapper.contains(<div className="child1">content1</div>)
    ).toBeTruthy();
  });

  it("should return the switch's className", () => {
    const className = wrapper.instance()._getClassName();
    expect(className).toBe(wrapper.props().className);
  });

  it("should call the switch's _getDir method", () => {
    wrapper.instance()._history.push("child2");
    wrapper.setProps({ switchState });
    const dir = wrapper.instance()._getDir();
    expect(dir).toBe(1);
  });

  it("should call the lifecycle component", () => {
    wrapper.instance()._history.push(2);
    wrapper.setProps({ switchState });
    wrapper.instance()._onlifeCycle("componentDidEnter");
    expect(spyComponentDidEnter).toHaveBeenCalled();
  });
});
