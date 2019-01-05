import { compose } from "ramda";
import { withProps } from "repropose";

test("\"withProps\" must assign instance properties", async () => {
    const Model = compose(
        withProps({
            a: 1,
            b: 2,
            c: 3
        })
    )(function() {});

    const model = new Model();

    expect(Object.keys(model)).toEqual(["a", "b", "c"]);
    expect(model.a).toBe(1);
    expect(model.b).toBe(2);
    expect(model.c).toBe(3);
});

test("\"withProps\" must also be able to receive a callback function and pass existing props as first argument", async () => {
    const Model = compose(
        withProps(() => {
            return {
                x: 1,
                y: 2,
                z: 3
            };
        })
    )(function() {});

    const model = new Model();

    expect(Object.keys(model)).toEqual(["x", "y", "z"]);
    expect(model.x).toBe(1);
    expect(model.y).toBe(2);
    expect(model.z).toBe(3);

    const ModelWithMultipleProps = compose(
        withProps(() => {
            return {
                ...{ a: 1, b: 2, c: 3 }
            };
        }),
        withProps(() => {
            return {
                ...{ j: 4, k: 5, l: 6 }
            };
        })
    )(function() {});

    const modelWithMultipleProps = new ModelWithMultipleProps();

    expect(Object.keys(modelWithMultipleProps)).toEqual(["j", "k", "l", "a", "b", "c"]);
    expect(modelWithMultipleProps.a).toBe(1);
    expect(modelWithMultipleProps.b).toBe(2);
    expect(modelWithMultipleProps.c).toBe(3);
    expect(modelWithMultipleProps.j).toBe(4);
    expect(modelWithMultipleProps.k).toBe(5);
    expect(modelWithMultipleProps.l).toBe(6);
});

test("when using \"withProps\", all previous and upcoming props must be accessible", async () => {
    // Just in case, let's quickly add a simple HOF
    const withSomething = () => {
        return compose(
            withProps(props => {
                return {
                    __list: {
                        something: "it is really something"
                    },
                    someMethod: () => {
                        return props.__list.something;
                    }
                };
            })
        );
    };

    const Model = compose(
        withProps(() => ({
            method1() {
                return 5;
            },
            method3() {
                return this.__list.something;
            },
            method4() {
                return this.someMethod();
            }
        })),
        withSomething(),
        withProps(() => ({
            async method2() {
                return (await this.method1()) + 5;
            }
        }))
    )(function() {});

    const model = new Model();

    expect(typeof model.method1 === "function").toBe(true);
    expect(typeof model.method2 === "function").toBe(true);
    expect(await model.method1()).toBe(5);
    expect(await model.method2()).toBe(10);

    expect(await model.someMethod()).toBe("it is really something");
    expect(await model.method3()).toBe(await model.someMethod());
    expect(await model.method4()).toBe(await model.someMethod());

    const { method1 } = model;
    expect(await method1()).toBe(5);

    // Following case abandoned -  we wanted to have "this", with which we could call props
    // assigned via other HOFs, but "this" changed depending on the call context.
    // Eg. below won't work, but if we called model.method2(), that would work, because
    // "this" is then properly set. As stated on a stack overflow topic:
    // > The "this" keyword refers to the calling context, not an object.

    // const { method2 } = model;
    // expect(await method2()).toBe(5);

    // P.S.: If method doesn't contain "this", then it can still be called.
});
