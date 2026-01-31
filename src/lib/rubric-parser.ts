import type { ParsedRubric, RubricCriterion } from './ai/types';

/**
 * Parse rubric text into structured format.
 * This handles common rubric formats from Canvas and other LMS.
 */
export function parseRubricText(text: string): ParsedRubric {
	const lines = text.trim().split('\n').filter(line => line.trim());
	const criteria: RubricCriterion[] = [];

	let currentCriterion: RubricCriterion | null = null;

	for (const line of lines) {
		const trimmed = line.trim();

		// Try to match criterion header patterns
		// Pattern 1: "Criterion Name (20 pts)"
		const pattern1 = trimmed.match(/^(.+?)\s*\((\d+)\s*(?:pts?|points?)\)/i);

		// Pattern 2: "Criterion Name: 20 points"
		const pattern2 = trimmed.match(/^(.+?):\s*(\d+)\s*(?:pts?|points?)/i);

		// Pattern 3: "20 pts - Criterion Name"
		const pattern3 = trimmed.match(/^(\d+)\s*(?:pts?|points?)\s*[-–:]\s*(.+)/i);

		if (pattern1) {
			if (currentCriterion) {
				criteria.push(currentCriterion);
			}
			currentCriterion = {
				name: pattern1[1].trim(),
				points: parseInt(pattern1[2]),
				levels: []
			};
		} else if (pattern2) {
			if (currentCriterion) {
				criteria.push(currentCriterion);
			}
			currentCriterion = {
				name: pattern2[1].trim(),
				points: parseInt(pattern2[2]),
				levels: []
			};
		} else if (pattern3) {
			if (currentCriterion) {
				criteria.push(currentCriterion);
			}
			currentCriterion = {
				name: pattern3[2].trim(),
				points: parseInt(pattern3[1]),
				levels: []
			};
		} else if (currentCriterion) {
			// Try to parse level descriptions
			// Pattern: "- Exemplary: Description here"
			const levelMatch = trimmed.match(/^[-•*]\s*(\w+):\s*(.+)/);
			if (levelMatch && currentCriterion.levels) {
				const levelName = levelMatch[1];
				const levelDesc = levelMatch[2];

				// Estimate points based on level name
				const levelPoints = estimateLevelPoints(levelName, currentCriterion.points);

				currentCriterion.levels.push({
					name: levelName,
					points: levelPoints,
					description: levelDesc
				});
			} else if (!trimmed.startsWith('-') && !trimmed.startsWith('•')) {
				// Could be a description for the criterion
				if (!currentCriterion.description) {
					currentCriterion.description = trimmed;
				} else {
					currentCriterion.description += ' ' + trimmed;
				}
			}
		}
	}

	// Don't forget the last criterion
	if (currentCriterion) {
		criteria.push(currentCriterion);
	}

	const totalPoints = criteria.reduce((sum, c) => sum + c.points, 0);

	return { criteria, totalPoints };
}

function estimateLevelPoints(levelName: string, maxPoints: number): number {
	const name = levelName.toLowerCase();

	// Common rubric level names and their typical percentages
	const levelPercentages: Record<string, number> = {
		'exemplary': 1.0,
		'excellent': 1.0,
		'outstanding': 1.0,
		'proficient': 0.85,
		'accomplished': 0.85,
		'competent': 0.8,
		'satisfactory': 0.75,
		'developing': 0.7,
		'approaching': 0.7,
		'basic': 0.65,
		'beginning': 0.6,
		'emerging': 0.6,
		'needs improvement': 0.5,
		'unsatisfactory': 0.4,
		'inadequate': 0.3,
		'not present': 0,
		'missing': 0
	};

	for (const [level, percentage] of Object.entries(levelPercentages)) {
		if (name.includes(level)) {
			return Math.round(maxPoints * percentage);
		}
	}

	// Default to 70% if unknown
	return Math.round(maxPoints * 0.7);
}

/**
 * Convert parsed rubric back to display text
 */
export function rubricToText(rubric: ParsedRubric): string {
	return rubric.criteria
		.map(c => {
			let text = `${c.name} (${c.points} pts)`;
			if (c.description) {
				text += `\n  ${c.description}`;
			}
			if (c.levels && c.levels.length > 0) {
				c.levels.forEach(level => {
					text += `\n  - ${level.name}: ${level.description}`;
				});
			}
			return text;
		})
		.join('\n\n');
}

/**
 * Validate that parsed rubric looks reasonable
 */
export function validateRubric(rubric: ParsedRubric): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (rubric.criteria.length === 0) {
		errors.push('No criteria could be parsed from the rubric text');
	}

	if (rubric.totalPoints === 0) {
		errors.push('Total points is zero - check that point values are included');
	}

	for (const criterion of rubric.criteria) {
		if (!criterion.name || criterion.name.length < 2) {
			errors.push(`Invalid criterion name: "${criterion.name}"`);
		}
		if (criterion.points <= 0) {
			errors.push(`Criterion "${criterion.name}" has invalid points: ${criterion.points}`);
		}
	}

	return {
		valid: errors.length === 0,
		errors
	};
}
