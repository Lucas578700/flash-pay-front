import dayjs from "dayjs";

function formatDate(data) {
  if (!data) {
    return "";
  }
  return dayjs(data).format('DD/MM/YYYY')
}

export default formatDate;
