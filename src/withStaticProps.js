const withStaticProps = (props: Function | Object) => {
    return (baseFn: Function) => {
        if (!baseFn) {
            baseFn = function() {
                this.construct();
            };
        }

        Object.assign(baseFn, typeof props === "function" ? props(baseFn) : props);
        return baseFn;
    };
};

export default withStaticProps;
