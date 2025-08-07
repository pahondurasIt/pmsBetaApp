import dayjs from "./dayjsConfig";

export const formatearFecha = (date) => {
  return dayjs(date).tz("America/Guatemala", false).format("YYYY-MM-DD");
};
export const formatearHora = (date) => {
  const fechaCompleta = `${dayjs()
    .tz("America/Guatemala", false)
    .format("YYYY-MM-DD")} ${date}`;
  return dayjs(fechaCompleta).tz("America/Guatemala", false).format("HH:mm a");
};
