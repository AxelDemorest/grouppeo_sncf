export const dateFormatter = (inputDate = new Date()) => {
    return inputDate.toLocaleDateString(
        'fr-FR',
        { year: 'numeric', month: '2-digit', day: '2-digit' }
    ).replace(/\//g, '-');
}
