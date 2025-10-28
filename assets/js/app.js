const $ = (s)=>document.querySelector(s);
const byId = (id)=>document.getElementById(id);
const uid = (p)=>`${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
const fmtMoney = (n)=> `RD$ ${Number(n||0).toLocaleString("es-DO",{maximumFractionDigits:2})}`;
const API_URL = "https://sheetdb.io/api/v1/avsi1ki6gcrlr";

let RAW=[], CLIENTES=[], PEDIDOS=[], PAGOS=[];
let splashMinTimeDone=false, dataLoaded=false;
let previewTempFactura=null;

// Splash
function showSplash(){ byId("splash").classList.remove("hide"); }
function hideSplash(){ byId("splash").classList.add("hide"); }

// Nav
document.querySelectorAll("[data-nav]").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll("[data-nav]").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.getAttribute("data-nav");
    document.querySelectorAll(".tab").forEach(t=>t.style.display="none");
    document.querySelector(`.tab-${tab}`).style.display="block";
  });
});

byId("endpointView").textContent = API_URL;
byId("btnRecargar").onclick = ()=> loadAll(true);

// API
async function apiList(){
  const res = await fetch(API_URL);
  if(!res.ok) throw new Error("No se pudo leer la hoja");
  return res.json();
}
async function apiInsert(obj){
  const res = await fetch(API_URL, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ data:[obj] })
  });
  if(!res.ok) throw new Error("No se pudo insertar");
  return res.json();
}

// Toast
function showToast(text="Listo ✅"){
  const t = byId("toast");
  t.textContent = text;
  t.classList.add("show");
  setTimeout(()=> t.classList.remove("show"), 3000);
}

// Load
async function loadAll(showAlert){
  const data = await apiList();
  RAW = Array.isArray(data) ? data : [];
  CLIENTES = RAW.filter(r => (r.tipo||'').toLowerCase()==='cliente');
  PEDIDOS  = RAW.filter(r => (r.tipo||'').toLowerCase()==='pedido');
  PAGOS    = RAW.filter(r => (r.tipo||'').toLowerCase()==='pago');

  fillSelects();
  renderKPIs();
  renderClientes();
  renderPedidos();
  renderPagos();

  dataLoaded = true;
  if(splashMinTimeDone) hideSplash();
  if(showAlert) alert("✅ Datos recargados");
}

function fillSelects(){
  const pCliente = byId("pCliente");
  const payCliente = byId("payCliente");
  pCliente.innerHTML = `<option value="">— Elegir cliente —</option>`;
  payCliente.innerHTML = `<option value="">— Elegir cliente —</option>`;
  CLIENTES.forEach(c=>{
    const opt = `<option value="${c.id}">${c.nombre||"(sin nombre)"} — ${c.telefono||""}</option>`;
    pCliente.insertAdjacentHTML("beforeend", opt);
    payCliente.insertAdjacentHTML("beforeend", opt);
  });
  payCliente.onchange = ()=> fillPedidosByCliente(payCliente.value);
  fillPedidosByCliente(payCliente.value);
}
function fillPedidosByCliente(clienteId){
  const payPedido = byId("payPedido");
  payPedido.innerHTML = `<option value="">— Elegir pedido —</option>`;
  const arr = PEDIDOS.filter(p=> (p.cliente_id||"") === clienteId);
  arr.forEach(p=>{
    const label = `${p.articulo||"(Art.)"} — ${fmtMoney(calcTotalPedido(p))}`;
    payPedido.insertAdjacentHTML("beforeend", `<option value="${p.id}">${label}</option>`);
  });
}

// Renders
function renderKPIs(){
  const vendido = PEDIDOS.reduce((a,p)=>a+calcTotalPedido(p),0);
  const cobrado = PAGOS.reduce((a,pg)=>a+Number(pg.abono||0),0);
  byId("kpiClientes").textContent = CLIENTES.length;
  byId("kpiPedidos").textContent = PEDIDOS.length;
  byId("kpiVendido").textContent = fmtMoney(vendido);
  byId("kpiCobrado").textContent = fmtMoney(cobrado);
}
function renderClientes(){
  const box = byId("listaClientes");
  box.innerHTML="";
  CLIENTES.forEach(c=>{
    const pedidos = PEDIDOS.filter(p=>p.cliente_id===c.id);
    const totalVendido = pedidos.reduce((acc,p)=>acc+calcTotalPedido(p),0);
    const pagos = PAGOS.filter(pg=>pg.cliente_id===c.id);
    const totalAbonos = pagos.reduce((acc,pg)=>acc+Number(pg.abono||0),0);
    const pendiente = totalVendido - totalAbonos;
    const html = `
      <div class="item">
        <div style="display:flex;justify-content:space-between;gap:8px">
          <div><strong>${c.nombre||"(Sin nombre)"}</strong><div class="muted">📞 ${c.telefono||"-"} • ${c.email||""}</div></div>
          <div class="pill">${pedidos.length} pedido(s)</div>
        </div>
        <div style="display:flex;gap:18px;margin-top:6px;flex-wrap:wrap">
          <div><strong>Total:</strong> ${fmtMoney(totalVendido)}</div>
          <div><strong>Cobrado:</strong> ${fmtMoney(totalAbonos)}</div>
          <div><strong>Pendiente:</strong> ${fmtMoney(pendiente)}</div>
        </div>
        ${c.notas?`<div class="muted" style="margin-top:6px">📝 ${c.notas}</div>`:""}
      </div>`;
    box.insertAdjacentHTML("beforeend", html);
  });
}
function renderPedidos(){
  const box = byId("listaPedidos"); box.innerHTML="";
  const list = [...PEDIDOS].sort((a,b)=> (new Date(b.fecha||0)) - (new Date(a.fecha||0)));
  list.forEach(p=>{
    const cli = CLIENTES.find(c=>c.id===p.cliente_id);
    const pagos = PAGOS.filter(pg=>pg.pedido_id===p.id);
    const cobrado = pagos.reduce((acc,pg)=>acc+Number(pg.abono||0),0);
    const total = calcTotalPedido(p);
    const pendiente = total - cobrado;
    const html = `
      <div class="item">
        <div style="display:flex;justify-content:space-between;gap:8px">
          <div><strong>${p.articulo||"(Artículo)"}</strong> <span class="muted">• ${p.fecha||""}</span></div>
          <div class="pill">${(p.estado||"pendiente")}</div>
        </div>
        <div class="muted">Cliente: ${cli? (cli.nombre||"-"):"(desconocido)"} • Tracking: ${p.tracking||"-"} ${p.factura?`• Factura: ${p.factura}`:""}</div>
        <div style="display:flex;gap:18px;margin-top:6px;flex-wrap:wrap">
          <div><strong>Total:</strong> ${fmtMoney(total)}</div>
          <div><strong>Cobrado:</strong> ${fmtMoney(cobrado)}</div>
          <div><strong>Pendiente:</strong> ${fmtMoney(pendiente)}</div>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
          <input type="number" placeholder="Abono (RD$)" id="i_${p.id}" style="max-width:220px">
          <button class="btn ok" onclick="registrarAbono('${p.cliente_id}','${p.id}')">Registrar abono</button>
          <button class="btn secondary" onclick="openPreview('${p.id}')">👁️ Vista previa</button>
        </div>
      </div>`;
    box.insertAdjacentHTML("beforeend", html);
  });
}
function renderPagos(){
  const box = byId("listaPagos"); box.innerHTML="";
  const list = [...PAGOS].sort((a,b)=> (new Date(b.fecha||0)) - (new Date(a.fecha||0))).slice(0,20);
  list.forEach(pg=>{
    const cli = CLIENTES.find(c=>c.id===pg.cliente_id);
    const ped = PEDIDOS.find(p=>p.id===pg.pedido_id);
    const html = `
      <div class="item">
        <div style="display:flex;justify-content:space-between;gap:8px">
          <div><strong>Abono:</strong> ${fmtMoney(pg.abono)}</div>
          <div class="muted">${pg.fecha||""}</div>
        </div>
        <div class="muted">Cliente: ${cli? (cli.nombre||"-"):"-"} • Pedido: ${ped? (ped.articulo||"-"):"-"} ${pg.factura?`• Factura: ${pg.factura}`:""}</div>
      </div>`;
    box.insertAdjacentHTML("beforeend", html);
  });
}

// Helpers
function calcTotalPedido(p){
  const v = Number(p.valor||0), pr = Number(p.porc||0), lb = Number(p.libra||0);
  const tSheet = Number(p.total||0);
  const tCalc = v + (v * pr / 100) + lb;
  return tSheet>0 ? tSheet : tCalc;
}
function facturaCode(){
  const d = new Date();
  const pad = (n)=> String(n).padStart(2,'0');
  return `FAC-${d.getFullYear()}-${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
function normalizePhone(raw){
  let digits = (raw||"").replace(/\D/g,'');
  if(digits.startsWith("1") && digits.length===11) return digits;
  if(digits.length===10) return "1"+digits; // RD default
  if(digits.length>0) return digits; // fallback
  return "";
}
function buildWhatsappMessage({nombre, articulo, total, cobrado, pendiente, estado, tracking, factura}){
  return `Hola ${nombre||""} 👋

Factura ${factura||"-"}
🛍 Artículo: ${articulo||"-"}
💰 Total: RD$ ${Number(total||0).toLocaleString("es-DO",{maximumFractionDigits:2})}
💵 Pagado: RD$ ${Number(cobrado||0).toLocaleString("es-DO",{maximumFractionDigits:2})}
💸 Pendiente: RD$ ${Number(pendiente||0).toLocaleString("es-DO",{maximumFractionDigits:2})}
📦 Estado: ${estado||"-"}
🔗 Tracking: ${tracking||"-"}

Gracias por confiar en Liss Variedades 🛍️`;
}

// Create
byId("btnAddCliente").onclick = async ()=>{
  const nombre = byId("cNombre").value.trim();
  if(!nombre) return alert("Escribe el nombre del cliente");
  const row = {
    id: uid("cli"), tipo: "cliente",
    nombre,
    telefono: byId("cTelefono").value.trim(),
    email: byId("cEmail").value.trim(),
    notas: byId("cNotas").value.trim(),
    fecha: new Date().toLocaleString("es-DO")
  };
  await apiInsert(row);
  byId("cNombre").value = byId("cTelefono").value = byId("cEmail").value = byId("cNotas").value = "";
  await loadAll(true);
};

byId("btnAddPedido").onclick = async ()=>{
  const cliente_id = byId("pCliente").value;
  if(!cliente_id) return alert("Elige un cliente");
  const valor = Number(byId("pValor").value||0);
  const porc  = Number(byId("pPorc").value||0);
  const libra = Number(byId("pLibra").value||0);
  const factura = facturaCode();
  const row = {
    id: uid("ped"), tipo: "pedido",
    cliente_id,
    articulo: byId("pArticulo").value.trim(),
    valor, porc, libra,
    total: (valor + (valor*porc/100) + libra),
    tracking: byId("pTracking").value.trim(),
    estado: byId("pEstado").value,
    fecha: new Date().toLocaleString("es-DO"),
    factura
  };
  await apiInsert(row);
  ["pArticulo","pValor","pPorc","pLibra","pTracking"].forEach(id=>byId(id).value="");
  showToast("✅ Factura guardada correctamente");
  await loadAll(true);
};

byId("btnAddPago").onclick = async ()=>{
  const cliente_id = byId("payCliente").value;
  const pedido_id = byId("payPedido").value;
  const abono = Number(byId("payMonto").value||0);
  if(!cliente_id) return alert("Elige cliente");
  if(!pedido_id) return alert("Elige pedido");
  if(!(abono>0)) return alert("Ingresa un monto válido");
  const factura = facturaCode();
  const row = { id: uid("pay"), tipo:"pago", cliente_id, pedido_id, abono, fecha: new Date().toLocaleString("es-DO"), factura };
  await apiInsert(row);
  byId("payMonto").value = "";
  showToast("✅ Factura guardada correctamente");
  await loadAll(true);
};

window.registrarAbono = async (cliente_id, pedido_id)=>{
  const input = byId(`i_${pedido_id}`);
  const abono = Number(input.value||0);
  if(!(abono>0)) return alert("Ingresa un monto válido");
  const factura = facturaCode();
  const row = { id: uid("pay"), tipo:"pago", cliente_id, pedido_id, abono, fecha: new Date().toLocaleString("es-DO"), factura };
  await apiInsert(row);
  input.value="";
  showToast("✅ Factura guardada correctamente");
  await loadAll(false);
};

// Preview modal
function openPreview(pedidoId){
  const ped = PEDIDOS.find(p=>p.id===pedidoId);
  if(!ped) return;
  const cli = CLIENTES.find(c=>c.id===ped.cliente_id) || {};
  const pagos = PAGOS.filter(pg=>pg.pedido_id===ped.id);
  const cobrado = pagos.reduce((acc,pg)=>acc+Number(pg.abono||0),0);
  const total = calcTotalPedido(ped);
  const pendiente = total - cobrado;
  const factura = ped.factura || `TEMP-${facturaCode()}`;

  previewTempFactura = { numero: factura, pedidoId: ped.id };

  byId("m_factura").textContent = factura;
  byId("m_cliente").textContent = cli.nombre || "(sin nombre)";
  byId("m_telefono").textContent = cli.telefono || "-";
  byId("m_articulo").textContent = ped.articulo || "-";
  byId("m_valor").textContent = fmtMoney(ped.valor||0);
  byId("m_porc").textContent = (ped.porc||0) + "%";
  byId("m_libra").textContent = fmtMoney(ped.libra||0);
  byId("m_total").textContent = fmtMoney(total);
  byId("m_pagado").textContent = fmtMoney(cobrado);
  byId("m_pendiente").textContent = fmtMoney(pendiente);
  byId("m_estado").textContent = ped.estado || "-";
  byId("m_tracking").textContent = ped.tracking || "-";

  const msg = buildWhatsappMessage({
    nombre: cli.nombre,
    articulo: ped.articulo,
    total, cobrado, pendiente,
    estado: ped.estado, tracking: ped.tracking,
    factura
  });
  byId("m_msg").value = msg;
  byId("modal").classList.add("show");
}
byId("m_close").onclick = ()=> byId("modal").classList.remove("show");

byId("m_copy").onclick = async ()=>{
  const text = byId("m_msg").value;
  try{
    await navigator.clipboard.writeText(text);
    showToast("✅ Copiado al portapapeles");
  }catch(e){
    showToast("Copiado no disponible");
  }
};

byId("m_whatsapp").onclick = ()=>{
  const telefono = byId("m_telefono").textContent;
  const num = normalizePhone(telefono);
  if(!num){ alert("⚠️ Este cliente no tiene número de teléfono para WhatsApp."); return; }
  const text = encodeURIComponent(byId("m_msg").value);
  const url = `https://wa.me/${num}?text=${text}`;
  window.open(url, "_blank");
};

// Splash timing
setTimeout(()=>{
  splashMinTimeDone = true;
  if(dataLoaded) hideSplash();
}, 3000);

showSplash();
loadAll(false);