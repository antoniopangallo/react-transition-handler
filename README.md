
# React Transition Handler
It is a tiny React library for managing transition between Components, Redux Connected Components or React-Router v4 made up by two add-on components:

- **TransitionReplace**
- **Switch**

Examples at [https://antoniopangallo.github.io/react-transition-handler/](https://antoniopangallo.github.io/react-transition-handler/).

## Installation

To install, you can use [npm](https://npmjs.org/):

    $ npm i react-transition-handler --save

## TransitionReplace
It is an add-on component for easily performing any type of transition when a react component is going to replace (enters or leaves the DOM) another.

*Transitions are fully configurable through CSS.*

#### Props

##### className: String
The class name of your transition. It may be even set directly into the Switch Component

##### classNameWrapper: String
If passed as prop it will be used instead of the default wrapper's inline style.

```html
<div style="height: 100%; width: 100%; position: relative; top: 0px; left: 0px; overflow: hidden;"> .... </div>
````

```html
<div class="classNameWrapper"> .... </div>
````

##### style: Object
If passed as prop it will override the default wrapper's inline style.

##### onEnter: Function(element: [Component, HtmlElement])
Callback fired as soon as the transition for the entering component has been completed.

##### onEntering:  Function(element: [Component, HtmlElement])
Callback fired as soon as the transition for the entering component is going to start.

##### onLeave: Function(element: [Component, HtmlElement])
Callback fired as soon as the transition for the leaving component has been completed.

##### onLeaving:  Function(element: [Component, HtmlElement])
Callback fired as soon as the transition for the leaving component is going to start.

> If you are using either React Router V4 or Functional Stateless Components, element's type will be HtmlElement for all the functions listed above

#### Low-level API: TransitionReplace
When a child is going to enter or leave a lifecycle hooks function is called on it.

```javascript
import React from "react";
export default class Child extends React.Component {
    componentWillLeave() {}
    componentWillEnter() {}
    componentDidLeave() {}
    componentDidEnter() {}

    render() {
        return <div />
    }
  }
```
> Lifecycle hooks described above as the `onEntering` - `onEnter` - `onExiting` and `onExit` functions are not available if you are using TransitionReplace to perform transitions either between Routes in React Router v4 or Stateless Functional Components

## Switch
Who is in charge to handle the replacement between components is the **Switch** add-on.
**Switch** is a controlled react component that by using the `history` object which it provides, allowes to decide which of its children must be rendered.

*By default the first child will be rendered.*

#### Props

##### onHistory: Function
Callback fired as soon the Switch component is mounted.

```javascript
this.onHistory = history => (this.history = history);
```
The `history` object provides 3 methods for moving across the Switch children.
```javascript
this.history.push(value: [String, Number], [callback]); 
// value must be either a numeric id of the child from 0 to N or a the tag String passed as prop to the child Component
this.history.goForward([callback]);
this.history.goBack([callback]);
```

The callback is an optional function that will be executed once either `push` - `goForward` or `goBack` is completed.

```javascript
this.history.push("child1", (child) => {
    console.log(child);
});
```

> **More about `history`**:
a `history` object instance will be passed as props to the children, so you can use the methods within the component

##### onChange: Function
Callback fired as soon as the Switch state is going to be changed due to an action performed by the Switch history object.

```javascript
this.onChange = switchState => this.setState({ switchState });
```

##### onEnter: Function
Callback fired as soon as a Switch component child is mounted.

```javascript
this.onEnter = component => { component.someFunction() };
```

##### onLeave: Function
Callback fired as soon as a Switch component child is unmounted.

```javascript
this.onLeave = component => { component.someFunction() };
```

##### switchState: Object
The state must be initialized by using the static `create` method provided by the Switch component

```javascript
const switchState = Switch.create(id: [String, Number]);
// or
const switchState = Switch.create();
```
> `switchState` object contains the Switch's state and it could be used for getting only read access on the Switch state.

##### className: String
The class name of your transition.

### Get Started - TransitionReplace

**Basic Usage**

```javascript
import React, { Component } from "react";
import { TransitionReplace, Switch } from "react-transition-handler";

const Child = props => <div className={props.className}>{props.content}</div>;

export default class GetStarted extends Component {
    constructor(props) {
        super(props);
        this.state = { switchState: Switch.create("switchState") };
        this.onChange = switchState => {
            this.setState({ switchState });
        };
        this.onHistory = history => (this.switchHistory = history);
    }
    
    componentDidMount() {
        // it renders the child whit tag="child3"
         this.switchHistory.push("child3", (child) => {
            // Run after child3 has completed the transition
            this.switchHistory.goForward();
        });
    }

    render() {
        const { switchState } = this.state;
        // In order to get the key you must use the getKey static method
        // provided by the Switch component
        const key = Switch.getKey(switchState);
        return (
           <TransitionReplace
            classNameWrapper="transition-replace"
            className="swap-transition">
                <Switch
                    switchState={switchState}
                    onChange={this.onChange}
                    onHistory={this.onHistory}
                    key={key}
                >
                    <Child className="child child1" tag="child1" content="content1" />
                    <Child className="child child2" tag="child2" content="content2" />
                    <Child className="child child3" tag="child3" content="content3" />
                </Switch>
            </TransitionReplace>
        );
    }
}
```
**CSS Transition BASIC**
```css
.transition-replace {
    position: relative;
    height: 300px;
    width: 300px;
    overflow: hidden;
}
.swap-transition {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    transition: transform 1s ease-in-out;
}

.swap-transition-leave-from, .swap-transition-enter-to {
    transform: translate3d(0, 0, 0);
}

.swap-transition-leave-to {
    transform: translate3d(-100%, 0, 0);
}

.swap-transition-enter-from {
    transform: translate3d(100%, 0, 0);
}

.child {
    height: 300px;
    width: 300px;
}
.child1 {
    background: red;
}
.child2 {
    background: white;
}
.child3 {
    background: blue;
}
```
> **CSS Name Convention**: 
as you can see in the example above a className prop `swap-transition` is passed to the TransitionReplace when a new child is about to enter it will get `swap-transition-enter-from` and `swap-transition-enter-to` CSS classes so you can use these classes to trigger a CSS transition for the entering component as you can do it for the leaving component `swap-transition-leave-from` and `swap-transition-leave-to`

##### Full convention

- `${className}-enter-from` - `${className}-leave-from`
- `${className}-enter-to` - `${className}-leave-to`
- `${className}-enter-to[data-transition="start"]` - Transition started
- `${className}-leave-to[data-transition="start"]` - Transition started
- `${className}-enter-to[data-transition="end"]` - Transition ended
- `${className}-leave-to[data-transition="end"]` - Transition ended

**Advanced Usage - Nested Switch**

```javascript
import React, { Component } from "react";
import { TransitionReplace, Switch } from "react-transition-handler";

const Child = props => <div className={props.className}>{props.content}</div>;

export default class GetStarted extends Component {
    constructor(props) {
        super(props);
        this.state = { switchState: Switch.create("switchState"), switchStateInner: Switch.create("switchStateInner") };
        this.onChange = switchState => {
            this.setState({ [switchState.id]: switchState });
        };
        this.onHistory = history => (this.switchHistory = history);
        this.onHistoryInner = history => (this.switchHistoryInner = history);
    }
    
    componentDidMount() {
        // it renders the child whit tag="child3"
         this.switchHistory.push("innerSwitch", (child) => {
            // Run after child3 has completed the transition
            this.switchHistoryInner.goForward();
        });
    }

    render() {
         const { switchState, switchStateInner } = this.state;
        // In order to get the key you must use the getKey static method
        // provided by the Switch component
        const key = Switch.getKey(switchState, switchStateInner);
        return (
           <TransitionReplace
            classNameWrapper="transition-replace"
            className="swap-transition">
                <Switch
                    switchState={switchState}
                    onChange={this.onChange}
                    onHistory={this.onHistory}
                    key={key}
                >
                    <Child className="child child1" tag="child1" content="content1" />
                    <Child className="child child2" tag="child2" content="content2" />
                    <Child className="child child3" tag="child3" content="content3" />
                    <Switch
                        tag="innerSwitch"
                        switchState={switchStateInner}
                        onChange={this.onChange}
                        onHistory={this.onHistoryInner}
                        key={key}
                    >
                        <Child className="child child1" tag="child1" content="innerContent1" />
                        <Child className="child child2" tag="child2" content="innerContent2" />
                    </Switch>
                </Switch>
            </TransitionReplace>
        );
    }
}
```

```CSS
.transition-replace {
    position: relative;
    height: 300px;
    width: 300px;
    overflow: hidden;
}

.swap-transition, .opacity-transition {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}

.swap-transition {
  transition: transform 1s ease-in-out;
}

.swap-transition-leave-from, .swap-transition-enter-to {
  transform: translate3d(0, 0, 0);
}

.swap-transition-leave-to {
  transform: translate3d(-100%, 0, 0);
}

.swap-transition-enter-from {
  transform: translate3d(100%, 0, 0);
}

.opacity-transition {
  transition: opacity 1s ease-in-out;
}

.opacity-transition-leave-from, .opacity-transition-enter-to {
  opacity: 1;
}

.opacity-transition-leave-to, .opacity-transition-enter-from {
  opacity: 0;
}

.child {
    height: 300px;
    width: 300px;
}
.child1 {
    background: red;
}
.child2 {
    background: white;
}
.child3 {
    background: blue;
}
```
**Advanced Usage - React Router v4**

```javascript
import React, { Component } from "react";
import { TransitionReplace } from "react-transition-handler";
import { Switch, Route } from 'react-router-dom';

const Home = props => <div>Home</div>;
const Page1 = props => <div>Page1</div>;

export default class GetStarted extends Component {
    render() {
        return (
            <Route render={({ location }) => (
                <TransitionReplace className="swap-transition">
                    <Switch key={location.pathname} location={location}>
                        <Route exact path='/' component={Home} />
                        <Route path='/page1' component={Page1} />
                    </Switch>
                </TransitionReplace>
                )} />
        );
    } 
}
```

## Browser Support

| ![IE / Edge](https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png) <br /> IE11 / Edge | ![Firefox](https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png) <br /> Firefox | ![Chrome](https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png) <br /> Chrome |
![Opera](https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png) <br /> Opera |
![Safari](https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png ) <br /> Safari | ![iOS Safari](https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari-ios.png) <br />iOS Safari | ![Chrome for Anroid](https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome-android.png) <br/> Chrome for Android |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- | 

## License

This software is free to use under the MIT license.
See the [LICENSE file](/LICENSE.md) for license text and copyright information.
