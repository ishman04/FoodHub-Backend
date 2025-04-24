class AnalyticsService {
    constructor(analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    async getTopProducts() {
        return await this.analyticsRepository.getTopProducts();
    }
    async getTopCustomers() {
        return await this.analyticsRepository.getTopCustomers();
    }
}

module.exports = AnalyticsService;
