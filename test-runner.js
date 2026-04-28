#!/usr/bin/env node

/**
 * Read-only smoke test runner for n8n-nodes-octavehq.
 *
 * Hits the same Octave API endpoints the node calls, using the same
 * auth headers (api_key + x-request-source: n8n). Verifies that:
 *   - Auth is accepted
 *   - Each list endpoint returns 200 with the expected envelope shape
 *   - For each resource that returned at least one item, the matching
 *     get endpoint resolves the first item's oId
 *
 * Read-only by design — never creates, updates, deletes, or generates.
 * Safe to point at any workspace.
 *
 * Usage:
 *   OCTAVE_API_KEY=... node test-runner.js
 *   OCTAVE_API_KEY=... OCTAVE_BASE_URL=https://app.octavehq.com node test-runner.js
 *   DEBUG=true OCTAVE_API_KEY=... node test-runner.js
 *
 * Or copy .env.example to .env and run with --env-file (Node 20.12+):
 *   node --env-file=.env test-runner.js
 *
 * Exits 1 on any failure.
 */

const API_KEY = process.env.OCTAVE_API_KEY;
const BASE_URL = (process.env.OCTAVE_BASE_URL || 'https://app.octavehq.com').replace(/\/$/, '');
const DEBUG = process.env.DEBUG === 'true';

if (!API_KEY) {
	console.error('❌ OCTAVE_API_KEY is required. Set it in your environment or .env file.');
	process.exit(1);
}

const HEADERS = {
	api_key: API_KEY,
	'x-request-source': 'n8n',
	Accept: 'application/json',
};

const RESOURCES = [
	{ name: 'agent', listPath: '/api/v2/agents/list', getPath: '/api/v2/agents/get' },
	{ name: 'brandVoice', listPath: '/api/v2/brand-voice/list' },
	{ name: 'buyingTrigger', listPath: '/api/v2/buying-trigger/list' },
	{ name: 'competitor', listPath: '/api/v2/competitor/list' },
	{ name: 'persona', listPath: '/api/v2/persona/list' },
	{ name: 'playbook', listPath: '/api/v2/playbook/list' },
	{ name: 'product', listPath: '/api/v2/product/list' },
	{ name: 'proofPoint', listPath: '/api/v2/proof-point/list' },
	{ name: 'reference', listPath: '/api/v2/reference/list' },
	{ name: 'resource', listPath: '/api/v2/resource/list' },
	{ name: 'segment', listPath: '/api/v2/segment/list' },
	{ name: 'service', listPath: '/api/v2/service/list' },
	{ name: 'solution', listPath: '/api/v2/solution/list' },
	{ name: 'useCase', listPath: '/api/v2/use-case/list' },
];

const results = { passed: 0, failed: 0, tests: [] };

function debug(message, data) {
	if (DEBUG) {
		console.log(`  🔍 ${message}`);
		if (data !== undefined) console.log(`     ${JSON.stringify(data, null, 2).split('\n').join('\n     ')}`);
	}
}

async function octaveRequest(method, path, query) {
	const url = new URL(`${BASE_URL}${path}`);
	if (query) {
		for (const [k, v] of Object.entries(query)) {
			if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
		}
	}
	debug(`${method} ${url.toString()}`);
	const res = await fetch(url, { method, headers: HEADERS });
	const text = await res.text();
	let body;
	try {
		body = text ? JSON.parse(text) : null;
	} catch {
		body = text;
	}
	if (!res.ok) {
		const detail = typeof body === 'object' ? JSON.stringify(body) : body;
		throw new Error(`HTTP ${res.status} on ${method} ${path}: ${detail}`);
	}
	return body;
}

async function runTest(name, fn) {
	process.stdout.write(`• ${name} ... `);
	try {
		const detail = await fn();
		console.log(`✅ ${detail || 'ok'}`);
		results.passed++;
		results.tests.push({ name, status: 'passed' });
	} catch (err) {
		console.log(`❌ ${err.message}`);
		results.failed++;
		results.tests.push({ name, status: 'failed', error: err.message });
	}
}

function assertListShape(body, resourceName) {
	if (!body || typeof body !== 'object') {
		throw new Error(`expected object response, got ${typeof body}`);
	}
	if (!Array.isArray(body.data)) {
		throw new Error(`expected body.data to be an array, got ${typeof body.data}`);
	}
	debug(`${resourceName} list returned ${body.data.length} item(s); hasNext=${body.hasNext}`);
}

async function main() {
	console.log(`Octave smoke runner — ${BASE_URL}`);
	console.log(`Read-only mode: list + get endpoints only\n`);

	// Auth check via agents/list — fails fast on bad key
	await runTest('auth: GET /api/v2/agents/list', async () => {
		const body = await octaveRequest('GET', '/api/v2/agents/list', { limit: 1 });
		assertListShape(body, 'agent');
		return `${body.data.length} item(s)`;
	});

	// agent/languages — separate non-list endpoint worth covering
	await runTest('agent: GET /api/v2/agents/languages', async () => {
		const body = await octaveRequest('GET', '/api/v2/agents/languages');
		if (!body) throw new Error('empty response');
		return 'ok';
	});

	for (const resource of RESOURCES) {
		let firstOId;
		await runTest(`${resource.name}: GET ${resource.listPath}`, async () => {
			const body = await octaveRequest('GET', resource.listPath, { limit: 5, offset: 0 });
			assertListShape(body, resource.name);
			if (body.data.length > 0) firstOId = body.data[0].oId;
			return `${body.data.length} item(s)`;
		});

		if (resource.getPath && firstOId) {
			await runTest(`${resource.name}: GET ${resource.getPath}?oId=…`, async () => {
				const body = await octaveRequest('GET', resource.getPath, { oId: firstOId });
				if (!body || typeof body !== 'object') throw new Error('expected object response');
				return `oId=${firstOId.slice(0, 8)}…`;
			});
		}
	}

	console.log(`\n${results.passed} passed, ${results.failed} failed`);
	process.exit(results.failed > 0 ? 1 : 0);
}

main().catch((err) => {
	console.error(`\n❌ Runner crashed: ${err.message}`);
	if (DEBUG) console.error(err.stack);
	process.exit(1);
});
