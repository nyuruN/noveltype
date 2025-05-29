
export interface Color {
    h: number,
    s: number,
    l: number,
}

export function hsl(h: number, s: number, l: number): Color {
    return { h, s, l, }
}
export function hslString(color: Color) {
    return `hsl(${color.h} ${color.s} ${color.l})`
}