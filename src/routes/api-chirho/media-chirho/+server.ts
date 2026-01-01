// For God so loved the world that He gave His only begotten Son...
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { R2HelperChirho } from '$lib/server/r2_chirho';
import { getDbChirho } from '$lib/server/db_chirho';
import { auditLogChirho } from '$lib/server/schema_chirho';

const MAX_FILE_SIZE_CHIRHO = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES_CHIRHO = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const POST: RequestHandler = async ({ request, locals }) => {
	const userChirho = locals.userChirho;

	// Only authenticated users can upload
	if (!userChirho) {
		return json({ successChirho: false, errorChirho: 'Authentication required' }, { status: 401 });
	}

	// Only staff, admin, super_admin can upload
	const allowedRolesChirho = ['staff', 'admin', 'super_admin'];
	if (!allowedRolesChirho.includes(userChirho.roleChirho)) {
		return json({ successChirho: false, errorChirho: 'Insufficient permissions' }, { status: 403 });
	}

	try {
		const formDataChirho = await request.formData();
		const fileChirho = formDataChirho.get('file') as File | null;
		const categoryChirho = (formDataChirho.get('category') as string) || 'general';
		const entityTypeChirho = formDataChirho.get('entityType') as string; // 'orphanage', 'child', 'need'
		const entityIdChirho = formDataChirho.get('entityId') as string;

		if (!fileChirho) {
			return json({ successChirho: false, errorChirho: 'No file provided' }, { status: 400 });
		}

		// Validate file type
		if (!ALLOWED_TYPES_CHIRHO.includes(fileChirho.type)) {
			return json({
				successChirho: false,
				errorChirho: `Invalid file type. Allowed: ${ALLOWED_TYPES_CHIRHO.join(', ')}`
			}, { status: 400 });
		}

		// Validate file size
		if (fileChirho.size > MAX_FILE_SIZE_CHIRHO) {
			return json({
				successChirho: false,
				errorChirho: `File too large. Maximum size: ${MAX_FILE_SIZE_CHIRHO / 1024 / 1024}MB`
			}, { status: 400 });
		}

		// Create R2 helper
		const r2Chirho = new R2HelperChirho(locals.platformChirho.R2_CHIRHO);

		// Read file as buffer
		const arrayBufferChirho = await fileChirho.arrayBuffer();

		// Upload to R2
		const resultChirho = await r2Chirho.uploadImageChirho(
			arrayBufferChirho,
			fileChirho.name,
			fileChirho.type,
			{
				categoryChirho,
				entityTypeChirho,
				entityIdChirho,
				uploadedByChirho: userChirho.userIdChirho
			}
		);

		// Audit log
		const dbChirho = getDbChirho(locals.platformChirho);
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: parseInt(userChirho.userIdChirho),
			actionChirho: 'upload_media',
			entityTypeChirho: entityTypeChirho || 'media',
			entityIdChirho: entityIdChirho ? parseInt(entityIdChirho) : null,
			detailsChirho: JSON.stringify({
				keyChirho: resultChirho.keyChirho,
				sizeChirho: fileChirho.size,
				typeChirho: fileChirho.type
			}),
			createdAtChirho: new Date().toISOString()
		});

		return json({
			successChirho: true,
			dataChirho: {
				keyChirho: resultChirho.keyChirho,
				urlChirho: resultChirho.urlChirho,
				sizeChirho: fileChirho.size,
				typeChirho: fileChirho.type
			}
		});
	} catch (errorChirho) {
		console.error('Upload error:', errorChirho);
		return json({
			successChirho: false,
			errorChirho: 'Failed to upload file'
		}, { status: 500 });
	}
};

// GET - Retrieve file by key
export const GET: RequestHandler = async ({ url, locals }) => {
	const keyChirho = url.searchParams.get('key');

	if (!keyChirho) {
		return json({ successChirho: false, errorChirho: 'File key required' }, { status: 400 });
	}

	try {
		const r2Chirho = new R2HelperChirho(locals.platformChirho.R2_CHIRHO);
		const fileChirho = await r2Chirho.getFileChirho(keyChirho);

		if (!fileChirho) {
			return json({ successChirho: false, errorChirho: 'File not found' }, { status: 404 });
		}

		// Return the file with proper headers
		const headersChirho = new Headers();
		headersChirho.set('Content-Type', fileChirho.httpMetadata?.contentType || 'application/octet-stream');
		headersChirho.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

		return new Response(fileChirho.body, {
			headers: headersChirho
		});
	} catch (errorChirho) {
		console.error('Get file error:', errorChirho);
		return json({ successChirho: false, errorChirho: 'Failed to retrieve file' }, { status: 500 });
	}
};

// DELETE - Remove file
export const DELETE: RequestHandler = async ({ url, locals }) => {
	const userChirho = locals.userChirho;

	if (!userChirho) {
		return json({ successChirho: false, errorChirho: 'Authentication required' }, { status: 401 });
	}

	const allowedRolesChirho = ['admin', 'super_admin'];
	if (!allowedRolesChirho.includes(userChirho.roleChirho)) {
		return json({ successChirho: false, errorChirho: 'Insufficient permissions' }, { status: 403 });
	}

	const keyChirho = url.searchParams.get('key');

	if (!keyChirho) {
		return json({ successChirho: false, errorChirho: 'File key required' }, { status: 400 });
	}

	try {
		const r2Chirho = new R2HelperChirho(locals.platformChirho.R2_CHIRHO);
		await r2Chirho.deleteFileChirho(keyChirho);

		// Audit log
		const dbChirho = getDbChirho(locals.platformChirho);
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: parseInt(userChirho.userIdChirho),
			actionChirho: 'delete_media',
			entityTypeChirho: 'media',
			detailsChirho: JSON.stringify({ keyChirho }),
			createdAtChirho: new Date().toISOString()
		});

		return json({ successChirho: true, messageChirho: 'File deleted' });
	} catch (errorChirho) {
		console.error('Delete file error:', errorChirho);
		return json({ successChirho: false, errorChirho: 'Failed to delete file' }, { status: 500 });
	}
};
