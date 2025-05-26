<script setup lang="ts">
import Typer from '@/components/Typer.vue'
import Menu from '@/components/Menu.vue'
import { storeToRefs } from 'pinia';
import { useTypingStore } from '@/stores/typing';

const { isFocused } = storeToRefs(useTypingStore())

let mouseSampleTimeout = setTimeout(() => { })
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
</script>

<template>
	<div id="typer-container"
		:style="{ scrollbarWidth: isFocused ? 'none' : 'thin', paddingRight: isFocused ? '10px' : '0' }">
		<Menu style="margin-top: 3rem; margin-bottom: 2rem;" :style="{ opacity: isFocused ? '0%' : '100%' }" />
		<Typer />
		<div style="min-height: 6rem"></div>
	</div>
</template>

<style>
#typer-container {
	display: flex;
	height: 100%;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 1.5rem;

	overflow-y: scroll;
	overflow-x: clip;
	/* scrollbar-width: thin; */
	background-color: var(--typing-bg);
}

#typer-container>* {
	width: 80rem;
	max-width: 90%;
}
</style>
