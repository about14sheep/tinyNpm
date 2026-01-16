export function getTimeAgo(publishDate: string): string {
    const published = new Date(publishDate);
    const now = new Date();
    const diffMs = now.getTime() - published.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {return 'published today';}
    if (diffDays === 1) {return 'published 1 day ago';}
    if (diffDays < 30) {return `published ${diffDays} days ago`;}
    if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `published ${months} month${months > 1 ? 's': ''} ago`;
    }

    const years = Math.floor(diffDays / 365);
    return `published ${years} year${years > 1 ? 's' : ''}`;
}