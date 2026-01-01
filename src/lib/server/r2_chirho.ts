// For God so loved the world that He gave His only begotten Son...

// R2 key patterns for organized storage
export const R2_PREFIXES_CHIRHO = {
	ORPHANAGE_LOGO: 'orphanage/logo/',
	ORPHANAGE_COVER: 'orphanage/cover/',
	ORPHANAGE_DOCS: 'orphanage/docs/',
	CHILD_PHOTO: 'child/photo/',
	NEED_IMAGE: 'need/image/',
	USER_AVATAR: 'user/avatar/'
} as const;

// Allowed MIME types for uploads
export const ALLOWED_IMAGE_TYPES_CHIRHO = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif'
] as const;

export const ALLOWED_DOC_TYPES_CHIRHO = [
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
] as const;

// Max file sizes (in bytes)
export const MAX_IMAGE_SIZE_CHIRHO = 5 * 1024 * 1024; // 5MB
export const MAX_DOC_SIZE_CHIRHO = 10 * 1024 * 1024; // 10MB

// R2 helper class
export class R2HelperChirho {
	constructor(private r2Chirho: R2Bucket) {}

	// ==========================================================================
	// UPLOAD HELPERS
	// ==========================================================================

	async uploadImageChirho(
		prefixChirho: string,
		idChirho: string,
		fileChirho: File | ArrayBuffer,
		mimeTypeChirho: string
	): Promise<{ keyChirho: string; urlChirho: string }> {
		// Validate MIME type
		if (!ALLOWED_IMAGE_TYPES_CHIRHO.includes(mimeTypeChirho as typeof ALLOWED_IMAGE_TYPES_CHIRHO[number])) {
			throw new Error(`Invalid image type: ${mimeTypeChirho}`);
		}

		// Get file data
		const dataChirho = fileChirho instanceof File ? await fileChirho.arrayBuffer() : fileChirho;

		// Validate size
		if (dataChirho.byteLength > MAX_IMAGE_SIZE_CHIRHO) {
			throw new Error(`Image too large. Max size: ${MAX_IMAGE_SIZE_CHIRHO / 1024 / 1024}MB`);
		}

		// Strip EXIF data for privacy (basic approach - remove everything after SOI marker for JPEG)
		const cleanedDataChirho = this.stripExifChirho(dataChirho, mimeTypeChirho);

		// Generate unique key
		const extensionChirho = this.getExtensionChirho(mimeTypeChirho);
		const keyChirho = `${prefixChirho}${idChirho}/${crypto.randomUUID()}.${extensionChirho}`;

		// Upload to R2
		await this.r2Chirho.put(keyChirho, cleanedDataChirho, {
			httpMetadata: {
				contentType: mimeTypeChirho,
				cacheControl: 'public, max-age=31536000' // 1 year cache
			},
			customMetadata: {
				uploadedAtChirho: new Date().toISOString(),
				originalSizeChirho: dataChirho.byteLength.toString()
			}
		});

		return {
			keyChirho,
			urlChirho: `/api-chirho/media-chirho/${keyChirho}`
		};
	}

	async uploadDocumentChirho(
		prefixChirho: string,
		idChirho: string,
		fileChirho: File | ArrayBuffer,
		mimeTypeChirho: string,
		fileNameChirho: string
	): Promise<{ keyChirho: string }> {
		// Validate MIME type
		if (!ALLOWED_DOC_TYPES_CHIRHO.includes(mimeTypeChirho as typeof ALLOWED_DOC_TYPES_CHIRHO[number])) {
			throw new Error(`Invalid document type: ${mimeTypeChirho}`);
		}

		const dataChirho = fileChirho instanceof File ? await fileChirho.arrayBuffer() : fileChirho;

		if (dataChirho.byteLength > MAX_DOC_SIZE_CHIRHO) {
			throw new Error(`Document too large. Max size: ${MAX_DOC_SIZE_CHIRHO / 1024 / 1024}MB`);
		}

		const extensionChirho = this.getExtensionChirho(mimeTypeChirho);
		const keyChirho = `${prefixChirho}${idChirho}/${crypto.randomUUID()}.${extensionChirho}`;

		await this.r2Chirho.put(keyChirho, dataChirho, {
			httpMetadata: {
				contentType: mimeTypeChirho,
				contentDisposition: `attachment; filename="${fileNameChirho}"`
			},
			customMetadata: {
				uploadedAtChirho: new Date().toISOString(),
				originalNameChirho: fileNameChirho
			}
		});

		return { keyChirho };
	}

	// ==========================================================================
	// RETRIEVAL HELPERS
	// ==========================================================================

	async getObjectChirho(keyChirho: string): Promise<R2ObjectBody | null> {
		return await this.r2Chirho.get(keyChirho);
	}

	async getObjectMetadataChirho(keyChirho: string): Promise<R2Object | null> {
		return await this.r2Chirho.head(keyChirho);
	}

	// ==========================================================================
	// DELETE HELPERS
	// ==========================================================================

	async deleteObjectChirho(keyChirho: string): Promise<void> {
		await this.r2Chirho.delete(keyChirho);
	}

	async deleteObjectsChirho(keysChirho: string[]): Promise<void> {
		await this.r2Chirho.delete(keysChirho);
	}

	// Delete all objects with a prefix (e.g., all images for a child)
	async deleteByPrefixChirho(prefixChirho: string): Promise<number> {
		let deletedChirho = 0;
		let cursorChirho: string | undefined;

		do {
			const listChirho = await this.r2Chirho.list({
				prefix: prefixChirho,
				cursor: cursorChirho
			});

			if (listChirho.objects.length > 0) {
				const keysChirho = listChirho.objects.map(objChirho => objChirho.key);
				await this.r2Chirho.delete(keysChirho);
				deletedChirho += keysChirho.length;
			}

			cursorChirho = listChirho.truncated ? listChirho.cursor : undefined;
		} while (cursorChirho);

		return deletedChirho;
	}

	// ==========================================================================
	// UTILITY HELPERS
	// ==========================================================================

	private getExtensionChirho(mimeTypeChirho: string): string {
		const mapChirho: Record<string, string> = {
			'image/jpeg': 'jpg',
			'image/png': 'png',
			'image/webp': 'webp',
			'image/gif': 'gif',
			'application/pdf': 'pdf',
			'application/msword': 'doc',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
		};
		return mapChirho[mimeTypeChirho] || 'bin';
	}

	// Basic EXIF stripping for privacy - removes metadata from JPEG
	private stripExifChirho(dataChirho: ArrayBuffer, mimeTypeChirho: string): ArrayBuffer {
		if (mimeTypeChirho !== 'image/jpeg') {
			return dataChirho;
		}

		// For JPEG, we do a simple approach: look for EXIF markers and remove them
		// This is a basic implementation - for production, use a proper library
		const viewChirho = new Uint8Array(dataChirho);

		// JPEG starts with FF D8
		if (viewChirho[0] !== 0xFF || viewChirho[1] !== 0xD8) {
			return dataChirho;
		}

		// Find and remove APP1 (EXIF) segments (FF E1)
		const cleanedChirho: number[] = [0xFF, 0xD8];
		let iChirho = 2;

		while (iChirho < viewChirho.length - 1) {
			if (viewChirho[iChirho] === 0xFF) {
				const markerChirho = viewChirho[iChirho + 1];

				// Skip APP1 (EXIF) segments
				if (markerChirho === 0xE1) {
					const lengthChirho = (viewChirho[iChirho + 2] << 8) + viewChirho[iChirho + 3];
					iChirho += 2 + lengthChirho;
					continue;
				}

				// Copy other segments
				if (markerChirho >= 0xE0 && markerChirho <= 0xEF && markerChirho !== 0xE1) {
					// APP segments have length
					const lengthChirho = (viewChirho[iChirho + 2] << 8) + viewChirho[iChirho + 3];
					for (let jChirho = 0; jChirho < 2 + lengthChirho && iChirho + jChirho < viewChirho.length; jChirho++) {
						cleanedChirho.push(viewChirho[iChirho + jChirho]);
					}
					iChirho += 2 + lengthChirho;
				} else {
					// Copy the rest as-is
					while (iChirho < viewChirho.length) {
						cleanedChirho.push(viewChirho[iChirho++]);
					}
				}
			} else {
				cleanedChirho.push(viewChirho[iChirho++]);
			}
		}

		return new Uint8Array(cleanedChirho).buffer;
	}
}

// Helper to get R2 from platform
export function getR2Chirho(platform: App.Platform | undefined): R2HelperChirho {
	if (!platform?.env?.R2_CHIRHO) {
		throw new Error('R2 not available - are you running in Cloudflare environment?');
	}
	return new R2HelperChirho(platform.env.R2_CHIRHO);
}
