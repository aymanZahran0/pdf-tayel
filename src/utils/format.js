export const arabicNumber = value => String(value).replace(/\d/g, digit => '٠١٢٣٤٥٦٧٨٩'[digit]);
export const formatSize = bytes => bytes >= 1e6 ? `${arabicNumber((bytes/1e6).toFixed(1))} م.ب` : `${arabicNumber(Math.round(bytes/1000))} ك.ب`;
