
# 🎲 repropose
[![Build Status](https://travis-ci.org/doitadrian/repropose.svg?branch=master)](https://travis-ci.org/doitadrian/repropose)
[![Coverage Status](https://coveralls.io/repos/github/doitadrian/repropose/badge.svg?branch=master)](https://coveralls.io/github/doitadrian/repropose?branch=master)
[![](https://img.shields.io/npm/dw/repropose.svg)](https://www.npmjs.com/package/repropose) 
[![](https://img.shields.io/npm/v/repropose.svg)](https://www.npmjs.com/package/repropose)
![](https://img.shields.io/npm/types/repropose.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
  
A pair of [higher order functions](https://en.wikipedia.org/wiki/Higher-order_function)
that, based on the given base function, create a new function decorated 
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
Use `withProps` and `withStaticProps` higher order functions 
to create a new function with additional function and instance props. 
To make the code easier to read, we utilize the `compose` function from 
the popular [ramda](https://ramdajs.com/) package 
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

Both `withProps` and `withStaticProps` can accept an object of new to-be-assigned props or a function that returns them. The benefit of using a function is that it receives a reference to the new instance (`withProps`) and new function (`withStaticProps`) as first argument, which is useful when there's a need to check already assigned props on the previous / base function.

## Composing functions

It's also possible to compose existing functions with a new set of props. Although this was basically already done in the previous example, a more practical example would be composing the existing `Vehicle` function with a new set of props, thus creating a new `Car` function:

```javascript
const Car = compose(
  withProps({
    doorsCount: 0,
    seatsCount: 0
  })
)(Vehicle);

console.log(Vehicle.type); // "car"
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
additional car-type-specific ones.

Note that functions created with shown HOFs are completely new functions, 
and are not linked in any way with the base functions.

## Defining methods

Previous examples showed defining properties 

## The motivation

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
