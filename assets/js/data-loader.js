// Static Data Loader for Makalanegama School Website
class DataLoader {
    constructor() {
        this.cache = new Map();
    }

    // Load and cache JSON data
    async loadData(dataType) {
        if (this.cache.has(dataType)) {
            return this.cache.get(dataType);
        }

        try {
            const response = await fetch(`data/${dataType}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${dataType} data`);
            }
            const data = await response.json();
            this.cache.set(dataType, data);
            return data;
        } catch (error) {
            console.error(`Error loading ${dataType}:`, error);
            return [];
        }
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Truncate text with ellipsis
    truncateText(text, maxLength = 150) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    // Get category class for styling
    getCategoryClass(category) {
        const categoryClasses = {
            'Technology': 'technology',
            'Sports': 'sports',
            'Academic': 'academic',
            'Cultural': 'cultural',
            'Environmental': 'environmental',
            'Arts': 'arts',
            'Science': 'science',
            'Community Service': 'community'
        };
        return categoryClasses[category] || 'academic';
    }

    // Load and display achievements
    async loadAchievements(container, limit = null, featured = false) {
        const achievements = await this.loadData('achievements');
        let filteredAchievements = featured ? 
            achievements.filter(achievement => achievement.is_featured) : 
            achievements;
        
        if (limit) {
            filteredAchievements = filteredAchievements.slice(0, limit);
        }

        if (container) {
            container.innerHTML = this.renderAchievements(filteredAchievements);
        }

        return filteredAchievements;
    }

    // Render achievements HTML
    renderAchievements(achievements) {
        return achievements.map(achievement => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="achievement-card h-100" data-aos="fade-up">
                    <div class="achievement-image">
                        <img src="${achievement.image_url || 'assets/images/default-achievement.jpg'}" 
                             alt="${achievement.title}" 
                             class="img-fluid">
                        <div class="achievement-category ${this.getCategoryClass(achievement.category)}">
                            ${achievement.category}
                        </div>
                        ${achievement.is_featured ? '<div class="featured-badge"><i class="fas fa-star"></i></div>' : ''}
                    </div>
                    <div class="achievement-content">
                        <div class="achievement-date">
                            <i class="fas fa-calendar"></i>
                            ${this.formatDate(achievement.created_at)}
                        </div>
                        <h4>${achievement.title}</h4>
                        <p>${this.truncateText(achievement.description.replace(/\n/g, ' '))}</p>
                        <div class="achievement-actions">
                            <button class="btn btn-maroon btn-sm" onclick="viewAchievement(${achievement.id})">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Load and display events
    async loadEvents(container, limit = null, upcoming = false) {
        const events = await this.loadData('events');
        let filteredEvents = events;
        
        if (upcoming) {
            const today = new Date();
            filteredEvents = events.filter(event => new Date(event.event_date) >= today);
        }
        
        if (limit) {
            filteredEvents = filteredEvents.slice(0, limit);
        }

        if (container) {
            container.innerHTML = this.renderEvents(filteredEvents);
        }

        return filteredEvents;
    }

    // Render events HTML
    renderEvents(events) {
        return events.map(event => `
            <div class="event-item" data-aos="fade-up">
                <div class="event-date">
                    <div class="date-number">${new Date(event.event_date).getDate()}</div>
                    <div class="date-month">${new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}</div>
                </div>
                <div class="event-content">
                    <h5>${event.title}</h5>
                    ${event.event_time ? `<div class="event-time"><i class="fas fa-clock"></i> ${event.event_time}</div>` : ''}
                    <div class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</div>
                    <p>${event.description}</p>
                </div>
            </div>
        `).join('');
    }

    // Load and display news
    async loadNews(container, limit = null, featured = false) {
        const news = await this.loadData('news');
        let filteredNews = featured ? 
            news.filter(article => article.is_featured) : 
            news;
        
        if (limit) {
            filteredNews = filteredNews.slice(0, limit);
        }

        if (container) {
            container.innerHTML = this.renderNews(filteredNews);
        }

        return filteredNews;
    }

    // Render news HTML
    renderNews(news) {
        return news.map(article => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="news-card h-100" data-aos="fade-up">
                    <div class="news-image">
                        <img src="${article.image_url || 'assets/images/default-news.jpg'}" 
                             alt="${article.title}" 
                             class="img-fluid">
                        <div class="news-category">${article.category}</div>
                    </div>
                    <div class="news-content">
                        <div class="news-meta">
                            <span><i class="fas fa-calendar"></i> ${this.formatDate(article.created_at)}</span>
                            <span><i class="fas fa-user"></i> ${article.author}</span>
                        </div>
                        <h3>${article.title}</h3>
                        <p>${this.truncateText(article.content)}</p>
                        <a href="#" class="news-link">
                            Read More <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Load and display teachers
    async loadTeachers(container, limit = null, department = null) {
        const teachers = await this.loadData('teachers');
        let filteredTeachers = department ? 
            teachers.filter(teacher => teacher.department === department && teacher.is_active) : 
            teachers.filter(teacher => teacher.is_active);
        
        if (limit) {
            filteredTeachers = filteredTeachers.slice(0, limit);
        }

        if (container) {
            container.innerHTML = this.renderTeachers(filteredTeachers);
        }

        return filteredTeachers;
    }

    // Render teachers HTML
    renderTeachers(teachers) {
        return teachers.map(teacher => `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="teacher-card h-100" data-aos="fade-up">
                    <div class="teacher-image">
                        <img src="${teacher.photo_url || 'assets/images/default-teacher.jpg'}" 
                             alt="${teacher.name}" 
                             class="img-fluid">
                        <div class="teacher-overlay">
                            <div class="teacher-social">
                                ${teacher.email ? `<a href="mailto:${teacher.email}"><i class="fas fa-envelope"></i></a>` : ''}
                                ${teacher.phone ? `<a href="tel:${teacher.phone}"><i class="fas fa-phone"></i></a>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="teacher-content">
                        <h5>${teacher.name}</h5>
                        <div class="teacher-subject">${teacher.subject}</div>
                        <div class="teacher-department">${teacher.department}</div>
                        ${teacher.qualification !== '-' ? `<div class="teacher-qualification">${teacher.qualification}</div>` : ''}
                        ${teacher.experience_years ? `<div class="teacher-experience">${teacher.experience_years} years experience</div>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Get statistics
    async getStatistics() {
        const [achievements, events, news, teachers] = await Promise.all([
            this.loadData('achievements'),
            this.loadData('events'),
            this.loadData('news'),
            this.loadData('teachers')
        ]);

        return {
            totalAchievements: achievements.length,
            featuredAchievements: achievements.filter(a => a.is_featured).length,
            upcomingEvents: events.filter(e => new Date(e.event_date) >= new Date()).length,
            totalNews: news.length,
            totalTeachers: teachers.filter(t => t.is_active).length,
            departments: [...new Set(teachers.map(t => t.department))].length
        };
    }
}

// Initialize data loader
const dataLoader = new DataLoader();

// Global functions for modal interactions
function viewAchievement(id) {
    // This can be expanded to show achievement details in a modal
    console.log('Viewing achievement:', id);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
}