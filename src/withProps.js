const withProps = props => {
    return baseFn => {
        if (!baseFn) {
            baseFn = function() {
                this.construct();
            };
        }

        if (!baseFn.__withProps) {
            baseFn.__withProps = [];
            baseFn.prototype.construct = function() {
                this.constructor.__withProps.forEach(propsToAssign => {
                    if (typeof propsToAssign === "function") {
                        Object.defineProperties(
                            this,
                            Object.getOwnPropertyDescriptors(propsToAssign(this))
                        );
                    } else {
                        Object.defineProperties(
                            this,
                            Object.getOwnPropertyDescriptors(propsToAssign)
                        );
                    }
                });
            };
        }

        baseFn.__withProps.push(props);

        return baseFn;
    };
};

export default withProps;
