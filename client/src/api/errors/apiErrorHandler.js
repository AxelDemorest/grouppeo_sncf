import { message } from 'antd';

export const handleApiError = (error) => {
    let errorMessage = 'Une erreur est survenue';

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = error.response.status;
        errorMessage = error.response.data.message || errorMessage;

        switch (status) {
            case 401:  // Unauthorized
                message.error('Accès non autorisé');
                // Redirect to login page or handle logout
                // Here you can insert logout or redirection logic
                break;
            case 403:  // Forbidden
                message.error('Accès interdit');
                break;
            case 404:  // Not Found
                message.error('Ressource non trouvée');
                break;
            case 500:  // Internal Server Error
                message.error('Erreur interne du serveur');
                break;
            default:
                message.error(errorMessage);
                break;
        }
    } else if (error.request) {
        // The request was made but no response was received
        message.error('Aucune réponse reçue du serveur. Veuillez vérifier votre connexion.');
    } else {
        // Something happened in setting up the request that triggered an Error
        message.error(errorMessage);
    }

    return {
        success: false,
        message: errorMessage,
        originalError: error,
    };
};





