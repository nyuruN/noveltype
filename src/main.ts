import { createApp } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars, faBook, faBookmark, faBookOpen, faBrush, faCaretLeft, faCaretRight, faCircleExclamation, faCloud, faDeleteLeft, faEllipsis, faFolderOpen, faGear, faHouse, faImage, faKeyboard, faPaintRoller, faPalette, faPen, faPenToSquare, faPlay, faPlus, faStar, faTrash, faTriangleExclamation, faTurnDown } from '@fortawesome/free-solid-svg-icons'

import App from './views/App.vue'
import HomeView from './views/LibraryView.vue'
import SettingsView from './views/SettingsView.vue'

// Font-Awesome Icon definitions
library.add(
    faBars,
    faCaretLeft,
    faCaretRight,
    faBook,
    faBookmark,
    faBookOpen,
    faFolderOpen,
    faTurnDown,
    faGear,
    faHouse,
    faPlus,
    faPlay,
    faKeyboard,
    faEllipsis,
    faImage,
    faCloud,
    faTrash,
    faDeleteLeft,
    // Edit
    faPen,
    faPenToSquare,
    // Importance
    faCircleExclamation,
    faTriangleExclamation,
    faStar,
    // Theme
    faBrush,
    faPaintRoller,
    faPalette,


)

const routes = [
    { path: '/', component: HomeView },
    { path: '/settings', component: SettingsView },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
