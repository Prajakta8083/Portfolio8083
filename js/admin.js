/**
 * Admin Logic
 * Handles authentication and JSON content editing.
 */
import { DataLoader } from './services/DataLoader.js';

// --- Configuration ---
const ADMIN_PASSWORD_HASH = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'; // SHA-1 for 'test'
// In a real app, use a robust backend auth service. This is just an interface adapter.

const STORAGE_KEY_AUTH = 'portfolio_auth_token';
const DATA_FILES = {
    profile: 'profile.json',
    projects: 'projects.json',
    skills: 'skills.json',
    curiosity: 'curiosity.json'
};

// --- State ---
let currentTab = 'profile';
let editorContent = {};

// --- Elements ---
const loginOverlay = document.getElementById('login-overlay');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const editorTextarea = document.getElementById('json-editor');
const saveStatus = document.getElementById('save-status');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

// --- Auth Functions ---
async function checkAuth() {
    const token = localStorage.getItem(STORAGE_KEY_AUTH);
    if (token === ADMIN_PASSWORD_HASH) {
        showDashboard();
    } else {
        showLogin();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;

    // Simple hashing for client-side demo check (NOT SECURE for production without backend)
    const buffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex === ADMIN_PASSWORD_HASH) { // Password: test
        localStorage.setItem(STORAGE_KEY_AUTH, hashHex);
        showDashboard();
    } else {
        loginError.textContent = 'Invalid credentials.';
    }
}

function handleLogout() {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    location.reload();
}

function showLogin() {
    loginOverlay.classList.remove('hidden');
    adminDashboard.classList.add('hidden');
}

function showDashboard() {
    loginOverlay.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    loadTabContent('profile');
}

// --- Editor Functions ---
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('save-btn').addEventListener('click', saveContent);

    document.querySelectorAll('.admin-nav li').forEach(item => {
        item.addEventListener('click', (e) => {
            // Update UI
            document.querySelectorAll('.admin-nav li').forEach(li => li.classList.remove('active'));
            e.target.classList.add('active');

            // Switch Tab
            const tab = e.target.getAttribute('data-tab');
            currentTab = tab;
            loadTabContent(tab);
        });
    });
}

async function loadTabContent(tabName) {
    const filename = DATA_FILES[tabName];
    document.getElementById('current-section-title').textContent = `Edit ${tabName}`;
    editorTextarea.value = 'Loading...';

    try {
        // Try loading from LocalStorage first (simulating database persistence)
        const localData = localStorage.getItem(`db_${filename}`);

        if (localData) {
            editorContent = JSON.parse(localData);
        } else {
            // Fallback to initial file
            editorContent = await DataLoader.load(filename);
        }

        editorTextarea.value = JSON.stringify(editorContent, null, 2);
    } catch (error) {
        editorTextarea.value = `Error loading data: ${error.message}`;
    }
}

function saveContent() {
    try {
        const newContent = JSON.parse(editorTextarea.value);
        const filename = DATA_FILES[currentTab];

        // Save to LocalStorage (acting as DB)
        localStorage.setItem(`db_${filename}`, JSON.stringify(newContent));

        // Visual Feedback
        saveStatus.textContent = `Saved ${filename} at ${new Date().toLocaleTimeString()}! (Changes are local)`;
        saveStatus.style.color = 'var(--success)';

        setTimeout(() => {
            saveStatus.textContent = '';
        }, 3000);

    } catch (error) {
        saveStatus.textContent = 'Invalid JSON: ' + error.message;
        saveStatus.style.color = 'var(--error)';
    }
}
