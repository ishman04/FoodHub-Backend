class AnalyticsService {
    constructor(analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    async getTopProducts() {
        return await this.analyticsRepository.getTopProducts();
    }
}

module.exports = AnalyticsService;
