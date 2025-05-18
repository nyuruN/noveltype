import { createApp } from 'vue'
import App from './components/App.vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars, faBook, faBookmark, faBookOpen, faCaretLeft, faCaretRight, faFolderOpen, faTurnDown } from '@fortawesome/free-solid-svg-icons'

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
)

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
