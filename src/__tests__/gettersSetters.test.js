import { compose } from "ramda";
import { withProps } from "repropose";

test("must be able to pass getters", async () => {
    const Model = compose(
        withProps(() => ({
            d: 4,
            e: 5,
            f: 6,
            get g() {
                return this.d + this.e + this.f;
            },
            set addToF(value) {
                this.f = this.f + value;
            }
        })),
        withProps(() => ({
            get h() {
                return this.g + 100;
            }
        }))
    )(function() {
        this.construct();
    });

    const model = new Model();
    expect(model.d).toBe(4);
    expect(model.e).toBe(5);
    expect(model.f).toBe(6);
    expect(model.g).toBe(15);
    expect(model.h).toBe(115);

    model.addToF = 10;
    model.addToF = 100;

    expect(model.f).toBe(116);
});
