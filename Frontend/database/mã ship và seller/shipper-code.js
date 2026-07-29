/** Tạo Shipper ID: SP-MÃ_KHU_VỰC-ID_4_CHỮ_SỐ, ví dụ SP-BT-0012. */
export function buildShipperCode({ regionCode, id }) {
  const region = String(regionCode).trim().toUpperCase();
  if (!/^[A-Z0-9]{2,4}$/.test(region)) throw new Error('Mã khu vực không hợp lệ.');
  if (!Number.isInteger(id) || id < 1) throw new Error('ID shipper không hợp lệ.');
  return `SP-${region}-${String(id).padStart(4, '0')}`;
}
