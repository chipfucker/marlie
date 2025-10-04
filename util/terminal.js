import Color from "color";

export const code = {
	bold: "1",
	faint: "2",
	italic: "3",
	underline: "4",
	slowBlink: "5",
	rapidBlink: "6",
	invert: "7",
	hidden: "8",
	strike: "9",
	font: [ "11", "12", "13", "14", "15", "16", "17", "18", "19", "20" ],
	doubleUnderline: "21",
	spacing: "26",
	overline: "53",
	reset: {
		all: "0",
		font: "10",
		bold: "21",
		intensity: "22",
		italic: "23",
		underline: "24",
		blink: "25",
		invert: "27",
		hidden: "28",
		strike: "29",
		fgColor: "39",
		bgColor: "49",
		spacing: "50",
		overline: "55"
	},
	fgColor: {
		black: "30",
		red: "31",
		green: "32",
		yellow: "33",
		blue: "34",
		magenta: "35",
		cyan: "36",
		white: "37",
		brightBlack: "90",
		brightRed: "91",
		brightGreen: "92",
		brightYellow: "93",
		brightBlue: "94",
		brightMagenta: "95",
		brightCyan: "96",
		brightWhite: "97",
		custom: {
			eightbit: (...input) => {
				const code = "38;5;";
				if (!input) return code;
				if (input.length === 1) input = input[0];
				if (typeof input === "number")
					if (input >= 255) return code + input;
					else throw new Error(`${input} is too large; max integer is 255`);
				else {
					var color;
					try { color = Color(input).rgb().object(); }
					catch (e) { throw new Error(`"${input}" could not be parsed as color`); }
					const num = ( 16
						+ ( Math.round(color.r / 51) * 36 )
						+ ( Math.round(color.g / 51) *  6 )
						+ ( Math.round(color.b / 51) *  1 )
					);
					return code + num;
				}
			},
			twentyFourBit: (...input) => {
				const code = "38;2;";
				if (!input) return code;
				if (input.length === 1) input = input[0];
				if (typeof input === "number") {
					const colors = [
						input >> 16 & 0xFF, // red
						input >>  8 & 0xFF, // green
						input >>  0 & 0xFF  // blue
					];
					const num = colors.join(";");
					return code + num;
				} else {
					var color;
					try { color = Color(input).rgb().array(); }
					catch (e) { throw new Error(`"${input}" could not be parsed as color`); }
					const num = color.join(";");
					return code + num;
				}
			}
		}
	},
	bgColor: {
		black: "40",
		red: "41",
		green: "42",
		yellow: "43",
		blue: "44",
		magenta: "45",
		cyan: "46",
		white: "47",
		brightBlack: "100",
		gray: "100",
		brightRed: "101",
		brightGreen: "102",
		brightYellow: "103",
		brightBlue: "104",
		brightMagenta: "105",
		brightCyan: "106",
		brightWhite: "107",
		custom: {
			eightbit: (...input) => {
				const code = "48;5;";
				if (!input) return code;
				if (input.length === 1) input = input[0];
				if (typeof input === "number")
					if (input >= 255) return code + input;
					else throw new Error(`${input} is too large; max integer is 255`);
				else {
					var color;
					try { color = Color(input).rgb().object(); }
					catch (e) { throw new Error(`"${input}" could not be parsed as color`); }
					const num = ( 16
						+ ( Math.round(color.r / 51) * 36 )
						+ ( Math.round(color.g / 51) *  6 )
						+ ( Math.round(color.b / 51) *  1 )
					);
					return code + num;
				}
			},
			twentyFourBit: (...input) => {
				const code = "48;2;";
				if (!input) return code;
				if (input.length === 1) input = input[0];
				if (typeof input === "number") {
					const colors = [
						input >> 16 & 0xFF, // red
						input >>  8 & 0xFF, // green
						input >>  0 & 0xFF  // blue
					];
					const num = colors.join(";");
					return code + num;
				} else {
					var color;
					try { color = Color(input).rgb().array(); }
					catch (e) { throw new Error(`"${input}" could not be parsed as color`); }
					const num = color.join(";");
					return code + num;
				}
			}
		}
	}
};

export const escape = (...args) => `\x1b[${args.join(";")}m`;

const list = {
	refresh: {
		abbreviation: "RFS",
		style: [ code.bold, code.fgColor.brightRed ]
	},
	ready: {
		abbreviation: "RDY",
		style: [ code.bold, code.fgColor.brightRed ]
	},
	interaction: {
		abbreviation: "CMD",
		style: [ code.bold, code.fgColor.brightCyan ]
	},
	throw: {
		abbreviation: "THR",
		style: [ code.bold, code.fgColor.brightYellow ]
	}
};

const tagsExport = {};

for (const [name, value] of Object.entries(list))
	tagsExport[name] = {
		tag: escape(...value.style) + value.abbreviation                    + " \u250C" + escape(),
		sub: escape(...value.style) + " ".repeat(value.abbreviation.length) + " \u2502" + escape()
	};

export const tags = tagsExport;