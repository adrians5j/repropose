import { compose } from "ramda";
import { withProps, withStaticProps } from "repropose";

const withName = name => {
    return compose(
        withProps({
            getName() {
                return name;
            }
        }),
        withStaticProps({
            getName: () => name
        })
    );
};

test("\"withProps\" must work in conjunction with \"withStaticProps\"", async () => {
    const Model = compose(
        withProps({
            getInstanceName() {
                return this.constructor.getName();
            }
        }),
        withName("SomeModel"),
        withProps(() => ({
            d: 4,
            e: 5,
            f: 6
        })),
        withStaticProps({
            staticD: 4,
            staticE: 5,
            staticF: 6
        }),
        withProps(() => ({
            a: 1,
            b: 2,
            c: 3
        })),
        withStaticProps({
            staticA: 1,
            staticB: 2,
            staticC: 3
        })
    )(function() {});

    expect(Model.staticA).toBe(1);
    expect(Model.staticB).toBe(2);
    expect(Model.staticC).toBe(3);
    expect(Model.staticD).toBe(4);
    expect(Model.staticE).toBe(5);
    expect(Model.staticF).toBe(6);

    const model = new Model();

    expect(model.a).toBe(1);
    expect(model.b).toBe(2);
    expect(model.c).toBe(3);
    expect(model.d).toBe(4);
    expect(model.e).toBe(5);
    expect(model.f).toBe(6);

    expect(model.getInstanceName()).toBe("SomeModel");

    expect(Model.getName()).toBe("SomeModel");
    expect(model.getName()).toBe("SomeModel");
});
