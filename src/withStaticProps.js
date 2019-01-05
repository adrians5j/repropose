const withStaticProps = props => {
    return fn => {
        const newFn = function() {
            Object.defineProperties(this, Object.getOwnPropertyDescriptors(new fn()));
        };

        Object.assign(newFn, fn, typeof props === "function" ? props(newFn) : props);

        return newFn;
    };
};

export default withStaticProps;
