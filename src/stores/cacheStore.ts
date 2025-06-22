import * as THREE from "three"
import { defineStore } from "pinia";
import { useLibraryStore } from "./library";
import db from "@/lib/db";
import { useAnimatedStore } from "./animated";
import { ShaderToy } from "@/lib/shadertoy";
import SHADERS from "@/lib/shaders";

export const useCacheStore = defineStore('cache', {
    state: () => ({
        bookCovers: new Map<string, string>(),
        shaderCovers: new Map<string, string>()
    }),
    actions: {
        loadBookCovers() {
            for (const book of useLibraryStore().books) {
                db.loadCover(book.filename).then((coverImage) => {
                    if (coverImage) {
                        const url = URL.createObjectURL(coverImage)
                        this.bookCovers.set(book.filename, url)
                    }
                })
            }
        },
        loadShaderCovers() {
            // Draw on canvas
            const canvas = new OffscreenCanvas(400, 400);
            const renderer = new THREE.WebGLRenderer({
                canvas: canvas
            })

            useAnimatedStore().uniforms.iTime.value = 0
            useAnimatedStore().uniforms.iResolution.value = new THREE.Vector3(400, 400, 0)
            for (const shader of SHADERS) {
                const shaderToy = new ShaderToy(shader)
                shaderToy.render(renderer)

                // Convert to Blob/URL
                canvas.convertToBlob({
                    type: 'image/webp',
                    quality: 0.8,
                }).then(blob => {
                    const url = URL.createObjectURL(blob)
                    this.shaderCovers.set(shader.name, url)
                })
            }
        }
    }
})
