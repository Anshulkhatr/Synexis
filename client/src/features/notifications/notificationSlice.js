import { createSlice } from '@reduxjs/toolkit'

// Load existing notifications from localStorage for persistence across refreshes
const loadFromStorage = () => {
    try {
        const stored = localStorage.getItem('synexis_notifications')
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

const saveToStorage = (notifications) => {
    try {
        localStorage.setItem('synexis_notifications', JSON.stringify(notifications))
    } catch {}
}

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: loadFromStorage(),
    },
    reducers: {
        addNotification: (state, action) => {
            const id = action.payload.id || Date.now().toString();
            const notif = {
                ...action.payload,
                id,
                time: new Date().toISOString(),
                read: false,
            }
            const existingIndex = state.items.findIndex(n => n.id === id);
            if (existingIndex !== -1) {
                state.items[existingIndex] = { ...state.items[existingIndex], ...notif };
            } else {
                state.items.unshift(notif) // newest first
            }
            // Keep max 20 notifications
            if (state.items.length > 20) state.items = state.items.slice(0, 20)
            saveToStorage(state.items)
        },
        markAllRead: (state) => {
            state.items = state.items.map(n => ({ ...n, read: true }))
            saveToStorage(state.items)
        },
        clearNotifications: (state) => {
            state.items = []
            saveToStorage([])
        }
    }
})

export const { addNotification, markAllRead, clearNotifications } = notificationSlice.actions
export default notificationSlice.reducer
