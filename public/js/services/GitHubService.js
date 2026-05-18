/**
 * GitHubService
 * Fetches public repositories and adapts them for the portfolio.
 */
export const GitHubService = {
    username: 'prajakta', // Default, can be overridden
    CACHE_KEY: 'subfolio_github_projects_v3',
    CACHE_DURATION: 1000 * 60 * 60 * 24, // 24 hours

    /**
     * Fetch projects from GitHub API or Cache
     * @param {string} user - GitHub username
     */
    async fetchProjects(user = this.username) {
        // 1. Check Cache
        const cached = this.getFromCache();
        if (cached) {
            console.log('GitHubService: Returning cached projects');
            return cached;
        }

        // 2. Fetch from API
        try {
            console.log(`GitHubService: Fetching repos for ${user}...`);
            const response = await fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=100`);

            if (!response.ok) {
                if (response.status === 403) throw new Error('GitHub API rate limit exceeded');
                if (response.status === 404) throw new Error('GitHub user not found');
                throw new Error('Failed to fetch GitHub repositories');
            }

            const repos = await response.json();

            // 3. Filter & Map
            const projects = this.processRepos(repos);

            // 4. Save to Cache
            this.saveToCache(projects);

            return projects;
        } catch (error) {
            console.warn('GitHubService Error:', error);
            // Fallback to local data if API fails
            return this.fetchLocalFallback();
        }
    },

    processRepos(repos) {
        const PINNED_REPO = 'Prajakta8083';

        // 1. Filter out forks/archived
        let filtered = repos.filter(repo => !repo.fork && !repo.archived);

        // 2. Identify the pinned project
        const pinnedProject = filtered.find(repo => repo.name === PINNED_REPO);

        // 3. Remove pinned project from the general list
        filtered = filtered.filter(repo => repo.name !== PINNED_REPO);

        // 4. Map to our format
        const mapRepo = (repo) => ({
            id: repo.name,
            title: this.formatTitle(repo.name),
            description: repo.description || 'No description provided.',
            tech: [repo.language].filter(Boolean),
            links: {
                repo: repo.html_url,
                demo: this.getDemoLink(repo)
            },
            featured: false
        });

        const mappedProjects = filtered.map(mapRepo).slice(0, 50); // Increased limit to 50

        // 5. Prepend pinned project if found
        if (pinnedProject) {
            const mappedPinned = mapRepo(pinnedProject);
            mappedPinned.featured = true; // Mark as featured
            mappedProjects.unshift(mappedPinned);
        }

        return mappedProjects;
    },

    formatTitle(kebabCase) {
        // "my-cool-project" -> "My Cool Project"
        return kebabCase
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },

    getDemoLink(repo) {
        if (repo.homepage) return repo.homepage;
        // Basic heuristic for GH Pages if homepage is missing but it has pages enabled
        // (Note: The public 'repos' endpoint has 'has_pages' boolean)
        if (repo.has_pages) {
            return `https://${repo.owner.login}.github.io/${repo.name}/`;
        }
        return null;
    },

    saveToCache(data) {
        const payload = {
            timestamp: Date.now(),
            data: data
        };
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(payload));
    },

    getFromCache() {
        const json = localStorage.getItem(this.CACHE_KEY);
        if (!json) return null;

        const payload = JSON.parse(json);
        const now = Date.now();

        if (now - payload.timestamp > this.CACHE_DURATION) {
            localStorage.removeItem(this.CACHE_KEY);
            return null;
        }
        return payload.data;
    },

    async fetchLocalFallback() {
        try {
            console.log('GitHubService: Falling back to local projects.json');
            // Dynamically import or fetch the local file
            // Since we are in an ES module environment, fetch is safest for .json in public
            const response = await fetch('./data/projects.json');
            return await response.json();
        } catch (e) {
            console.error('GitHubService: Local fallback failed', e);
            return [];
        }
    }
};
