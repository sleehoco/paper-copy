import type { AIProvider, AnalysisRequest, AnalysisResult } from './types';
import { GroqProvider } from './groq';
import { XAIProvider } from './xai';

export type ProviderName = 'groq' | 'xai';

interface ProviderConfig {
	primary: ProviderName;
	fallbackEnabled: boolean;
	groqApiKey?: string;
	xaiApiKey?: string;
}

let config: ProviderConfig = {
	primary: 'xai',
	fallbackEnabled: false
};

export function configureProviders(newConfig: Partial<ProviderConfig>) {
	config = { ...config, ...newConfig };
}

function getProvider(name: ProviderName): AIProvider {
	switch (name) {
		case 'groq':
			return new GroqProvider(config.groqApiKey || '');
		case 'xai':
			return new XAIProvider(config.xaiApiKey || '');
		default:
			throw new Error(`Unknown provider: ${name}`);
	}
}

function getFallbackProvider(): ProviderName {
	return config.primary === 'groq' ? 'xai' : 'groq';
}

export async function analyze(request: AnalysisRequest): Promise<AnalysisResult> {
	const startTime = Date.now();
	const primaryProvider = getProvider(config.primary);

	try {
		const result = await primaryProvider.analyze(request);
		return {
			...result,
			provider: config.primary,
			processingTime: Date.now() - startTime
		};
	} catch (error) {
		console.error(`Primary provider (${config.primary}) failed:`, error);

		if (!config.fallbackEnabled) {
			throw error;
		}

		console.log(`Falling back to ${getFallbackProvider()}`);
		const fallbackProvider = getProvider(getFallbackProvider());

		try {
			const result = await fallbackProvider.analyze(request);
			return {
				...result,
				provider: getFallbackProvider(),
				processingTime: Date.now() - startTime
			};
		} catch (fallbackError) {
			console.error(`Fallback provider also failed:`, fallbackError);
			throw fallbackError;
		}
	}
}

export async function testProvider(name: ProviderName): Promise<boolean> {
	const provider = getProvider(name);
	return provider.testConnection();
}
