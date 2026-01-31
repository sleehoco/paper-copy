import type { AIProvider, AnalysisRequest, AnalysisResult, CategoryScore, FeedbackItem } from './types';

const ANALYSIS_PROMPT = `You are an expert academic writing reviewer. Analyze the following paper and provide detailed feedback.

Evaluate the paper across these categories, scoring each from 1-10:

1. STRUCTURE & FLOW
   - Introduction effectiveness
   - Paragraph organization
   - Transitions between sections
   - Conclusion strength
   - Logical progression

2. EVIDENCE & CITATIONS
   - Claims supported by evidence
   - Source credibility
   - Quote integration
   - Citation consistency
   - Missing citations

3. LANGUAGE & STYLE
   - Academic tone
   - Sentence variety
   - Clarity and concision
   - Grammar/spelling
   - Word choice

4. RUBRIC ALIGNMENT (if rubric provided)
   - How well does the paper meet rubric criteria?
   - Per-criterion analysis

For each category, provide:
- A score (1-10)
- 2-3 strengths (things done well)
- 2-3 improvements (specific, actionable suggestions)
- Location references where applicable (e.g., "paragraph 3")

Respond in JSON format with this structure:
{
  "overallScore": number,
  "categories": [
    {
      "name": "Structure & Flow",
      "score": number,
      "feedback": [
        { "type": "strength" | "improvement", "text": string, "location": string? }
      ]
    }
  ]
}`;

export class GroqProvider implements AIProvider {
	name = 'groq';
	private apiKey: string;
	private baseUrl = 'https://api.groq.com/openai/v1';

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	async analyze(request: AnalysisRequest): Promise<AnalysisResult> {
		// For development, return mock data
		// In production, this would call the Groq API
		if (!this.apiKey || this.apiKey.startsWith('sk-groq-xxx')) {
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
				model: 'llama-3.1-70b-versatile',
				messages: [
					{ role: 'system', content: ANALYSIS_PROMPT },
					{ role: 'user', content: prompt }
				],
				temperature: 0.3,
				max_tokens: 4096,
				response_format: { type: 'json_object' }
			})
		});

		if (!response.ok) {
			throw new Error(`Groq API error: ${response.status}`);
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
			provider: 'groq',
			processingTime: 0
		};
	}

	async testConnection(): Promise<boolean> {
		if (!this.apiKey || this.apiKey.startsWith('sk-groq-xxx')) {
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
			overallScore: 7.4,
			categories: [
				{
					name: 'Structure & Flow',
					score: 7,
					maxScore: 10,
					feedback: [
						{ type: 'strength', text: 'Clear introduction with good hook that engages readers' },
						{ type: 'improvement', text: 'Paragraph 3 lacks a clear topic sentence', location: 'Para 3' },
						{ type: 'improvement', text: 'Transition between sections 2 and 3 is abrupt', location: 'Para 4' },
						{ type: 'strength', text: 'Conclusion effectively summarizes main points' }
					]
				},
				{
					name: 'Evidence & Citations',
					score: 8,
					maxScore: 10,
					feedback: [
						{ type: 'strength', text: 'Good variety of credible sources used' },
						{ type: 'strength', text: 'Quotes are well-integrated into arguments' },
						{ type: 'improvement', text: 'Claim in paragraph 5 needs supporting evidence', location: 'Para 5' },
						{ type: 'improvement', text: 'Consider adding a counterargument source' }
					]
				},
				{
					name: 'Language & Style',
					score: 6,
					maxScore: 10,
					feedback: [
						{ type: 'improvement', text: 'Several sentences are overly complex and hard to follow', location: 'Para 2, 6' },
						{ type: 'improvement', text: 'Inconsistent tone - shifts from formal to casual', location: 'Para 4' },
						{ type: 'strength', text: 'Good use of academic vocabulary' },
						{ type: 'improvement', text: '3 grammar issues detected', location: 'Various' }
					]
				},
				{
					name: 'Rubric Alignment',
					score: 8,
					maxScore: 10,
					feedback: [
						{ type: 'strength', text: 'Thesis addresses the prompt effectively' },
						{ type: 'strength', text: 'Required sources quota met (5/5)' },
						{ type: 'improvement', text: 'MLA formatting has minor inconsistencies' },
						{ type: 'strength', text: 'Word count within required range' }
					]
				}
			],
			highlights: [],
			provider: 'groq',
			processingTime: 2500
		};
	}
}
