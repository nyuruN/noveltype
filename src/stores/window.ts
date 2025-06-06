import { defineStore } from "pinia"
import { onMounted, ref, watch } from "vue"

/**
 * Has to be called at least once for initial layout to load
 */
export const useWindowStore = defineStore('window', () => {
    let changed = ref(false)
    let pos = ref({ x: 0, y: 0, })
    let size = ref({ x: 600, y: 400, })
    let collapse = ref(false)

    function $reset() {
        pos.value = { x: 0, y: 0, }
        size.value = { x: 600, y: 400, }
        collapse.value = false
    }
    function fromWindow() {
        let app = document.getElementById('app-window') as HTMLElement
        pos.value = { x: app.offsetLeft, y: app.offsetTop }
        size.value = { x: app.clientWidth, y: app.clientHeight }
        collapse.value = size.value.x < window.innerWidth * 0.5;
    }
    function applyLayout() {
        let app = document.getElementById('app-window') as HTMLElement

        collapse.value = size.value.x < window.innerWidth * 0.4;

        app.style['top'] = `${pos.value.y / window.innerHeight * 100}%`
        app.style['left'] = `${pos.value.x / window.innerWidth * 100}%`
        app.style['width'] = `${size.value.x / window.innerWidth * 100}%`
        app.style['height'] = `${size.value.y / window.innerHeight * 100}%`
    }

    watch(collapse, nc => {
        console.log('toggle');
        (document.getElementById('app-nav') as HTMLElement).setAttribute('data-collapse', nc ? 'true' : 'false')
    })

    let resizeTimeout = setTimeout(() => { })
    onMounted(() => {
        window.addEventListener('resize', _ => {
            clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(() => {
                fromWindow()
            }, 250)
        })

        if (!changed.value)
            fromWindow()

        applyLayout()
    })

    return {
        // States
        pos,
        size,
        // Functions
        $reset,
        applyLayout,
    }
}, {
    // persist: true,
})