<script setup lang="ts">
const model = defineModel<boolean>()

function dragenterHandler(_event: Event) {
    model.value = true
}
</script>

<template>
    <div @dragenter.prevent="dragenterHandler">
        <slot></slot>
    </div>
</template>