<script setup lang="ts">
import Dialog from './Typer.vue'
import Menu from './Menu.vue'
</script>

<template>
  <div id="container">
    <Menu />
    <Dialog />
    <div style="min-height: 6rem"></div>
  </div>
</template>

<style>
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  font-weight: normal;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #292929;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  margin: 0;
  scrollbar-width: thin;
  scroll-behavior: smooth;
  scrollbar-color: #757575 #ffffff00;
}

#app {
  width: 100%;
  height: 100%;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

#container {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

#container>* {
  width: 80rem;
  max-width: 85vw;
}
</style>
