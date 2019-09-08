import { compose } from "ramda";
import { withProps, withStaticProps } from "repropose";

test("\"this\" / \"instance\" references test 1", async () => {
    const Model = compose(
        withProps({
            a: 1,
            b: 2
        }),
        withProps(() => ({
            c: 3,
            d: {
                a: 4
            }
        })),
        withProps({
            e: 5,
            f: {},
            g: {} // Override with number.
        })
    )();

    const model1 = new Model();
    const model2 = new Model();

    model1.a = 11;
    model1.b = 22;
    model1.c = 33;
    model1.d.a = 44;
    model1.e = 55;
    model1.f.a = 66;
    model1.g = 77;

    model2.a = 111;
    model2.b = 222;
    model2.c = 333;
    model2.d.a = 444;
    model2.e = 555;
    model2.f.a = 666;
    model2.g = 777;

    expect(model1.a).toBe(11);
    expect(model1.b).toBe(22);
    expect(model1.c).toBe(33);
    expect(model1.d.a).toBe(44);
    expect(model1.e).toBe(55);
    expect(model1.f.a).toBe(666); // <== watch out for this one.
    expect(model1.g).toBe(77);

    expect(model2.a).toBe(111);
    expect(model2.b).toBe(222);
    expect(model2.c).toBe(333);
    expect(model2.d.a).toBe(444);
    expect(model2.e).toBe(555);
    expect(model2.f.a).toBe(666);
    expect(model2.g).toBe(777);
});

test("\"this\" / \"instance\" references test 2", async () => {
    const Model = compose(
        withProps(instance => {
            return {
                object: { ...instance.object, number: 30 },
                number: 10
            };
        }),
        withProps(instance => ({
            getObject() {
                return this.object;
            },
            object: {
                number: 1
            },
            number: 3,
            numbersX2() {
                return [
                    instance.number * 2,
                    instance.object.number * 2,
                    this.getObject().number * 2,
                    instance.getObject().number * 2
                ];
            }
        }))
    )();

    const model = new Model();

    expect(model.number).toBe(10);
    expect(model.numbersX2()).toEqual([20, 60, 60, 60]);

    expect(Object.keys(model)).toEqual(["getObject", "object", "number", "numbersX2"]);

    model.object.number = 10;
    model.number = 30;

    expect(model.number).toBe(30);
    expect(model.getObject().number).toBe(10);
    expect(model.object.number).toBe(10);

    model.getObject().number = 30;
    expect(model.getObject().number).toBe(30);
    expect(model.object.number).toBe(30);
});

test("\"this\" / \"instance\" references test 3", async () => {
    const Model = compose(
        withProps({
            fields: { number: { value: 5 } }
        }),
        withProps(instance => ({
            fields: {},
            getField(name) {
                return this.fields[name];
            },
            numbersX3: () => {
                return [instance.fields.number.value, instance.getField("number").value];
            },
            numbersX3Function() {
                return [
                    instance.fields.number.value,
                    instance.getField("number").value,
                    this.getField("number").value * 3
                ];
            }
        }))
    )();

    const model = new Model();

    expect(model.numbersX3()).toEqual([5, 5]);
    expect(model.numbersX3Function()).toEqual([5, 5, 15]);
});

test("object are carried by reference, even when instantiating :/", async () => {
    // This means once you assign an object via withProps to a key,
    // it will be 'static' or in other words, every instance will carry
    // a reference to it. If you change a value in one of the instances,
    // all instances will see the change. Might be good in some cases, but
    // in others not.

    const Model = compose(
        withProps({
            someObject: { someKey: { someOtherKey: "value" } }
        })
    )();

    const model1 = new Model();
    const model2 = new Model();

    expect(model1.someObject).toEqual({ someKey: { someOtherKey: "value" } });
    expect(model2.someObject).toEqual({ someKey: { someOtherKey: "value" } });

    model1.someObject.someKey = { itIsNow: "empty" };

    expect(model1.someObject).toEqual({ someKey: { itIsNow: "empty" } });
    expect(model2.someObject).toEqual({ someKey: { itIsNow: "empty" } });

    model1.someObject.someKey = 123;
    expect(model1.someObject).toEqual({ someKey: 123 });
    expect(model2.someObject).toEqual({ someKey: 123 });
});

test("objects are carried by reference - use functions to avoid if necessary", async () => {
    const ModelA = compose(
        withProps(() => ({
            someObject: {
                someKey: {
                    someOtherKey: "value"
                }
            }
        }))
    )();

    const ModelB = compose(
        withProps(() => ({
            someObject2: {
                someKey2: {
                    someOtherKey2: "value2"
                }
            }
        }))
    )(ModelA);

    const modelA1 = new ModelA();
    const modelA2 = new ModelA();

    const modelB1 = new ModelB();
    const modelB2 = new ModelB();

    // Ensure A1 / A2 are not related.
    expect(modelA1.someObject).toEqual({ someKey: { someOtherKey: "value" } });
    expect(modelA2.someObject).toEqual({ someKey: { someOtherKey: "value" } });

    modelA1.someObject.someKey = { itIsNow: "empty" };

    expect(modelA1.someObject).toEqual({ someKey: { itIsNow: "empty" } });
    expect(modelA2.someObject).toEqual({ someKey: { someOtherKey: "value" } });

    modelA1.someObject.someKey = 123;
    expect(modelA1.someObject).toEqual({ someKey: 123 });
    expect(modelA2.someObject).toEqual({ someKey: { someOtherKey: "value" } });

    // Okay, now let's ensure B1 / B2 are not related to A1 / A2.
    expect(modelB1.someObject).toEqual({ someKey: { someOtherKey: "value" } });
    expect(modelB2.someObject).toEqual({ someKey: { someOtherKey: "value" } });

    modelB1.someObject.someKey = { itIsNow: "empty" };

    expect(modelB1.someObject).toEqual({ someKey: { itIsNow: "empty" } });
    expect(modelB2.someObject).toEqual({ someKey: { someOtherKey: "value" } });

    modelB1.someObject.someKey = 123;
    expect(modelB1.someObject).toEqual({ someKey: 123 });
    expect(modelB2.someObject).toEqual({ someKey: { someOtherKey: "value" } });

    // Make sure nothing happened to A1 / A2.
    expect(modelA1.someObject).toEqual({ someKey: 123 });
    expect(modelA2.someObject).toEqual({ someKey: { someOtherKey: "value" } });
});

test("withStaticProps - object references are preserved", async () => {
    const Model = compose(
        withStaticProps({
            object: {
                nested: null
            }
        })
    )(function() {});

    const model1 = new Model();
    const model2 = new Model();

    model1.constructor.object.nested = 123;
    expect(model1.constructor.object.nested).toBe(123);
    expect(model2.constructor.object.nested).toBe(123);
});

test("withStaticProps - functional object references are preserved", async () => {
    const Model = compose(
        withStaticProps(() => ({
            object: {
                nested: null
            }
        }))
    )(function() {});

    const model1 = new Model();
    const model2 = new Model();

    model1.constructor.object.nested = 123;
    expect(model1.constructor.object.nested).toBe(123);
    expect(model2.constructor.object.nested).toBe(123);
});

test("withStaticProps - composed props references are preserved", async () => {
    const BaseModel = compose(
        withStaticProps(() => ({
            object: {
                nested: null
            }
        }))
    )();

    const ModelA = compose(
        withProps({
            getNested() {
                return this.constructor.object.nested;
            }
        })
    )(BaseModel);

    const ModelB = compose(
        withProps({
            getNested() {
                return this.constructor.object.nested;
            }
        })
    )(BaseModel);

    ModelA.object.nested = "works";

    const modelA = new ModelA();
    const modelB = new ModelB();

    expect(modelA.constructor.object.nested).toBe("works");
    expect(modelB.constructor.object.nested).toBe("works");
    expect(modelA.getNested()).toBe("works");
    expect(modelB.getNested()).toBe("works");

    expect(ModelA.object.nested).toBe("works");
    expect(ModelB.object.nested).toBe("works");
});
