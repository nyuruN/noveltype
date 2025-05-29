
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
export function hslString(color: Color) {
    return `hsl(${color.h} ${color.s} ${color.l})`
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