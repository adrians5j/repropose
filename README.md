
# 🎲 repropose
[![Build Status](https://travis-ci.org/doitadrian/repropose.svg?branch=master)](https://travis-ci.org/doitadrian/repropose)
[![Coverage Status](https://coveralls.io/repos/github/doitadrian/repropose/badge.svg?branch=master)](https://coveralls.io/github/doitadrian/repropose?branch=master)
[![](https://img.shields.io/npm/dw/repropose.svg)](https://www.npmjs.com/package/repropose) 
[![](https://img.shields.io/npm/v/repropose.svg)](https://www.npmjs.com/package/repropose)
![](https://img.shields.io/npm/types/repropose.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
  
A set of [higher order functions](https://en.wikipedia.org/wiki/Higher-order_function)
that will, based on the given base function, create a new function decorated 
with additional function and instance properties ("props").

## Install
```
npm install --save repropose
```

Or if you prefer yarn: 
```
yarn add repropose
```

## Usage
The library exposes two higher order functions: `withProps` and `withStaticProps`. Use them to create a new function decorated with additional function and instance properties ("props").

In the following examples, to make the code more readable, we utilize the `compose` function from 
the popular [ramda](https://ramdajs.com/) library 
([lodash](https://lodash.com/) also offers this).

```javascript
import { compose } from "ramda";
import { withProps, withStaticProps } from "repropose";

const Vehicle = compose(
  withProps(() => ({
    size: "",
    color: "",
    weight: 0
  })),
  withStaticProps({
    type: "vehicle"
  })
)(function() {});

console.log(Vehicle.type); // "vehicle"

const vehicle = new Vehicle();
vehicle.size = "large";
vehicle.color = "red";

console.log(vehicle.size); // "large"
console.log(vehicle.color); // "red"
```

Both `withProps` and `withStaticProps` can accept an object that represents new to-be-assigned props or a function that returns it. The benefit of using a function is that it receives a reference to the new instance (`withProps`) and new function (`withStaticProps`) as first argument, which is useful when there's a need to check already assigned props on the previous / base function.

Note that functions created with shown HOFs are completely new functions, and are not linked in any way with the base functions.

## Composing functions

It's also possible to compose existing functions with a new set of props. Although this was basically already done in the previous example (base function was an empty function), a more practical example would be composing the existing `Vehicle` function with a new set of props, thus creating a new `Car` function:

```javascript
// All instances of Car function will be comprised of all "Vehicle" 
// function's props and "doorsCount", "seatsCount" and "speed" props.
const Car = compose(
  withProps({
    doorsCount: 0,
    seatsCount: 0,
    speed: 0
  })
)(Vehicle);

console.log(Vehicle.type); // "vehicle"
console.log(Car.type); // "car"

const car = new Car();
car.size = "large";
car.color = "red";
car.seatsCount = 5;

console.log(car.size); // "large"
console.log(car.color); // "red"
console.log(car.seatsCount); // 5
```

From here we can go even further, and define a few additional functions 
that could be comprised of all `Car` functions' properties and 
additional car-type-specific ones. Compose as many functions as needed.

## Functions as new props

Props can also be functions:

```javascript
const Car = compose(
  withProps({
    dorsOpenedCount: 0,
    openDoors(count) {
      this.dorsOpenedCount = count;
    }
    hasOpenedDoors() {
      return this.dorsOpenedCount > 0;
    }
  })
)(Vehicle);

const car = new Car();
console.log(car.hasOpenedDoors()); // false

car.openDoors(2);

console.log(car.dorsOpenedCount); // 2
console.log(car.hasOpenedDoors()); // true
```

Note: don't use arrow functions if the function is working with `this` like in the above example, since it won't hold the correct object reference.

## Custom HOFs
You can also create custom HOFs which you can selectively apply where needed. Consider the following example:

```javascript
// We extracted the Car props into a custom HOF.
const withCarProps = () => {
  return fn => {
    return compose(
      withProps({
        doorsCount: 0,
        seatsCount: 0,
        speed: 0,
        getSpeed() {
          return this.speed;
       }
      })
    )(fn)
  }
};

// Where needed, apply "withNitro" HOF to append a piece of 
// functionality to an existing function and its instances.
const withNitro = ({ nitroSpeedMultiplier }) => {
  return fn => {
    return compose(
      withProps({
        nitroEnabled: false,
        enableNitro() {
          this.nitroEnabled = true;
        },
        getSpeed() {
          if (this.nitroEnabled) {
            return this.speed * nitroSpeedMultiplier;
          }
          return this.speed;
        }
      })
    )(fn)
  }
};

const Car = compose(
  withNitro({ nitroSpeedMultiplier: 2.5 }),
  withCarProps()
)(Vehicle);

const car = new Car();
car.speed = 100;

console.log(car.getSpeed()); // 100

car.enableNitro();

console.log(car.nitroEnabled); // true
console.log(car.getSpeed()); // 250
```

You can use this idea to create a set of HOFs that are responsible for applying specific functionality and then compose them as necessary.

## The motivation

This library is based on the [composition over inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance) premise.

The main problem with the inheritance approach is that it forces you to define your classes / entities early in the project, which will, as new requests arrive, almost certainly result in structural inneficiencies / refactors in the future. [This video](https://www.youtube.com/watch?v=wfMtDGfHWpA) describes the pros and cons of both approaches very well, so I encourage you to check it out (thanks [MPJ](https://github.com/mpj)). 

🍌🦍🌴🙃

## Reference

#### `withProps(props: {[string]: any} | (newInstance : Object) => {[string]: any}): Function`
Creates a new function, whose instances are decorated with given props.

#### `withStaticProps(props: {[string]: any} | (newFunction : Function) => {[string]: any}): Function`
Creates a new function, with props assigned directly to it.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars0.githubusercontent.com/u/5121148?v=4" width="100px;"/><br /><sub><b>Adrian Smijulj</b></sub>](https://github.com/doitadrian)<br />[💻](https://github.com/doitadrian/repropose/commits?author=doitadrian "Code") [📖](https://github.com/doitadrian/repropose/commits?author=doitadrian "Documentation") [💡](#example-doitadrian "Examples") [👀](#review-doitadrian "Reviewed Pull Requests") [⚠️](https://github.com/doitadrian/repropose/commits?author=doitadrian "Tests") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
