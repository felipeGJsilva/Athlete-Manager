import { createApp } from 'vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import App from './App.vue'
import router from './router'

import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

const app = createApp(App)
app.use(Quasar, quasarUserOptions)
app.use(router)
// Global fetch wrapper: attach token and handle 401 -> redirect to login
const _fetch = window.fetch
window.fetch = async (input, init = {}) => {
	try {
		const token = localStorage.getItem('token')
		init.headers = init.headers || {}
		if (token) {
			if (init.headers instanceof Headers) init.headers.set('Authorization', 'Bearer ' + token)
			else init.headers['Authorization'] = 'Bearer ' + token
		}
		// Normalize requests: when running in the Vite dev server, use relative paths
		// so the Vite proxy (configured in vite.config.js) can forward them to backend.
		const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
		if (typeof input === 'string' && input.startsWith(API_URL)) {
			// convert to relative path so proxy works in remote dev environments
			const url = new URL(input)
			input = url.pathname + url.search
		}
		const res = await _fetch(input, init)
		if (res.status === 401) {
			// unauthenticated — navigate to login
			try { router.push('/login') } catch(e){}
		}
		return res
	} catch (e) {
		throw e
	}
}

app.mount('#app')
