import { defineStore } from "pinia"
import { ref } from "vue"

/**
 * Has to be called at least once for initial theme to load
 */
export const useAnimatedStore = defineStore('animated', () => {
    let enabled = ref(false)

    function $reset() {
        enabled.value = false
    }

    return {
        // States
        enabled,
        // Functions
        $reset,
    }
}, {
    // persist: true
})