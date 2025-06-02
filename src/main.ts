import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars, faBook, faBookmark, faBookOpen, faBrush, faCaretLeft, faCaretRight, faCircleExclamation, faCloud, faDeleteLeft, faEllipsis, faGear, faHouse, faImage, faKeyboard, faMagnifyingGlassMinus, faMagnifyingGlassPlus, faPaintRoller, faPalette, faPen, faPenToSquare, faPlay, faPlus, faRotateLeft, faStar, faTrash, faTriangleExclamation, faTurnDown } from '@fortawesome/free-solid-svg-icons'
import { faBookmark as farBookmark, faKeyboard as farKeyboard} from '@fortawesome/free-regular-svg-icons'

import App from './views/App.vue'
import LibraryView from './views/LibraryView.vue'
import ThemesView from './views/ThemesView.vue'
import SettingsView from './views/SettingsView.vue'

import '@/style.css'


// Font-Awesome Icon definitions
library.add(
    // Menu navigation
    faHouse,
    faBars,
    faCaretLeft,
    faCaretRight,
    faMagnifyingGlassPlus,
    faMagnifyingGlassMinus,
    faBookmark,
    farBookmark,

    // Typing view
    faKeyboard,
    farKeyboard,
    faTurnDown,

    // Library view
    faBookOpen,
    faPlus,
    faBook,
    faEllipsis,

    // Settings view
    faTriangleExclamation,
    faTrash,
    faGear,

    // Themes view
    faPalette,
    faRotateLeft,

    faPlay,
    faImage,
    faCloud,
    faDeleteLeft,
    faPen,
    faPenToSquare,
    faCircleExclamation,
    faStar,
    faBrush,
    faPaintRoller,
)

const routes = [
    { path: '/', component: LibraryView },
    { path: '/themes', component: ThemesView },
    { path: '/settings', component: SettingsView },
]

const router = createRouter({
    history: createWebHistory('/'),
    routes,
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
