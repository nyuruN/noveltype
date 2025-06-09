import { defineStore } from "pinia"
import { Vector3, Vector4 } from "three";
import { ref } from "vue"

export interface Shader {
    name: string,
    author?: string,
    link?: string,
    src: string,
}

export const SHADERS = [
    {
        name: 'Default',
        author: 'iq',
        link: 'https://www.shadertoy.com/user/iq',
        src: `
        // By iq: https://www.shadertoy.com/user/iq
        // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
            // Normalized pixel coordinates (from 0 to 1)
            vec2 uv = fragCoord/iResolution.xy;
        
            // Time varying pixel color
            vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
            // col = vec3(step(0.5, length(uv - vec2(0.5))));
        
            // Output to screen
            fragColor = vec4(col,1.0);
        }
        `,
    },
    {
        name: 'Placeholder',
        src: `
        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
            // Normalized pixel coordinates (from 0 to 1)
            vec2 uv = fragCoord/iResolution.xy;
        
            float d = sin(length(uv) + iTime);
            vec3 col = vec3(uv, d);

            // Output to screen
            fragColor = vec4(col, 1.0);
        }
        `,
    },
] as Shader[];

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
    const currentShader = ref({ ...SHADERS[0] })

    function $reset() {
        enabled.value = false
        renderScale.value = 0.1;
        renderFps.value = 24;
        uniforms.value = {
            iMouse: { value: new Vector4(0) },
            iResolution: { value: new Vector3(0, 0, 0) },
            iTime: { value: 0 },
        }
        currentShader.value = { ...SHADERS[0] }
    }

    return {
        // States
        enabled,
        renderScale,
        renderFps,
        uniforms,
        currentShader,
        // Functions
        $reset,
    }
}, {
    // persist: true
})