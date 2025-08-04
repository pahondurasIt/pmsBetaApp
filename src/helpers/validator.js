import dayjs from "./dayjsConfig";

export const isValidText = (value) => {
  return value === "" || value === null || value === undefined ? false : true;
};

export const isValidNumber = (value) => {
  return value === "" || value === null || value === undefined || isNaN(value)
    ? false
    : true;
};

export const isValidRangeDate = (startDate, endDate) => {
  console.log(
    dayjs(new Date(endDate)).diff(dayjs(new Date(startDate)), "minute")
  );

  return startDate === "" ||
    startDate === null ||
    startDate === undefined ||
    endDate === "" ||
    endDate === null ||
    endDate === undefined ||
    dayjs(new Date(startDate)).isAfter(dayjs(new Date(endDate)))
    ? false
    : true;
};

export const validResponse = (response) => {
  return response.status >= 200 && response.status < 300 ? true : false;
};
