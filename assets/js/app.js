const $ = (s)=>document.querySelector(s);
const byId = (id)=>document.getElementById(id);
const uid = (p)=>`${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
const fmtMoney = (n)=> `RD$ ${Number(n||0).toLocaleString("es-DO",{maximumFractionDigits:2})}`;
const API_URL = "https://sheetdb.io/api/v1/avsi1ki6gcrlr";

let RAW=[], CLIENTES=[], PEDIDOS=[], PAGOS=[];
let splashMinTimeDone=false, dataLoaded=false;

function showSplash(){ byId("splash").classList.remove("hide"); }
function hideSplash(){ byId("splash").classList.add("hide"); }

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
        <div class="muted">Cliente: ${cli? (cli.nombre||"-"):"(desconocido)"} • Tracking: ${p.tracking||"-"}</div>
        <div style="display:flex;gap:18px;margin-top:6px;flex-wrap:wrap">
          <div><strong>Total:</strong> ${fmtMoney(total)}</div>
          <div><strong>Cobrado:</strong> ${fmtMoney(cobrado)}</div>
          <div><strong>Pendiente:</strong> ${fmtMoney(pendiente)}</div>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
          <input type="number" placeholder="Abono (RD$)" id="i_${p.id}" style="max-width:220px">
          <button class="btn ok" onclick="registrarAbono('${p.cliente_id}','${p.id}')">Registrar abono</button>
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
        <div class="muted">Cliente: ${cli? (cli.nombre||"-"):"-"} • Pedido: ${ped? (ped.articulo||"-"):"-"}</div>
      </div>`;
    box.insertAdjacentHTML("beforeend", html);
  });
}

function calcTotalPedido(p){
  const v = Number(p.valor||0), pr = Number(p.porc||0), lb = Number(p.libra||0);
  const tSheet = Number(p.total||0);
  const tCalc = v + (v * pr / 100) + lb;
  return tSheet>0 ? tSheet : tCalc;
}

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
  const row = {
    id: uid("ped"), tipo: "pedido",
    cliente_id,
    articulo: byId("pArticulo").value.trim(),
    valor, porc, libra,
    total: (valor + (valor*porc/100) + libra),
    tracking: byId("pTracking").value.trim(),
    estado: byId("pEstado").value,
    fecha: new Date().toLocaleString("es-DO")
  };
  await apiInsert(row);
  ["pArticulo","pValor","pPorc","pLibra","pTracking"].forEach(id=>byId(id).value="");
  await loadAll(true);
};

byId("btnAddPago").onclick = async ()=>{
  const cliente_id = byId("payCliente").value;
  const pedido_id = byId("payPedido").value;
  const abono = Number(byId("payMonto").value||0);
  if(!cliente_id) return alert("Elige cliente");
  if(!pedido_id) return alert("Elige pedido");
  if(!(abono>0)) return alert("Ingresa un monto válido");
  const row = { id: uid("pay"), tipo:"pago", cliente_id, pedido_id, abono, fecha: new Date().toLocaleString("es-DO") };
  await apiInsert(row);
  byId("payMonto").value = "";
  await loadAll(true);
};

window.registrarAbono = async (cliente_id, pedido_id)=>{
  const input = byId(`i_${pedido_id}`);
  const abono = Number(input.value||0);
  if(!(abono>0)) return alert("Ingresa un monto válido");
  const row = { id: uid("pay"), tipo:"pago", cliente_id, pedido_id, abono, fecha: new Date().toLocaleString("es-DO") };
  await apiInsert(row);
  input.value="";
  await loadAll(false);
};

// Splash control (3s min + until data is loaded)
setTimeout(()=>{
  splashMinTimeDone = true;
  if(dataLoaded) document.getElementById("splash").classList.add("hide");
}, 3000);

document.getElementById("splash").classList.remove("hide");
loadAll(false);