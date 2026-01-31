import PocketBase from 'pocketbase';
import { browser } from '$app/environment';

const POCKETBASE_URL = import.meta.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(POCKETBASE_URL);

// Disable auto-cancellation to prevent issues with SvelteKit
pb.autoCancellation(false);

// Types for our collections
export interface User {
	id: string;
	email: string;
	name: string;
	avatar?: string;
	provider: 'google' | 'github';
	freeAnalysesUsed: number;
	subscriptionStatus: 'active' | 'canceled' | 'past_due' | null;
	stripeCustomerId?: string;
	subscriptionEndsAt?: string;
	status: 'active' | 'suspended' | 'banned';
	created: string;
	updated: string;
}

export interface Paper {
	id: string;
	userId?: string;
	title: string;
	content: string;
	fileUrl?: string;
	created: string;
}

export interface Rubric {
	id: string;
	userId?: string;
	name: string;
	criteria: string; // JSON string
	source: 'pasted' | 'uploaded' | 'manual';
	created: string;
}

export interface Analysis {
	id: string;
	paperId: string;
	rubricId?: string;
	scores: string; // JSON string
	feedback: string; // JSON string
	highlights: string; // JSON string
	aiProvider: 'groq' | 'xai';
	created: string;
}

// Auth helpers
export function isAuthenticated(): boolean {
	return pb.authStore.isValid;
}

export function getCurrentUser(): User | null {
	return pb.authStore.model as User | null;
}

export async function signInWithGoogle(): Promise<void> {
	await pb.collection('users').authWithOAuth2({ provider: 'google' });
}

export async function signInWithGithub(): Promise<void> {
	await pb.collection('users').authWithOAuth2({ provider: 'github' });
}

export function signOut(): void {
	pb.authStore.clear();
}

// Paper operations
export async function savePaper(data: Omit<Paper, 'id' | 'created'>): Promise<Paper> {
	return await pb.collection('papers').create(data);
}

export async function getPaper(id: string): Promise<Paper> {
	return await pb.collection('papers').getOne(id);
}

export async function getUserPapers(userId: string): Promise<Paper[]> {
	return await pb.collection('papers').getFullList({
		filter: `userId = "${userId}"`,
		sort: '-created'
	});
}

// Rubric operations
export async function saveRubric(data: Omit<Rubric, 'id' | 'created'>): Promise<Rubric> {
	return await pb.collection('rubrics').create(data);
}

export async function getRubric(id: string): Promise<Rubric> {
	return await pb.collection('rubrics').getOne(id);
}

// Analysis operations
export async function saveAnalysis(data: Omit<Analysis, 'id' | 'created'>): Promise<Analysis> {
	return await pb.collection('analyses').create(data);
}

export async function getAnalysis(id: string): Promise<Analysis> {
	return await pb.collection('analyses').getOne(id);
}

export async function getUserAnalyses(userId: string): Promise<Analysis[]> {
	const papers = await getUserPapers(userId);
	const paperIds = papers.map(p => p.id);

	if (paperIds.length === 0) return [];

	const filter = paperIds.map(id => `paperId = "${id}"`).join(' || ');
	return await pb.collection('analyses').getFullList({
		filter,
		sort: '-created'
	});
}

// Usage tracking
export async function incrementUsage(userId: string): Promise<void> {
	const user = await pb.collection('users').getOne(userId);
	await pb.collection('users').update(userId, {
		freeAnalysesUsed: (user.freeAnalysesUsed || 0) + 1
	});
}

export async function checkUsageLimit(userId?: string): Promise<{ allowed: boolean; remaining: number }> {
	if (!userId) {
		// Anonymous user - check IP-based rate limit (handled server-side)
		return { allowed: true, remaining: 3 };
	}

	const user = await pb.collection('users').getOne(userId);

	// Pro users have unlimited
	if (user.subscriptionStatus === 'active') {
		return { allowed: true, remaining: -1 };
	}

	// Free users have 10 lifetime
	const used = user.freeAnalysesUsed || 0;
	const remaining = 10 - used;

	return {
		allowed: remaining > 0,
		remaining
	};
}

// Admin operations
export async function getUsers(options?: {
	page?: number;
	perPage?: number;
	filter?: string;
	sort?: string;
}): Promise<{ items: User[]; totalItems: number; totalPages: number }> {
	const result = await pb.collection('users').getList(
		options?.page || 1,
		options?.perPage || 20,
		{
			filter: options?.filter,
			sort: options?.sort || '-created'
		}
	);

	return {
		items: result.items as unknown as User[],
		totalItems: result.totalItems,
		totalPages: result.totalPages
	};
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
	return await pb.collection('users').update(id, data);
}

export async function deleteUser(id: string): Promise<void> {
	await pb.collection('users').delete(id);
}

export async function grantFreeAnalyses(userId: string, amount: number): Promise<void> {
	const user = await pb.collection('users').getOne(userId);
	const currentUsed = user.freeAnalysesUsed || 0;

	// Reduce the "used" count, effectively granting more free analyses
	await pb.collection('users').update(userId, {
		freeAnalysesUsed: Math.max(0, currentUsed - amount)
	});
}
