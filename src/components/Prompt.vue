<script setup lang="ts">

export interface UserPrompt {
    resolveFn: (val: boolean) => void
    title: string
    text: string
    /**
     * Swaps button color
     */
    invert?: boolean
}

const props = defineProps<{ prompt: UserPrompt }>()

</script>

<template>
    <div class="prompt-bg">
        <div class="prompt">
            <div style="padding: 0.3rem;">
                <div style="margin: 0; font-weight: bold; font-size: x-large;">{{ props.prompt.title }}</div>
                <div style="margin: 0.5rem 0 0.5rem 0.2rem;">{{ props.prompt.text }}</div>
            </div>
            <div class="prompt-buttons" v-if="props.prompt.invert">
                <div class="prompt-button n" @click="props.prompt.resolveFn(true)">Ok</div>
                <div class="prompt-button y" @click="props.prompt.resolveFn(false)">Cancel</div>
            </div>
            <div class="prompt-buttons" v-else>
                <div class="prompt-button y" @click="props.prompt.resolveFn(true)">Ok</div>
                <div class="prompt-button n" @click="props.prompt.resolveFn(false)">Cancel</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.y {
    background-color: #62b85f;
}

.y:hover {
    background-color: #69c066;
}

.n {
    background-color: #b95e4d;
}

.n:hover {
    background-color: #d66c59;
}

.prompt-button {
    flex-grow: 1;
    padding: 0.3em 0;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
}

.prompt-buttons {
    display: flex;
    gap: 0.3rem;
}

.prompt {
    display: flex;
    flex-direction: column;
    padding: 0.3rem;
    min-height: 10%;
    min-width: 40%;
    background-color: #3b3b3b;
    border-radius: 8px;
}

.prompt-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #3b3b3b6c;

    display: flex;
    align-items: center;
    justify-content: center;
}
</style>