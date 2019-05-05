import { compose } from "ramda";
import { withProps } from "repropose";

test("must be able to pass getters", async () => {
    // We extracted the Car props into a custom HOF.
    const withCarProps = () => {
        return fn => {
            return compose(
                withProps({
                    doorsCount: 0,
                    seatsCount: 0,
                    speed: 0,
                    getSpeed() {
                        return this.speed;
                    }
                })
            )(fn);
        };
    };

    // Where needed, apply "withNitro" HOF to append a piece of
    // functionality to an existing function and its instances.
    const withNitro = ({ nitroSpeedMultiplier }) => {
        return fn => {
            return compose(
                withProps({
                    nitroEnabled: false,
                    enableNitro() {
                        this.nitroEnabled = true;
                    },
                    getSpeed() {
                        if (this.nitroEnabled) {
                            return this.speed * nitroSpeedMultiplier;
                        }
                        return this.speed;
                    }
                })
            )(fn);
        };
    };

    const Car = compose(
        withNitro({ nitroSpeedMultiplier: 2.5 }),
        withCarProps()
    )(function() {});

    const car = new Car();
    car.speed = 100;

    expect(car.getSpeed()).toBe(100);

    car.enableNitro();

    expect(car.nitroEnabled).toBe(true);
    expect(car.getSpeed()).toBe(250);
});
