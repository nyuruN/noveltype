<script setup lang="ts">
import Typer from '@/components/Typer.vue'
import Menu from '@/components/Menu.vue'
import Toc from '@/components/Toc.vue';
import { storeToRefs } from 'pinia';
import { useTypingStore } from '@/stores/typing';
import { computed, type CSSProperties } from 'vue';

const { isFocused } = storeToRefs(useTypingStore())

let mouseSampleTimeout = setTimeout(() => { })
// i don't know why but the ts compiler keeps thinking this is unused
// i know this is a last resort but i just can't be bothered
mouseSampleTimeout;
let mouseLastX = 0;
let mouseLastY = 0;
let mouseThrottle = false;
document.addEventListener('mousemove', async (event: Event) => {
	if (!mouseThrottle) {
		mouseThrottle = true
		mouseSampleTimeout = setTimeout(() => mouseThrottle = false, 100)

		let e = event as MouseEvent
		let dst = Math.sqrt(Math.pow(mouseLastX - e.clientX, 2) + Math.pow(mouseLastY - e.clientY, 2))

		if (dst > 75) {
			if (isFocused.value) {
				isFocused.value = false
			}
		}

		mouseLastX = e.clientX
		mouseLastY = e.clientY
	}
})

// CSSProperties needed to infer scrollbarWidth as string literals
const hideScrollbarStyle = computed<CSSProperties>(() => ({
	scrollbarWidth: isFocused.value ? 'none' : 'thin',
	// TODO: Find a better way to compensate for missing scrollbar width
	paddingRight: isFocused.value ? '10px' : '0'
}));
</script>

<template>
	<div id="typer-root" class="relative">
		<Menu style="position: absolute; top: 3rem; left: 50%; transform: translate(-50%);"
			:style="{ opacity: isFocused ? '0%' : '100%' }" />
		<Toc />
		<main id="typer-wrapper" :style="hideScrollbarStyle">
			<div id="typer-container">
				<Typer style="margin: 12rem 0;" />
			</div>
		</main>
	</div>
</template>

<style>
#typer-container {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 1.5rem;
}

#typer-container>* {
	width: 80rem;
	max-width: 90%;
}

#typer-wrapper {
	height: 100%;
	overflow-y: scroll;
	overflow-x: clip;
	scrollbar-width: thin;

	mask-image: linear-gradient(transparent 0%,
			black 20%,
			black 80%,
			transparent 100%);
	-webkit-mask-image: linear-gradient(transparent 0%,
			black 20%,
			black 80%,
			transparent 100%);
}

#typer-root {
	height: 100%;
	overflow: hidden;
	background-color: var(--typing-bg);
}
</style>
