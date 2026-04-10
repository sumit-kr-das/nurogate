import { prisma } from "db"

export abstract class ModelsService {

    static async getModels() {
        const models = await prisma.model.findMany({
            include: {
                company: true
            }
        })

        return models.map(model => ({
            id: model.id.toString(),
            name: model.name,
            slug: model.slug,
            company: {
                id: model.company.id.toString(),
                name: model.company.name,
                website: model.company.website
            }
        }))
    }

    static async getProviders() {
        const providers = await prisma.provider.findMany()

        return providers.map(provider => ({
            id: provider.id.toString(),
            providerKey: provider.providerKey,
            name: provider.name,
            website: provider.website
        }))
    }

    static async getModelProviders(modelId: number) {
        const mappings = await prisma.modelProviderMapping.findMany({
            where: {
                modelId
            },
            include: {
                provider: true
            }
        })

        return mappings.map(mapping => ({
            id: mapping.id.toString(),
            providerId: mapping.provider.id.toString(),
            providerKey: mapping.provider.providerKey,
            providerName: mapping.provider.name,
            providerWebsite: mapping.provider.website,
            upstreamModel: mapping.upstreamModel,
            inputTokenCost: mapping.inputTokenCost,
            outputTokenCost: mapping.outputTokenCost,
            enabled: mapping.enabled
        }))
    }
}
