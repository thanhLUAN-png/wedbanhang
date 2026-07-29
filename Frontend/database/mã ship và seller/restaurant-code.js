/**
 * Tạo mã quán theo: MÃ_VÙNG-LAT_RÚT_GỌN LNG_RÚT_GỌN-ID_4_CHỮ_SỐ.
 * Ví dụ: BT + 10.74103 + 106.61118 + id 42 => BT-74101118-0042.
 */
export function buildRestaurantCode({ regionCode, latitude, longitude, id }) {
  const region = String(regionCode).trim().toUpperCase();
  if (!/^[A-Z0-9]{2,4}$/.test(region)) throw new Error('Mã vùng không hợp lệ.');
  if (!Number.isInteger(id) || id < 1) throw new Error('ID quán không hợp lệ.');

  const latitudePart = coordinatePart(latitude, 'first');
  const longitudePart = coordinatePart(longitude, 'last');
  return `${region}-${latitudePart}${longitudePart}-${String(id).padStart(4, '0')}`;
}

function coordinatePart(value, direction) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error('Tọa độ không hợp lệ.');
  const decimal = Math.abs(number).toFixed(5).split('.')[1];
  return direction === 'first' ? decimal.slice(0, 4) : decimal.slice(-4);
}
