
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
The package exposes two higher order functions: `withProps` and `withStaticProps`. Use them to create new functions with additional function ("static") and instance props. 

In the following examples, to make the code more readable, we utilize the `compose` function from 
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
// All instances of Car function will be comprised of all "Vehicle" 
// function props and "doorsCount", "seatsCount" and "speed" props.
const Car = compose(
  withProps({
    doorsCount: 0,
    seatsCount: 0,
    speed: 100
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

## Defining functions

Props can also be functions: 

```javascript
const Car = compose(
  withProps({
    speed: 0,
    nitroSpeedMultiplier: 2,
    getSpeedWithNitro() {
      return this.speed * this.nitroSpeedMultiplier;
    }
  })
)(Vehicle);

const car = new Car();
car.speed = 100;

console.log(car.speed); // 100
console.log(car.getSpeedWithNitro()); // 200
```

Note: don't use arrow functions if the function is working with `this` like in the above example, since it won't hold the correct object reference.

## The motivation

This library is based on the following premise: [composition over inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance). 

There are a few problems with inheritance:

### 
The main problem is that it forces you to define your classes in advance, which almost certainly will result in structural inneficiencies / refactors in the future.

### "banana-gorilla-jungle" problem
Sometimes you need to extend a class just to be able to access a single method. But often by extending the class, you don't receive the single method, but a whole set of methods and properties you won't even need for your particular task. This is also known as "banana-gorilla-jungle " problem, because instead of wanting a banana, you also get a gorilla which brings a whole jungle with it 🙃

### Cannot extend multiple classes 
When working with classes, you cannot easily extend 2 classes (at least not in JavaScript). On the other hand, with composition, you can easily combine several functions into one, and apply needed functionality by doing that.

Some of the following sources can be considered as sources of inspiration:

- https://www.youtube.com/watch?v=wfMtDGfHWpA
- https://medium.com/humans-create-software/composition-over-inheritance-cb6f88070205 (transcript of above video)
- https://tylermcginnis.com/javascript-inheritance-vs-composition/

The library is heavily utilized in the [Commodo - composeable models](https://github.com/doitadrian/commodo) library.

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
