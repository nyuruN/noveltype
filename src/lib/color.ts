import convert from "color-convert"

export interface Color {
    h: number,
    s: number,
    l: number,
}

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
}

export function hsl(h: number, s: number, l: number): Color {
    return { h, s, l, }
}

export function mix(lhs: Color, rhs: Color, factor: number) {
    return {
        h: lerp(lhs.h, rhs.h, factor),
        s: lerp(lhs.s, rhs.s, factor),
        l: lerp(lhs.l, rhs.l, factor),
    }
}
export function darken(color: Color, factor: number) {
    return {
        h: color.h,
        s: color.s,
        l: lerp(color.l, 0, factor),
    }
}
export function lighten(color: Color, factor: number) {
    return {
        h: color.h,
        s: color.s,
        l: lerp(color.l, 1, factor),
    }
}

export function hslString(col: Color) {
    return `hsl(${col.h} ${col.s} ${col.l})`
}

export function hslToHex(hsl: { h: number; s: number; l: number }): string {
    return '#' + convert.hsl.hex(hsl.h, hsl.s, hsl.l)
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
    let hsl = convert.hex.hsl(hex)
    return {
        h: hsl[0],
        s: hsl[1],
        l: hsl[2],
    }
}