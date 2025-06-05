import { defineStore } from "pinia"
import { onMounted, ref } from "vue"

/**
 * Has to be called at least once for initial layout to load
 */
export const useWindowStore = defineStore('window', () => {
    let changed = ref(false)
    let pos = ref({ x: 0, y: 0, })
    let size = ref({ x: 600, y: 400, })

    function $reset() {
        pos.value = { x: 0, y: 0, }
        size.value = { x: 600, y: 400, }
    }
    function applyLayout() {
        let app = document.getElementById('app-window') as HTMLElement
        
        app.style['top'] = `${pos.value.y}px`
        app.style['left'] = `${pos.value.x}px`
        app.style['width'] = `${size.value.x}px`
        app.style['height'] = `${size.value.y}px`
    }

    onMounted(() => {
        if (changed.value) {
            applyLayout()
        } else {
            let app = document.getElementById('app-window') as HTMLElement
            pos.value = { x: app.offsetLeft, y: app.offsetTop }
            size.value = { x: app.clientWidth, y: app.clientHeight }
            applyLayout()
        }
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