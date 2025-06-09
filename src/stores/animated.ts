import { defineStore } from "pinia"
import { Vector3, Vector4 } from "three";
import { ref } from "vue"

/**
 * Has to be called at least once for initial theme to load
 */
export const useAnimatedStore = defineStore('animated', () => {
    const enabled = ref(false)
    const renderScale = ref(0.1);
    const renderFps = ref(24);
    const uniforms = ref({
        iMouse: { value: new Vector4(0) },
        iResolution: { value: new Vector3(0, 0, 0) },
        iTime: { value: 0 },
    })

    function $reset() {
        enabled.value = false
        renderScale.value = 0.1;
        renderFps.value = 24;
        uniforms.value = {
            iMouse: { value: new Vector4(0) },
            iResolution: { value: new Vector3(0, 0, 0) },
            iTime: { value: 0 },
        }
    }

    return {
        // States
        enabled,
        renderScale,
        renderFps,
        uniforms,
        // Functions
        $reset,
    }
}, {
    // persist: true
})