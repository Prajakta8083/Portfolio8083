/**
 * UIRenderer
 * Handles page-level rendering for the SPA.
 */
export const UIRenderer = {
    // Utility: Clear and Set Main Content
    // Utility: Clear and Set Main Content (Deprecated, leaving for backward compatibility if needed)
    setMainContent(html) {
        const appRoot = document.getElementById('app-root');
        appRoot.innerHTML = html;
        // Re-trigger animations if needed
        appRoot.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 300, easing: 'ease-out' });
    },

    // --- Pages ---

    renderHome(profileData) {
        return `
            <section id="home" class="section">
                <div class="container hero-wrapper">
                    <div class="hero-content">
                        <h1 class="hero-title">HI, I'M ${profileData.name.split(' ')[0]}!</h1>
                        <h2 class="hero-subtitle text-white">
                            CREATIVE <span class="text-accent">ENGINEER</span>
                        </h2>
                        <p class="text-muted text-lg mb-8" style="max-width: 500px;">
                            ${profileData.about.summary}
                        </p>
                        <div class="hero-actions">
                            <a href="#contact" class="btn btn-primary">Download CV ↓</a>
                            <a href="#projects" class="btn" style="color: #fff; display: flex; align-items: center; gap: 0.5rem;">
                                <div style="width: 30px; height: 30px; background: var(--accent-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #000;">▶</div>
                                View Projects
                            </a>
                        </div>
                    </div>
                    
                    <div class="hero-image-container">
                        <div class="hexagon-frame">
                            <div class="hexagon-inner">
                                <!-- Placeholder Image - User should replace this -->
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Prajakta&backgroundColor=b6e3f4" alt="Profile">
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    renderAbout(profileData) {
        return `
            <section id="about" class="section">
                <div class="container">
                    <h2 class="section-title">01. <span class="mono">About Me</span></h2>
                    <div class="about-grid">
                         <div class="about-text">
                            <p class="text-lg">${profileData.about.summary}</p>
                            <br>
                            <p class="text-muted">${profileData.about.details}</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    renderProjects(projects) {
        const gridHtml = projects.map(project => `
            <div class="project-card" style="cursor: pointer;" onclick="if(!event.target.closest('a')) window.open('${project.links.repo}', '_blank', 'noopener,noreferrer')">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-links">
                        ${project.links.repo ? `<a href="${project.links.repo}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
                        ${project.links.demo ? `<a href="${project.links.demo}" target="_blank" rel="noopener noreferrer">Live</a>` : ''}
                    </div>
                </div>
                <p class="project-desc text-muted">${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(t => `<span class="mono text-xs">${t}</span>`).join(' ')}
                </div>
                 <div class="mt-2">
                    <a href="${project.links.repo}" target="_blank" rel="noopener noreferrer" class="text-xs text-accent hover-link">View Code ></a>
                </div>
            </div>
        `).join('');

        return `
            <section id="projects" class="section">
                <div class="container">
                    <h2 class="section-title">02. <span class="mono">Selected Works</span></h2>
                    <div class="projects-grid">
                        ${gridHtml}
                    </div>
                </div>
            </section>
        `;
    },

    // Fallback for detail view
    renderProjectDetail(id, projects) {
        const project = projects.find(p => p.id === id);
        if (!project) {
            return this.render404();
        }

        this.setMainContent(`
             <section class="section">
                <div class="container">
                    <a href="#/projects" class="text-muted text-xs mb-4 block">< Back to Projects</a>
                    <h1 class="hero-title">${project.title}</h1>
                    <div class="mono text-accent mb-4">${project.tech.join(' • ')}</div>
                    <p class="text-lg mb-8" style="max-width: 800px;">${project.description}</p>
                    
                    <div class="p-4 border border-light rounded bg-card">
                        <p class="mono text-sm">Detailed case study content would go here...</p>
                    </div>
                </div>
            </section>
        `);
    },

    renderCloud(cloudData) {
        const getStatusColor = (status) => status === 'Live' ? '#10b981' : '#f59e0b'; // Green or Amber

        const html = cloudData.projects.map(p => `
            <div class="project-card" style="cursor: ${p.links.demo || p.links.repo ? 'pointer' : 'default'}" 
                 onclick="if(!event.target.closest('a') && ('${p.links.demo || p.links.repo}')) window.open('${p.links.demo || p.links.repo}', '_blank', 'noopener,noreferrer')">
                <div class="project-header">
                    <h3 class="text-accent">${p.title}</h3>
                    <span class="mono text-xs" style="color: ${getStatusColor(p.status)}; border: 1px solid ${getStatusColor(p.status)}; padding: 2px 6px; border-radius: 4px;">
                        ${p.status}
                    </span>
                </div>
                
                <p class="text-xs mono mb-2" style="color: var(--text-main); font-weight: bold;">
                    ${p.platform} <span class="text-dim">•</span> ${p.services.join(', ')}
                </p>
                
                <p class="text-muted mb-4">${p.description}</p>
                
                <div class="project-links mt-auto">
                    ${p.links.repo ? `<a href="${p.links.repo}" target="_blank" rel="noopener noreferrer" class="text-xs hover-link">GitHub</a>` : ''}
                    ${p.links.demo ? `<a href="${p.links.demo}" target="_blank" rel="noopener noreferrer" class="text-xs hover-link" style="color: var(--accent-primary)">Live Demo ></a>` : ''}
                </div>
            </div>
        `).join('');

        return `
            <section id="cloud" class="section">
                <div class="container">
                    <h2 class="section-title">03. <span class="mono">Cloud Engineering</span></h2>
                    <p class="text-muted mb-8">${cloudData.summary}</p>
                     <div class="projects-grid">
                        ${html}
                    </div>
                </div>
            </section>
        `;
    },

    renderBlog(posts) {
        const html = posts.map(post => `
             <article class="project-card" style="cursor: pointer;" onclick="location.hash='#/blog/${post.id}'">
                <h3 class="text-main mb-2">${post.title}</h3>
                <div class="flex gap-2 text-xs text-muted mono mb-2">
                    <span>${post.date}</span>
                    <span>•</span>
                    <span>${post.tags.join(', ')}</span>
                </div>
                <p class="text-muted">${post.summary}</p>
             </article>
        `).join('');

        return `
            <section id="blog" class="section">
                <div class="container">
                    <h2 class="section-title">04. <span class="mono">Engineering Blog</span></h2>
                    <div class="projects-grid">
                        ${html}
                    </div>
                </div>
            </section>
        `;
    },

    renderBlogPost(id, posts) {
        const post = posts.find(p => p.id === id);
        if (!post) return this.render404();

        this.setMainContent(`
             <section class="section">
                <div class="container" style="max-width: 800px;">
                    <a href="#/blog" class="text-muted text-xs mb-4 block">< Back to Blog</a>
                    <h1 class="mb-4">${post.title}</h1>
                     <div class="flex gap-2 text-xs text-accent mono mb-8">
                        <span>${post.date}</span>
                        <span>•</span>
                        <span>${post.tags.join(', ')}</span>
                    </div>
                    <div class="text-lg leading-relaxed content-body">
                        ${post.content}
                    </div>
                </div>
            </section>
        `);
    },

    renderExperience(experience) {
        const html = experience.map(exp => `
            <div class="mb-8 pl-4 border-l-2 border-accent">
                <h3 class="text-xl font-bold">${exp.role}</h3>
                <div class="text-accent mono text-sm mb-2">${exp.company} | ${exp.period}</div>
                <p class="text-muted">${exp.description}</p>
            </div>
        `).join('');

        return `
            <section id="experience" class="section">
                <div class="container">
                    <h2 class="section-title">05. <span class="mono">Experience</span></h2>
                    <div class="mt-8">
                        ${html}
                    </div>
                </div>
            </section>
        `;
    },

    renderCertifications(certs) {
        const html = certs.map(c => `
             <div class="project-card flex justify-between items-center">
                <div>
                    <h3 class="text-main">${c.name}</h3>
                    <p class="text-muted text-sm">${c.issuer} (${c.date})</p>
                </div>
                <a href="${c.link}" class="btn btn-outline btn-sm">Verify</a>
             </div>
        `).join('');

        return `
             <section id="certifications" class="section">
                <div class="container">
                    <h2 class="section-title">06. <span class="mono">Certifications</span></h2>
                    <div class="flex flex-col gap-4">
                        ${html}
                    </div>
                </div>
            </section>
        `;
    },

    renderContact() {
        return `
            <section id="contact" class="section">
                <div class="container">
                    <h2 class="section-title">Contact Me</h2>
                     <div class="contact-wrapper">
                        <div class="contact-info">
                            <p class="text-lg mb-4">Open to opportunities in Frontend & Cloud Engineering.</p>
                             <ul class="text-muted">
                                <li>Prajakta Zanzane</li>
                                <li>prajaktazanzane3@gmail.com</li>
                            </ul>
                        </div>
                        <form id="contact-form" class="contact-form">
                            <div class="form-group">
                                <label class="mono">Name</label>
                                <input type="text" name="name" required>
                            </div>
                            <div class="form-group">
                                <label class="mono">Email</label>
                                <input type="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label class="mono">Message</label>
                                <textarea name="message" rows="5" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Send Message</button>
                        </form>
                    </div>
                </div>
            </section>
        `;
    },

    render404() {
        this.setMainContent(`
            <div class="container section text-center">
                <h1 class="hero-title text-error">404</h1>
                <p class="mono">Page not found.</p>
                <a href="#/" class="btn btn-outline mt-4">Return Home</a>
            </div>
        `);
    }
};
