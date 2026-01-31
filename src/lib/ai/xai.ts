import type { AIProvider, AnalysisRequest, AnalysisResult } from './types';

const ANALYSIS_PROMPT = `You are an expert academic writing reviewer. Analyze the following paper and provide detailed feedback.

Evaluate the paper across these categories, scoring each from 1-10:

1. STRUCTURE & FLOW
2. EVIDENCE & CITATIONS
3. LANGUAGE & STYLE
4. RUBRIC ALIGNMENT (if rubric provided)

For each category, provide:
- A score (1-10)
- 2-3 strengths and 2-3 improvements
- Location references where applicable

Respond in JSON format.`;

export class XAIProvider implements AIProvider {
	name = 'xai';
	private apiKey: string;
	private baseUrl = 'https://api.x.ai/v1';

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	async analyze(request: AnalysisRequest): Promise<AnalysisResult> {
		// For development, return mock data
		if (!this.apiKey || this.apiKey.startsWith('xai-xxx')) {
			return this.getMockResult();
		}

		const prompt = this.buildPrompt(request);

		const response = await fetch(`${this.baseUrl}/chat/completions`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${this.apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'grok-2-latest',
				messages: [
					{ role: 'system', content: ANALYSIS_PROMPT },
					{ role: 'user', content: prompt }
				],
				temperature: 0.3,
				response_format: { type: 'json_object' }
			})
		});

		if (!response.ok) {
			throw new Error(`x.ai API error: ${response.status}`);
		}

		const data = await response.json();
		const content = data.choices[0].message.content;
		const parsed = JSON.parse(content);

		return {
			overallScore: parsed.overallScore,
			categories: parsed.categories.map((cat: any) => ({
				name: cat.name,
				score: cat.score,
				maxScore: 10,
				feedback: cat.feedback
			})),
			highlights: [],
			provider: 'xai',
			processingTime: 0
		};
	}

	async testConnection(): Promise<boolean> {
		if (!this.apiKey || this.apiKey.startsWith('xai-xxx')) {
			return true; // Mock mode
		}

		try {
			const response = await fetch(`${this.baseUrl}/models`, {
				headers: {
					'Authorization': `Bearer ${this.apiKey}`
				}
			});
			return response.ok;
		} catch {
			return false;
		}
	}

	private buildPrompt(request: AnalysisRequest): string {
		let prompt = `PAPER:\n${request.paper}`;

		if (request.rubric) {
			prompt += `\n\nRUBRIC:\n${request.rubric}`;
		}

		return prompt;
	}

	private getMockResult(): AnalysisResult {
		return {
			overallScore: 7.6,
			categories: [
				{
					name: 'Structure & Flow',
					score: 7,
					maxScore: 10,
					feedback: [
						{ type: 'strength', text: 'Well-organized introduction that sets up the argument' },
						{ type: 'improvement', text: 'Consider restructuring paragraph 3 for clarity', location: 'Para 3' },
						{ type: 'strength', text: 'Strong conclusion that ties back to thesis' }
					]
				},
				{
					name: 'Evidence & Citations',
					score: 8,
					maxScore: 10,
					feedback: [
						{ type: 'strength', text: 'Excellent use of peer-reviewed sources' },
						{ type: 'improvement', text: 'Add more recent studies to support claims', location: 'Para 4-5' },
						{ type: 'strength', text: 'Good balance of primary and secondary sources' }
					]
				},
				{
					name: 'Language & Style',
					score: 7,
					maxScore: 10,
					feedback: [
						{ type: 'improvement', text: 'Some sentences could be more concise', location: 'Para 2' },
						{ type: 'strength', text: 'Appropriate academic register throughout' },
						{ type: 'improvement', text: 'Watch for passive voice overuse', location: 'Various' }
					]
				},
				{
					name: 'Rubric Alignment',
					score: 8,
					maxScore: 10,
					feedback: [
						{ type: 'strength', text: 'Meets all major rubric requirements' },
						{ type: 'improvement', text: 'Could strengthen the counterargument section' },
						{ type: 'strength', text: 'Citation format is consistent' }
					]
				}
			],
			highlights: [],
			provider: 'xai',
			processingTime: 2800
		};
	}
}
