import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { platformMustBeOwnedByCurrentUser, platformMustHaveFeatureEnabled } from '../authentication/ee-authorization'
import { platformAnalyticsReportService } from './analytics.service'
import { piecesAnalyticsService } from './pieces-analytics.service'

export const analyticsModule: FastifyPluginAsyncTypebox = async (app) => {
    app.addHook('preHandler', platformMustBeOwnedByCurrentUser)
    app.addHook('preHandler', platformMustHaveFeatureEnabled((platform) => platform.plan.analyticsEnabled))
    await piecesAnalyticsService(app.log).init()
    await app.register(analyticsController, { prefix: '/v1/analytics' })
}

const analyticsController: FastifyPluginAsyncTypebox = async (app) => {

    app.get('/', async (request) => {
        const { platform } = request.principal
        return platformAnalyticsReportService(request.log).getOrGenerateReport(platform.id)
    })
    app.post('/', async (request) => {
        const { platform } = request.principal
        return platformAnalyticsReportService(request.log).refreshReport(platform.id)
    })
}