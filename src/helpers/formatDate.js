import dayjs from "./dayjsConfig";

export const formatearFecha = (date) => {
    return dayjs(date).tz("America/Guatemala", false).format("YYYY-MM-DD");
};
export const formatearHora = (date) => {
    console.log(date);
    
    return dayjs(date).tz("America/Guatemala", false).format("HH:mm");
};