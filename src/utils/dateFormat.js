// Utility functions for date formatting

export const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';

    try {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (error) {
        return 'Không xác định';
    }
};

export const formatDateTime = (dateString) => {
    if (!dateString) return 'Không xác định';

    try {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        return 'Không xác định';
    }
};

export const formatDateRelative = (dateString) => {
    if (!dateString) return 'Không xác định';

    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return 'Hôm nay';
        } else if (diffInDays === 1) {
            return 'Hôm qua';
        } else if (diffInDays < 7) {
            return `${diffInDays} ngày trước`;
        } else {
            return formatDate(dateString);
        }
    } catch (error) {
        return 'Không xác định';
    }
};
