/**
 * Cleans username by removing common suffixes like "_google", "_web3", etc.
 * @param {string} username - The username to clean
 * @returns {string} - The cleaned username
 */
export const cleanUsername = (username) => {
    if (!username || typeof username !== 'string') {
        return username || '';
    }
    
    // Remove common authentication provider suffixes
    return username
        .replace(/_google$/i, '')
        .replace(/_web3$/i, '')
        .replace(/_facebook$/i, '')
        .replace(/_twitter$/i, '')
        .replace(/_discord$/i, '');
};



