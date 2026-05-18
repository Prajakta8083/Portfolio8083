/**
 * Main Application Entry Point
 */

import { DataLoader } from './services/DataLoader.js';
import { UIRenderer } from './core/UIRenderer.js';
import { AnalyticsService } from './services/AnalyticsService.js';
import { ContactService } from './services/ContactService.js';
import { CuriosityWidget } from './components/CuriosityWidget.js';
import { GitHubService } from './services/GitHubService.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Portfolio App Initializing...');

    AnalyticsService.init();

    // Mobile Menu Logic
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
            mobileBtn.textContent = navLinks.classList.contains('mobile-open') ? '✕' : '☰';
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
                mobileBtn.textContent = '☰';
            });
        });
    }

    // 1. Data Store
    const store = {
        profile: null,
        projects: null,
        skills: null,
        blog: null,
        experience: null,
        certs: null,
        cloud: null
    };

    try {
        // 2. Preload Critical Data
        // Using Promise.all for faster parallel loading
        const [profile, projects, skills, blog, experience, certs, cloud] = await Promise.all([
            DataLoader.load('profile.json'),
            GitHubService.fetchProjects('Prajakta8083'), // Fetch from GitHub
            DataLoader.load('skills.json'),
            DataLoader.load('blog.json'),
            DataLoader.load('experience.json'),
            DataLoader.load('certifications.json'),
            DataLoader.load('cloud.json')
        ]);

        Object.assign(store, { profile, projects, skills, blog, experience, certs, cloud });

        // 3. Render All Sections Sequentially
        const appRoot = document.getElementById('app-root');
        
        let portfolioHTML = "";
        portfolioHTML += UIRenderer.renderHome(store.profile);
        portfolioHTML += UIRenderer.renderAbout(store.profile);
        portfolioHTML += UIRenderer.renderProjects(store.projects);
        portfolioHTML += UIRenderer.renderCloud(store.cloud);
        portfolioHTML += UIRenderer.renderBlog(store.blog);
        portfolioHTML += UIRenderer.renderExperience(store.experience);
        portfolioHTML += UIRenderer.renderCertifications(store.certs);
        portfolioHTML += UIRenderer.renderContact();

        appRoot.innerHTML = portfolioHTML;

        // Initialize features that depend on rendered DOM
        ContactService.init();

        // ScrollSpy to update active link in navbar
        const sections = document.querySelectorAll('section');
        const navLinksArr = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navLinksArr.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // 4. Init Widgets
        const aiWidget = new CuriosityWidget('ai-widget-root');
        aiWidget.init();


    } catch (error) {
        console.error('Initialization Failed:', error);
        document.body.innerHTML = `<h1 class="text-error">System Offline: ${error.message}</h1>`;
    }
});
