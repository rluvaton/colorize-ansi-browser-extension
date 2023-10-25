const {Code} = require("./code");
const {asBright, RGB} = require("./constants");

class Color {
    constructor(background, name, brightness) {
        this.background = background;
        this.name = name;
        this.brightness = brightness;
    }

    get inverse() {
        return new Color(
            !this.background,
            this.name || (this.background ? "black" : "white"),
            this.brightness
        );
    }

    get clean() {
        const name = this.name === "default" ? "" : this.name;
        const bright = this.brightness === Code.bright;
        const dim = this.brightness === Code.dim;

        if (!name && !bright && !dim) {
            return undefined;
        }

        return {
            name,
            bright,
            dim,
        }
    }

    defaultBrightness(value) {
        return new Color(this.background, this.name, this.brightness || value);
    }

    css(inverted) {
        const color = inverted ? {
            background: !this.background,
            name: this.name || (this.background ? "black" : "white"),
            brightness: this.brightness,
        } : {
            background: this.background,
            name: this.name,
            brightness: this.brightness,
        };

        // TODO - can improve the performance of this by splitting the css from all the ifs

        const rgbName =
            (color.brightness === Code.bright && asBright[color.name]) ||
            color.name;
        const rgb = RGB[rgbName];
        const prop = color.background ? "background:" : "color:";
        const alpha = this.brightness === Code.dim ? 0.5 : 1;

        return rgb
            ? prop + "rgba(" + [...rgb, alpha].join(",") + ");"
            : !color.background && alpha < 1
                ? "color:rgba(0,0,0,0.5);"
                : ""; // Chrome does not support 'opacity' property...
    }
}

module.exports = {Color};
