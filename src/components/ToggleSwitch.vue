<script setup lang="ts">
const props = defineProps<{
    accept?: ((newValue: boolean) => boolean) | ((newValue: boolean) => Promise<boolean>),
}>()

const model = defineModel()

async function toggle() {
    if (props.accept) {
        let acceptValue = await props.accept(!model.value)
        model.value = (acceptValue) ? !model.value : model.value
    } else {
        model.value = !model.value
    }
}
</script>

<template>
    <button class="toggle-switch" :class="{ enabled: model }" @click="toggle">
    </button>
</template>

<style lang="scss">
$toggleScale: 0.32;
$toggleWidth: 200px * $toggleScale;
$toggleHeight: 100px * $toggleScale;
$togglePadding: 5px * $toggleScale;

.toggle-switch {
    cursor: pointer;
    width: $toggleWidth;
    height: $toggleHeight;
    min-width: $toggleWidth * 0.6;
    background: var(--ui-toggle-bg);
    display: block;
    border: none;
    border-radius: $toggleHeight;
    position: relative;

    &:after {
        content: '';
        position: absolute;
        top: $togglePadding;
        left: $togglePadding;
        width: $toggleHeight - $togglePadding * 2;
        height: $toggleHeight - $togglePadding * 2;
        background: var(--ui-toggle-thumb);
        border-radius: $toggleHeight - $togglePadding * 2;
        transition: 0.3s;
    }

    &:active:after {
        width: $toggleHeight * 1.3;
    }
}

.enabled.toggle-switch {
    background-color: var(--ui-toggle-active);

    &:after {
        left: calc(100% - $togglePadding);
        transform: translateX(-100%);
    }
}
</style>