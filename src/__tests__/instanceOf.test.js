import { compose } from "ramda";
import { withProps, withStaticProps } from "repropose";

test("must be able to do checks with instanceOf", async () => {
    const Model1 = compose(
        withProps(() => ({
            a: 1,
            b: 2,
            c: 3
        })),
        withStaticProps({
            staticA: 1,
            staticB: 2,
            staticC: 3
        }),
        withProps(() => ({
            d: 4,
            e: 5,
            f: 6
        })),
        withStaticProps({
            staticD: 4,
            staticE: 5,
            staticF: 6
        })
    )(function() {});

    const model1 = new Model1();
    expect(model1 instanceof Model1).toBe(true);

    const Model2 = compose(
        withProps(() => ({
            g: 7,
            h: 8,
            i: 9
        })),
        withStaticProps({
            staticG: 7,
            staticH: 8,
            staticI: 9
        }),
        withProps(() => ({
            j: 10,
            k: 11,
            l: 12
        })),
        withStaticProps({
            staticJ: 10,
            staticK: 11,
            staticL: 12
        })
    )(Model1);

    const model2 = new Model2();
    expect(model2 instanceof Model2).toBe(true);

    const Model3 = compose(
        withStaticProps({
            staticM: 13,
            staticN: 14,
            staticO: 15
        }),
        withProps(() => ({
            m: 13,
            n: 14,
            o: 15
        })),
        withStaticProps({
            staticP: 17,
            staticQ: 18,
            staticR: 19
        }),
        withProps(() => ({
            p: 17,
            q: 18,
            r: 19
        })),
        withStaticProps({
            staticS: 20,
            staticT: 21,
            staticU: 22
        })
    )(Model2);

    const model3 = new Model3();
    expect(model3 instanceof Model3).toBe(true);

    const Model4 = compose(
        withProps(() => ({
            v: 23,
            w: 24,
            x: 25
        }))
    )(Model3);

    const model4 = new Model4();
    expect(model4 instanceof Model4).toBe(true);
    expect(model4 instanceof Model3).toBe(false);
    expect(model4 instanceof Model2).toBe(false);
    expect(model4 instanceof Model1).toBe(false);

    const Model5 = compose(
        withStaticProps({
            staticY: 26,
            staticZ: 27,
            staticEnd: 28
        })
    )(Model3);

    const model5 = new Model5();
    expect(model5 instanceof Model5).toBe(true);
    expect(model5 instanceof Model4).toBe(false);
    expect(model5 instanceof Model3).toBe(false);
    expect(model5 instanceof Model2).toBe(false);
    expect(model5 instanceof Model1).toBe(false);

    const Model6 = compose(
        withStaticProps({
            anotherStaticA: 1,
            anotherStaticB: 2,
            anotherStaticC: 3
        })
    )(Model2);

    const model6 = new Model6();
    expect(model6 instanceof Model6).toBe(true);
    expect(model6 instanceof Model5).toBe(false);
    expect(model6 instanceof Model4).toBe(false);
    expect(model6 instanceof Model3).toBe(false);
    expect(model6 instanceof Model2).toBe(false);
    expect(model6 instanceof Model1).toBe(false);
});
