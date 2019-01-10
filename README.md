
# 🎲 repropose
[![Build Status](https://travis-ci.org/doitadrian/repropose.svg?branch=master)](https://travis-ci.org/doitadrian/repropose)
[![Coverage Status](https://coveralls.io/repos/github/doitadrian/repropose/badge.svg?branch=master)](https://coveralls.io/github/doitadrian/repropose?branch=master)
[![](https://img.shields.io/npm/dw/repropose.svg)](https://www.npmjs.com/package/repropose) 
[![](https://img.shields.io/npm/v/repropose.svg)](https://www.npmjs.com/package/repropose)
![](https://img.shields.io/npm/types/repropose.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
  
A pair of higher order functions that create new functions with additional properties.

## Install
```
npm install --save repropose
```

Or if you prefer yarn: 
```
yarn add repropose
```

## Quick Example:
Use `withProps` and `withStaticProps` [higher order functions](https://en.wikipedia.org/wiki/Higher-order_function) to create a new function with additional instance and static props. To make the code easier to read, we utilize `compose` from popular [ramda]() package ([lodash](https://lodash.com/) also offers this).
```javascript
import { compose } from "ramda";
import { withProps, withStaticProps } from "repropose";

const Car = compose(
  withProps(() => ({
    size: "large",
    color: "red",
    weight: 2000
  })),
  withStaticProps({
    type: "car"
  })
)(function() {});

const car = new Car();
console.log(car.size); // "large"

console.log(Car.type); // "car"
```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars0.githubusercontent.com/u/5121148?v=4" width="100px;"/><br /><sub><b>Adrian Smijulj</b></sub>](https://github.com/doitadrian)<br />[💻](https://github.com/doitadrian/repropose/commits?author=doitadrian "Code") [📖](https://github.com/doitadrian/repropose/commits?author=doitadrian "Documentation") [💡](#example-doitadrian "Examples") [👀](#review-doitadrian "Reviewed Pull Requests") [⚠️](https://github.com/doitadrian/repropose/commits?author=doitadrian "Tests") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
