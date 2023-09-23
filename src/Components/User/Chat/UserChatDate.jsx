import React from "react";
import { format } from "date-fns-tz";

function formatDate(date) {
  const zoneHour = "America/Sao_Paulo";

  const dataFormated = format(new Date(date), "HH:mm dd-MM", {
    timeZone: zoneHour,
  });

  return dataFormated;
}

export default formatDate;
