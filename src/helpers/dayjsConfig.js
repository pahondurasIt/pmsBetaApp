import dayjs from "dayjs";
import 'dayjs/locale/es';
dayjs.locale('es');
// Import plugins

import utc from "dayjs/plugin/utc";

import timezone from "dayjs/plugin/timezone";



// Extend dayjs with plugins

dayjs.extend(utc);

dayjs.extend(timezone);



// Set the default timezone

dayjs.tz.setDefault("America/Guatemala");

// Override the format method to set a default format

dayjs.extend((option, dayjsClass, dayjsFactory) => {

    const oldFormat = dayjsClass.prototype.format;

    dayjsClass.prototype.format = function (formatString) {

        return oldFormat.bind(this)(formatString ?? "YYYY-MM-DD");

    };

});

dayjs.locale('de')

// Export the configured dayjs

export default dayjs;
