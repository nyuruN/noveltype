
export default {
    /**
     * Resolve paths
     */
    resolve(...segments: string[]) {
        let resolved = '';
        for (const segment of segments) {
            if (!resolved || segment.startsWith('/')) {
                resolved = segment;
            } else {
                resolved = `${resolved.replace(/\/$/, '')}/${segment}`;
            }
        }
        // Normalize path (resolve `..` and `.`)
        const parts = resolved.split('/');
        const resolvedParts = [];
        for (const part of parts) {
            if (part === '..') {
                resolvedParts.pop();
            } else if (part !== '.' && part !== '') {
                resolvedParts.push(part);
            }
        }
        return '/' + resolvedParts.join('/');
    },
    /**
     * Get parent directory
     */
    dirname(pathStr: string) {
        const lastSlash = pathStr.lastIndexOf('/');
        return lastSlash >= 0 ? pathStr.slice(0, lastSlash) : '';
    },
}