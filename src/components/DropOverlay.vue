<script setup lang="ts">
const props = defineProps<{ fileDropped: (file: File) => void | Promise<void>, }>()
const model = defineModel<boolean>()

function dropHandler(event: Event) {
    model.value = false
    let ev = event as DragEvent;

    if (!ev.dataTransfer) return;

    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`file ${i}: ${file.name}`);
        props.fileDropped(file)
    });
}
</script>

<template>
    <div class="drop-zone absolute-fill" v-show="model" @dragleave.prevent="model = false" @dragover.prevent
        @drop.prevent="dropHandler">
        <div class="absolute-center" style="pointer-events: none;">
            <font-awesome-icon :icon="['fas', 'right-to-bracket']" fixed-width class="fa-rotate-90" />
        </div>
    </div>
</template>

<style scoped>
.drop-zone {
    /* Above .card-more */
    z-index: 2;
    font-size: 7rem;
    background-color: #00000099;
    outline: 8px dashed var(--text-dimmed);
    outline-offset: -2rem;
}
</style>