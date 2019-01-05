import { compose } from "ramda";
import { withStaticProps, withProps } from "repropose";

test("\"withStaticProps\" must assign static properties", async () => {
    const Model = compose(
        withStaticProps({
            a: 1,
            b: 2,
            c: 3
        })
    )(function() {});

    expect(Object.keys(Model)).toEqual(["a", "b", "c"]);
    expect(Model.a).toBe(1);
    expect(Model.b).toBe(2);
    expect(Model.c).toBe(3);
});

test("\"withStaticProps\" must also be able to receive a callback function and pass existing props as first argument", async () => {
    const Model = compose(
        withStaticProps(() => {
            return {
                ...{ x: 1, y: 2, z: 3 }
            };
        })
    )(function() {});

    expect(Object.keys(Model)).toEqual(["x", "y", "z"]);
    expect(Model.x).toBe(1);
    expect(Model.y).toBe(2);
    expect(Model.z).toBe(3);

    const ModelWithMultipleProps = compose(
        withStaticProps(() => {
            return {
                ...{ a: 1, b: 2, c: 3 }
            };
        }),
        withStaticProps(() => {
            return {
                ...{ j: 4, k: 5, l: 6 }
            };
        })
    )(function() {});

    expect(ModelWithMultipleProps.a).toBe(1);
    expect(ModelWithMultipleProps.b).toBe(2);
    expect(ModelWithMultipleProps.c).toBe(3);
    expect(ModelWithMultipleProps.j).toBe(4);
    expect(ModelWithMultipleProps.k).toBe(5);
    expect(ModelWithMultipleProps.l).toBe(6);
});

test("\"withStaticProps\" - assigned static props must be accessible inside instance methods", async () => {
    const Model = compose(
        withStaticProps({
            getStaticName3: () => "Works 3!"
        }),
        withProps({
            getInstanceName2() {
                return this.constructor.getStaticName2();
            },
            getInstanceName3() {
                return this.constructor.getStaticName3();
            }
        }),
        withStaticProps({
            getStaticName2: () => "Works 2!"
        }),
        withProps({
            getInstanceName1() {
                return this.constructor.getStaticName1();
            }
        }),
        withStaticProps({
            getStaticName1: () => "Works 1!"
        })
    )(function() {});

    const model = new Model();

    expect(model.getInstanceName1()).toBe("Works 1!");
    expect(model.getInstanceName2()).toBe("Works 2!");
    expect(model.getInstanceName3()).toBe("Works 3!");
});
