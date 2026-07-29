/** Tạo Seller ID: SL-MÃ_KHU_VỰC-ID_4_CHỮ_SỐ, ví dụ SL-BT-0001. */
export function buildSellerCode({ regionCode, id }) {
  const region = String(regionCode).trim().toUpperCase();
  if (!/^[A-Z0-9]{2,4}$/.test(region)) throw new Error('Mã khu vực không hợp lệ.');
  if (!Number.isInteger(id) || id < 1) throw new Error('ID seller không hợp lệ.');
  return `SL-${region}-${String(id).padStart(4, '0')}`;
}
