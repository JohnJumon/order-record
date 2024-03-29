export const formatPriceAsRupiah = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    }).format(price);
};

export const getStatus = (status: number): string => {
    return status === 0 ? "Order" : status === 1 ? "Pick Up" : status === 2 ? "Dikirim" : status === 3 ? "Selesai" : status === 4 ? "Sold Out" : "Unknown";
};

export const getPaymentStatus = (status: boolean): string => {
    return status ? "Lunas" : "Belum Lunas"
}

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    const optionsDate: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Jakarta',
    };

    const formattedDate = new Intl.DateTimeFormat('id-ID', optionsDate).format(date);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const formattedTime = `${hours}.${minutes}.${seconds}`;

    return `${formattedDate}, ${formattedTime}`;
};