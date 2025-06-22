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
    let fullscreen = ref(false)

    function $reset() {
        pos.value = { x: 0, y: 0, }
        size.value = { x: 600, y: 400, }
        collapse.value = false
    }
    function fromWindow() {
        if (fullscreen.value)
            return

        let app = document.getElementById('app-window') as HTMLElement
        pos.value = { x: app.offsetLeft, y: app.offsetTop }
        size.value = { x: app.clientWidth, y: app.clientHeight }
        collapse.value = size.value.x < window.innerWidth * 0.5;
    }
    function applyLayout() {
        let app = document.getElementById('app-window') as HTMLElement

        if (fullscreen.value) {
            app.style['top'] = `${0}%`
            app.style['left'] = `${0}%`
            app.style['width'] = `${100}%`
            app.style['height'] = `${100}%`
            return
        }

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
        applyLayout()

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
        fullscreen,
        // Functions
        $reset,
        applyLayout,
    }
}, {
    persist: true,
})