const HEADERS_DATABASE = {
    "Date-départ": "train_date",
    "N°-train": "train_number",
    "Heure-départ": "train_hour",
    "Destination": "group_destination",
    "Nom-groupe": "group_name",
    "Nombre-pax": "group_total_travellers",
    "N°-voiture": "group_car_number",
    "Type-Groupe": "group_type",
    "TM": "group_prestation",
    "POINT-DE-RDV": "group_meeting_point",
    "Heure-de-RDV": "group_meeting_time",
    "Nom-organisateur": "group_responsable_departure_day",
    "Tél-organisateur": "group_responsable_phone_departure_day",
    "Mail": "group_mail",
};

const transformElementByHeader = (element, headersFormat) => {
    switch (headersFormat.trim()) {
        case "train_hour":
        case "group_meeting_time":
            return element.split(' ')[1] || '';
        case "train_date":
            return new Date(element).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }) || '';
        case "group_prestation":
            return element === 'TM';
        default:
            return element.toString().trim();
    }
}

export const convertToJson = (headers, data) => {
    return data
        .filter(row => row.length > 0)
        .map(row =>
            row.reduce((rowData, element, index) => {
                const headersFormat = HEADERS_DATABASE[headers[index].trim().replace(/ /g, '-')];

                if (!headersFormat) return rowData;

                const transformedElement = transformElementByHeader(element, headersFormat);

                return { ...rowData, [headersFormat]: transformedElement }
            }, {})
        );
};
