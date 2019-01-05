const withProps = props => {
    return fn => {
        const newFn = function() {
            Object.defineProperties(this, Object.getOwnPropertyDescriptors(new fn()));
            if (typeof props === "function") {
                const newProps = props(this);
                Object.defineProperties(this, Object.getOwnPropertyDescriptors(newProps));
            } else {
                Object.defineProperties(this, Object.getOwnPropertyDescriptors(props));
            }
        };

        // Make sure to pass static props as well.
        Object.assign(newFn, fn);

        return newFn;
    };
};

export default withProps;
