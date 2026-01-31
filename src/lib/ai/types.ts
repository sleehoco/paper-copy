export interface AnalysisRequest {
	paper: string;
	rubric?: string;
}

export interface FeedbackItem {
	type: 'strength' | 'improvement';
	text: string;
	location?: string;
}

export interface CategoryScore {
	name: string;
	score: number;
	maxScore: number;
	feedback: FeedbackItem[];
}

export interface AnalysisResult {
	overallScore: number;
	categories: CategoryScore[];
	highlights: Highlight[];
	provider: 'groq' | 'xai';
	processingTime: number;
}

export interface Highlight {
	start: number;
	end: number;
	type: 'strength' | 'improvement';
	category: string;
	message: string;
}

export interface AIProvider {
	name: string;
	analyze(request: AnalysisRequest): Promise<AnalysisResult>;
	testConnection(): Promise<boolean>;
}

export interface RubricCriterion {
	name: string;
	points: number;
	description?: string;
	levels?: {
		name: string;
		points: number;
		description: string;
	}[];
}

export interface ParsedRubric {
	criteria: RubricCriterion[];
	totalPoints: number;
}
