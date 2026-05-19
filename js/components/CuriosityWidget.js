/**
 * CuriosityWidget
 * Client-side "AI" that mimics a curiosity engine using pre-defined knowledge.
 */

import { DataLoader } from '../services/DataLoader.js';

export class CuriosityWidget {
    constructor(rootId) {
        this.root = document.getElementById(rootId);
        this.isOpen = false;
        this.knowledge = [];
        this.context = {};
    }

    async init() {
        if (!this.root) return;

        // Load Knowledge Base
        try {
            const curiosityData = await DataLoader.load('curiosity.json');
            this.knowledge = curiosityData.entries || [];

            // Also load basic context
            this.context.profile = await DataLoader.load('profile.json');
        } catch (e) {
            console.warn('[Curiosity] Failed to load knowledge base', e);
        }

        this.render();
        this.attachEvents();
    }

    render() {
        this.root.innerHTML = `
            <div class="chat-window" id="ai-chat-window">
                <header class="chat-header">
                    <div class="chat-title">
                        <span class="status-dot"></span>
                        <span class="mono">Curiosity.exe</span>
                    </div>
                    <button class="chat-close" id="ai-close-btn">&times;</button>
                </header>
                <div class="chat-messages" id="ai-messages">
                    <div class="message bot">
                        Hello. I am the digital echo of Prajakta's curiosity. 
                        Ask me about her learning journey, or verify if she knows specific tech.
                    </div>
                </div>
                <div class="typing-indicator" id="ai-typing">Thinking...</div>
                <form class="chat-input-area" id="ai-form">
                    <input type="text" class="chat-input" placeholder="Ask a question..." required>
                    <button type="submit" class="chat-send">></button>
                </form>
            </div>
            
            <div class="ai-toggle-btn" id="ai-toggle-btn">
                 <svg class="ai-icon" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
            </div>
        `;
    }

    attachEvents() {
        const toggleBtn = document.getElementById('ai-toggle-btn');
        const closeBtn = document.getElementById('ai-close-btn');
        const windowEl = document.getElementById('ai-chat-window');
        const form = document.getElementById('ai-form');

        const toggle = () => {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                windowEl.classList.add('open');
            } else {
                windowEl.classList.remove('open');
            }
        };

        toggleBtn.addEventListener('click', toggle);
        closeBtn.addEventListener('click', toggle);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input');
            const query = input.value.trim();
            if (!query) return;

            this.addMessage(query, 'user');
            input.value = '';

            this.processQuery(query);
        });
    }

    addMessage(text, type) {
        const container = document.getElementById('ai-messages');
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.textContent = text; // TextContent prevents XSS
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    async processQuery(query) {
        const typing = document.getElementById('ai-typing');
        typing.style.display = 'block';

        // Simulate network delay for effect
        setTimeout(() => {
            typing.style.display = 'none';
            const answer = this.generateAnswer(query.toLowerCase());
            this.addMessage(answer, 'bot');
        }, 800);
    }

    generateAnswer(q) {
        // Privacy Guard: Explicitly decline intrusive questions
        if (q.includes('address') || q.includes('phone') || q.includes('salary') || q.includes('money')) {
            return "I cannot share private personal data. Please contact Prajakta directly.";
        }

        // 1. Direct Knowledge Match
        const knowledgeMatch = this.knowledge.find(k =>
            q.includes(k.topic.toLowerCase()) || q.includes(k.id)
        );

        if (knowledgeMatch) {
            return `Prajakta has been exploring ${knowledgeMatch.topic}. Note: "${knowledgeMatch.summary}"`;
        }

        // 2. Profile Context
        if (q.includes('who are you') || q.includes('who is prajakta')) {
            return this.context.profile.tagline || "A developer building curiuos digital experiences.";
        }

        if (q.includes('skill') || q.includes('tech') || q.includes('stack')) {
            return "Prajakta works with React, Node.js, and Cloud technologies. Check the Skills section for the full list.";
        }

        if (q.includes('contact') || q.includes('email')) {
            return "You can use the contact form on this page, or find the email in the footer/contact section.";
        }

        // 3. Fallback
        return "I'm focusing my learning on Prajakta's public projects and dev notes. I don't have an answer for that yet.";
    }
}
