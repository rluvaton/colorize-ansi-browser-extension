
export const colorCodes = [
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "lightGray",
    "",
    "default",
];

export const colorCodesLight = [
    "darkGray",
    "lightRed",
    "lightGreen",
    "lightYellow",
    "lightBlue",
    "lightMagenta",
    "lightCyan",
    "white",
    "",
];

export const styleCodes = [
    "",
    "bright",
    "dim",
    "italic",
    "underline",
    "",
    "",
    "inverse",
];

export const asBright = {
    red: "lightRed",
    green: "lightGreen",
    yellow: "lightYellow",
    blue: "lightBlue",
    magenta: "lightMagenta",
    cyan: "lightCyan",
    black: "darkGray",
    lightGray: "white",
};

export const types = {
    0: "style",
    2: "unstyle",
    3: "color",
    9: "colorLight",
    4: "bgColor",
    10: "bgColorLight",
};

export const subtypes = {
    color: colorCodes,
    colorLight: colorCodesLight,
    bgColor: colorCodes,
    bgColorLight: colorCodesLight,
    style: styleCodes,
    unstyle: styleCodes,
};

export const RGB = {
    black: [0, 0, 0],
    darkGray: [100, 100, 100],
    lightGray: [200, 200, 200],
    white: [255, 255, 255],

    red: [204, 0, 0],
    lightRed: [255, 51, 0],

    green: [0, 204, 0],
    lightGreen: [51, 204, 51],

    yellow: [204, 102, 0],
    lightYellow: [255, 153, 51],

    blue: [0, 0, 255],
    lightBlue: [26, 140, 255],

    magenta: [204, 0, 204],
    lightMagenta: [255, 0, 255],

    cyan: [0, 153, 255],
    lightCyan: [0, 204, 255],
};
