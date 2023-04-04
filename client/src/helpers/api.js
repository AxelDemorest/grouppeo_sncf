import {message} from 'antd';
export const handleApiError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = error.response.status;
        const errorMessage = error.response.data.message || 'Une erreur est survenue';

        if (status === 401) {
            // Handle unauthorized errors
            message.error('Accès non authorisé');
            // Redirect to login page, for example
        } else {
            // Handle other errors
            message.error(errorMessage);
        }
    } else if (error.request) {
        // The request was made but no response was received
        message.error('Aucune réponse reçue');
    } else {
        // Something happened in setting up the request that triggered an Error
        message.error('Une erreur est survenue');
    }
};
