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

const h = (token) => ({
  Authorization: `Bearer ${token}`,
});

const hj = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const parseResponse = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const safeFetch = async (url, options = {}) => {
  const res = await fetch(url, options);
  const body = await parseResponse(res);

  if (!res.ok) {
    throw new Error(
      typeof body === "string" ? body : body?.error || body?.message || "Error del servidor"
    );
  }

  return body;
};

// AUTH
export const login = async (usuario, password) =>
  safeFetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  });

// USUARIOS
export const getUsuarios = (token) =>
  safeFetch(`${API}/admin/usuarios`, { headers: h(token) });

export const getUsuariosInactivos = (token) =>
  safeFetch(`${API}/admin/usuarios/inactivos`, { headers: h(token) });

export const crearUsuario = (token, body) =>
  safeFetch(`${API}/admin/crear`, {
    method: "POST",
    headers: hj(token),
    body: JSON.stringify(body),
  });

export const eliminarUsuario = (token, id) =>
  safeFetch(`${API}/admin/eliminar/${id}`, {
    method: "DELETE",
    headers: h(token),
  });

export const reactivarUsuario = (token, id) =>
  safeFetch(`${API}/admin/reactivar/${id}`, {
    method: "PUT",
    headers: h(token),
  });

// ALMACENES
export const getAlmacenes = (token) =>
  safeFetch(`${API}/admin/almacenes`, { headers: h(token) });

export const getAlmacenesInactivos = (token) =>
  safeFetch(`${API}/admin/almacenes/inactivos`, { headers: h(token) });

export const crearAlmacen = (token, body) =>
  safeFetch(`${API}/admin/almacenes`, {
    method: "POST",
    headers: hj(token),
    body: JSON.stringify(body),
  });

export const eliminarAlmacen = (token, id) =>
  safeFetch(`${API}/admin/almacenes/${id}`, {
    method: "DELETE",
    headers: h(token),
  });

export const reactivarAlmacen = (token, id) =>
  safeFetch(`${API}/admin/almacenes/reactivar/${id}`, {
    method: "PUT",
    headers: h(token),
  });

// Alias público para user dashboard
export const getAlmacenesPublic = (token) =>
  safeFetch(`${API}/admin/almacenes`, { headers: h(token) });

// ASISTENCIAS
export const registrarAsistencia = (token, bodyOrAlmacenId) => {
  const payload =
    typeof bodyOrAlmacenId === "object"
      ? bodyOrAlmacenId
      : { almacenId: bodyOrAlmacenId };

  return safeFetch(`${API}/user/asistencia`, {
    method: "POST",
    headers: hj(token),
    body: JSON.stringify(payload),
  });
};

export const getMisAsistencias = (token) =>
  safeFetch(`${API}/user/asistencias`, {
    headers: h(token),
  });

export const getMisAsistenciasDeUsuario = (token, usuarioId) =>
  safeFetch(`${API}/admin/usuarios/${usuarioId}/asistencias`, {
    headers: h(token),
  });

// PAGOS EXTRA / ADELANTOS / PAGOS
export const getPagosExtra = (token) =>
  safeFetch(`${API}/admin/pagos-extra`, {
    headers: h(token),
  });

export const getPagosExtraDeUsuario = (token, usuarioId) =>
  safeFetch(`${API}/admin/usuarios/${usuarioId}/pagos-extra`, {
    headers: h(token),
  });

export const getMisPagosExtra = (token) =>
  safeFetch(`${API}/user/pagos-extra`, {
    headers: h(token),
  });

export const crearPagoExtra = (token, body) =>
  safeFetch(`${API}/admin/pagos-extra`, {
    method: "POST",
    headers: hj(token),
    body: JSON.stringify(body),
  });

export const registrarPagoExtra = (token, motivo, monto) =>
  safeFetch(`${API}/user/pagos-extra`, {
    method: "POST",
    headers: hj(token),
    body: JSON.stringify({ motivo, monto }),
  });

export const eliminarPagoExtra = (token, id) =>
  safeFetch(`${API}/admin/pagos-extra/${id}`, {
    method: "DELETE",
    headers: h(token),
  });

export const marcarPagoCompleto = (token, usuarioId) =>
  safeFetch(`${API}/admin/pagos/${usuarioId}/completar`, {
    method: "PUT",
    headers: h(token),
  });

export const registrarAdelanto = (token, usuarioId, monto) =>
  safeFetch(`${API}/admin/adelantos`, {
    method: "POST",
    headers: hj(token),
    body: JSON.stringify({ usuarioId, monto }),
  });

// DASHBOARD / REPORTES / TOTALES
export const getDashboard = (token) =>
  safeFetch(`${API}/admin/dashboard`, {
    headers: h(token),
  });

export const getReporte = (token) =>
  safeFetch(`${API}/admin/reporte`, {
    headers: h(token),
  });

export const getReporteUsuarios = (token) =>
  safeFetch(`${API}/admin/reporte/usuarios`, {
    headers: h(token),
  });

export const getPagosPorFechas = (token, desde, hasta) =>
  safeFetch(`${API}/admin/pagos?desde=${desde}&hasta=${hasta}`, {
    headers: h(token),
  });

export const getMiTotal = async (token) => {
  const data = await safeFetch(`${API}/user/total`, {
    headers: h(token),
  });

  if (typeof data === "number") return data;
  return data?.total ?? data?.monto ?? data?.neto ?? 0;
};

// NOTIFICACIONES
export const getNotificaciones = (token) =>
  safeFetch(`${API}/user/notificaciones`, {
    headers: h(token),
  });

export const confirmarNotif = (token, id) =>
  safeFetch(`${API}/user/notificaciones/${id}/confirmar`, {
    method: "PUT",
    headers: h(token),
  });