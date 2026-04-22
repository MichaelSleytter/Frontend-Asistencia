const normalizeBaseUrl = (value) => (value || "").trim().replace(/\/+$/, "");

const resolveApiBase = () => {
  const envUrl = normalizeBaseUrl(process.env.REACT_APP_API_URL);
  if (envUrl) return envUrl;

  if (typeof window !== "undefined") {
    const { hostname } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:8080";
    }
    return "/api";
  }

  return "http://localhost:8080";
};

const API = resolveApiBase();

const h  = (token) => ({ Authorization: "Bearer " + token });
const hj = (token) => ({ "Content-Type": "application/json", Authorization: "Bearer " + token });

// Parsea la respuesta ya sea JSON o texto plano, sin crashear
const parseResponse = async (res) => {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
};

// Fetch que lanza error con el mensaje del backend si no es ok
const safeFetch = async (url, options = {}) => {
  const res = await fetch(url, options);
  const body = await parseResponse(res);
  if (!res.ok) throw new Error(typeof body === "string" ? body : body?.error || "Error del servidor");
  return body;
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const login = async (usuario, password) => {
  return safeFetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  });
};

// ─── USUARIOS ─────────────────────────────────────────────────────────────────
export const getUsuarios          = (token)       => safeFetch(`${API}/admin/usuarios`,                { headers: h(token) });
export const getUsuariosInactivos = (token)       => safeFetch(`${API}/admin/usuarios/inactivos`,      { headers: h(token) });
export const crearUsuario         = (token, body) => safeFetch(`${API}/admin/crear`,                   { method: "POST",   headers: hj(token), body: JSON.stringify(body) });
export const eliminarUsuario      = (token, id)   => safeFetch(`${API}/admin/eliminar/${id}`,          { method: "DELETE", headers: h(token) });
export const reactivarUsuario     = (token, id)   => safeFetch(`${API}/admin/reactivar/usuario/${id}`, { method: "PUT",    headers: h(token) });

// ─── ALMACENES ────────────────────────────────────────────────────────────────
export const getAlmacenes          = (token)       => safeFetch(`${API}/admin/almacenes`,                { headers: h(token) });
export const getAlmacenesPublic    = (token)       => safeFetch(`${API}/public/almacenes`,               { headers: h(token) });
export const getAlmacenesInactivos = (token)       => safeFetch(`${API}/admin/almacenes/inactivos`,      { headers: h(token) });
export const crearAlmacen          = (token, body) => safeFetch(`${API}/admin/almacenes`,                { method: "POST",   headers: hj(token), body: JSON.stringify(body) });
export const eliminarAlmacen       = (token, id)   => safeFetch(`${API}/admin/almacenes/${id}`,          { method: "DELETE", headers: h(token) });
export const reactivarAlmacen      = (token, id)   => safeFetch(`${API}/admin/reactivar/almacen/${id}`,  { method: "PUT",    headers: h(token) });

// ─── ASISTENCIAS ──────────────────────────────────────────────────────────────
export const getMisAsistencias         = (token)        => safeFetch(`${API}/asistencias/mis`,                    { headers: h(token) });
export const getMiTotal                = (token)        => safeFetch(`${API}/asistencias/mi-total`,               { headers: h(token) });
export const getMisPagosExtra          = (token)        => safeFetch(`${API}/asistencias/mis-pagos-extra`,        { headers: h(token) });
export const registrarAsistencia       = (token, almId) => safeFetch(`${API}/asistencias/almacen?almacenId=${almId}`, { method: "POST", headers: h(token) });
export const getMisAsistenciasDeUsuario= (token, uid)   => safeFetch(`${API}/admin/usuarios/${uid}/asistencias`,  { headers: h(token) });
export const getPagosExtraDeUsuario    = (token, uid)   => safeFetch(`${API}/admin/usuarios/${uid}/pagos-extra`,  { headers: h(token) });

// ─── PAGOS EXTRA ──────────────────────────────────────────────────────────────
export const registrarPagoExtra = (token, motivo, monto) =>
  safeFetch(`${API}/asistencias/pago-extra`, { method: "POST", headers: hj(token), body: JSON.stringify({ motivo, monto }) });

// ─── PAGO / ADELANTO (ADMIN) ──────────────────────────────────────────────────
export const marcarPagoCompleto = (token, uid)        => safeFetch(`${API}/admin/usuarios/${uid}/pago-completo`, { method: "POST", headers: h(token) });
export const registrarAdelanto  = (token, uid, monto) => safeFetch(`${API}/admin/usuarios/${uid}/adelanto`,      { method: "POST", headers: hj(token), body: JSON.stringify({ monto }) });

// ─── NOTIFICACIONES (ESTIBADOR) ───────────────────────────────────────────────
export const getNotificaciones = (token)    => safeFetch(`${API}/asistencias/notificaciones`,                  { headers: h(token) });
export const confirmarNotif    = (token, id)=> safeFetch(`${API}/asistencias/notificaciones/${id}/confirmar`,  { method: "POST", headers: h(token) });

// ─── REPORTE ──────────────────────────────────────────────────────────────────
export const getReporte = (token) => safeFetch(`${API}/admin/reportes/usuarios`, { headers: h(token) });
