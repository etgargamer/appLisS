// AppLisS-GSheets v3.9.1 — look v3.7
const state = {
  cfg: null,
  all: [],
  view: "pendientes",
  search: "",
};

const q = (sel, root=document)=>root.querySelector(sel);
const qa = (sel, root=document)=>[...root.querySelectorAll(sel)];

function money(n){ 
  const cfg = state.cfg || { CURRENCY:'$' };
  return `${cfg.CURRENCY} ${Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2})}`;
}

function toast(msg){
  const el = q("#toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"), 2200);
}

async function loadConfig(){
  const res = await fetch("config.json");
  state.cfg = await res.json();
}

function computeTotals(item){
  const valor = Number(item.valor||0);
  const pct   = Number(item.porcentaje||0);
  const libra = Number(item.libra||0);
  const fee   = valor * (pct/100);
  const total = valor + fee + libra;
  const pagado = Number(item.pagado||0);
  const restante = Math.max(0, total - pagado);
  return {fee, total, pagado, restante};
}

function buildWA(invoice){
  const {cfg} = state;
  const lines = [
    `*${cfg.BRAND_NAME}*`,
    `Factura / Resumen de compra`,
    ``,
    `Cliente: ${invoice.cliente}`,
    `Artículo: ${invoice.articulo}`,
    `Valor: ${money(invoice.valor)}`,
    `Porcentaje: ${Number(invoice.porcentaje||0).toFixed(2)}% (${money(invoice.fee)})`,
    `Libra: ${money(invoice.libra)}`,
    `Total: *${money(invoice.total)}*`,
    `Pagado: ${money(invoice.pagado)}`,
    `Restante: *${money(invoice.restante)}*`,
    invoice.tracking ? `Tracking: ${invoice.tracking}` : null,
    ``,
    `¡Gracias por su compra!`
  ].filter(Boolean).join("\n");
  const phone = formatPhone(invoice.telefono);
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(lines)}`;
  return url;
}

function formatPhone(tel){
  tel = (tel||"").trim();
  if (!tel) return "";
  if (tel.startsWith("+")) return tel.replace(/[^\d]/g,"");
  const cc = (state.cfg && state.cfg.WHATSAPP_DEFAULT_CC) || "1";
  return `${cc}${tel.replace(/[^\d]/g,"")}`;
}

function toRowPayload(data){
  return { data:[data] };
}

async function apiList(){
  const {SHEETDB_URL, SHEET_NAME} = state.cfg;
  const url = `${SHEETDB_URL}?sheet=${encodeURIComponent(SHEET_NAME)}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error("No se pudo leer la base de datos");
  return await res.json();
}

async function apiCreate(row){
  const {SHEETDB_URL, SHEET_NAME} = state.cfg;
  const url = `${SHEETDB_URL}?sheet=${encodeURIComponent(SHEET_NAME)}`;
  const res = await fetch(url, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(toRowPayload(row))});
  if(!res.ok) throw new Error("No se pudo crear el registro");
  return await res.json();
}

async function apiUpdateById(id, patch){
  const {SHEETDB_URL, SHEET_NAME} = state.cfg;
  const url = `${SHEETDB_URL}/search?sheet=${encodeURIComponent(SHEET_NAME)}&id=${encodeURIComponent(id)}`;
  const res = await fetch(url, {method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify(toRowPayload(patch))});
  if(!res.ok) throw new Error("No se pudo actualizar el registro");
  return await res.json();
}

function render(){
  const s = (state.search||"").toLowerCase();
  const items = state.all.filter(r => {
    const hit = [
      r.cliente, r.articulo, r.tracking
    ].map(x=> (x||"").toLowerCase()).some(v => v.includes(s));
    return hit;
  });
  const pend = items.filter(x => (x.status||"PENDIENTE") !== "COMPLETADO");
  const comp = items.filter(x => (x.status||"PENDIENTE") === "COMPLETADO");

  fillList(q("#list-pendientes"), pend);
  fillList(q("#list-completados"), comp);
}

function fillList(container, rows){
  container.innerHTML = "";
  const tpl = q("#card-template");
  rows.forEach((r)=>{
    const {fee, total, pagado, restante} = computeTotals(r);
    const node = tpl.content.cloneNode(true);
    q(".title", node).textContent = `${r.cliente} — ${r.articulo}`;
    const meta = [`Tracking: ${r.tracking||"—"}`, `Tel: ${r.telefono||"—"}`].join(" · ");
    q(".meta", node).textContent = meta;
    q(".total", node).textContent = money(total);
    q(".pagado", node).textContent = money(pagado);
    q(".restante", node).textContent = money(restante);

    const btnPrev = q(".btn-preview", node);
    btnPrev.addEventListener("click", ()=> openPreview(r));

    const btnWA = q(".btn-wa", node);
    btnWA.addEventListener("click", ()=> openWA(r));

    const btnPay = q(".btn-pay", node);
    btnPay.addEventListener("click", async ()=>{
      const add = prompt("Monto a registrar (pago):", "0");
      if(add===null) return;
      const amount = Number(add||0);
      if(isNaN(amount) || amount<=0){ toast("Monto inválido"); return; }
      const nuevo = (Number(r.pagado||0) + amount);
      const patch = { pagado: String(nuevo) };
      const totals = computeTotals({...r, pagado:nuevo});
      if (totals.restante <= 0) patch.status = "COMPLETADO";
      await apiUpdateById(r.id, patch);
      toast("Pago registrado");
      await loadAll();
    });

    const btnEdit = q(".btn-edit", node);
    btnEdit.addEventListener("click", ()=> openForm(r));

    container.appendChild(node);
  });
}

function openForm(row){
  const dlg = q("#modal-form");
  q("#form-title").textContent = row ? "Editar Pedido" : "Nuevo Pedido";
  const form = q("#form-item");
  form.reset();
  q("input[name=id]").value = row?.id || "";
  q("input[name=cliente]").value = row?.cliente || "";
  q("input[name=telefono]").value = row?.telefono || "";
  q("input[name=articulo]").value = row?.articulo || "";
  q("input[name=valor]").value = row?.valor || "";
  q("input[name=porcentaje]").value = row?.porcentaje || "0";
  q("input[name=libra]").value = row?.libra || "0";
  q("input[name=tracking]").value = row?.tracking || "";
  updatePreviewTotal();
  dlg.showModal();
}

function updatePreviewTotal(){
  const form = q("#form-item");
  const valor = Number(q("input[name=valor]", form).value||0);
  const pct = Number(q("input[name=porcentaje]", form).value||0);
  const libra = Number(q("input[name=libra]", form).value||0);
  const fee = valor * (pct/100);
  const total = valor + fee + libra;
  q("#preview-total").textContent = `Total estimado: ${money(total)}`;
}

async function saveForm(){
  const form = q("#form-item");
  const data = Object.fromEntries(new FormData(form).entries());
  const isEdit = !!data.id;
  data.valor = data.valor || "0";
  data.porcentaje = data.porcentaje || "0";
  data.libra = data.libra || "0";
  data.pagado = data.pagado || (isEdit ? undefined : "0");
  data.status = data.status || (isEdit ? undefined : "PENDIENTE");
  if(!isEdit){
    data.id = `${Date.now()}`;
    data.fecha = new Date().toISOString();
  }
  if(isEdit){
    const patch = {
      cliente:data.cliente, telefono:data.telefono, articulo:data.articulo,
      valor:data.valor, porcentaje:data.porcentaje, libra:data.libra, tracking:data.tracking
    };
    await apiUpdateById(data.id, patch);
    toast("Actualizado");
  }else{
    await apiCreate(data);
    toast("Creado");
  }
  q("#modal-form").close();
  await loadAll();
}

function openPreview(row){
  const {fee, total, pagado, restante} = computeTotals(row);
  const card = q("#preview-card");
  card.innerHTML = `
    <h3>${state.cfg.BRAND_NAME}</h3>
    <div class="kvs">
      <div><b>Cliente:</b> ${row.cliente}</div>
      <div><b>Teléfono:</b> ${row.telefono||"—"}</div>
      <div><b>Artículo:</b> ${row.articulo}</div>
      <div><b>Tracking:</b> ${row.tracking||"—"}</div>
      <div><b>Valor:</b> ${money(row.valor)}</div>
      <div><b>% aplicado:</b> ${Number(row.porcentaje||0).toFixed(2)}% (${money(fee)})</div>
      <div><b>Libra:</b> ${money(row.libra)}</div>
      <div class="sum"><b>Total:</b> ${money(total)} · <b>Pagado:</b> ${money(pagado)} · <b>Restante:</b> ${money(restante)}</div>
    </div>
  `;
  q("#modal-preview").showModal();
  q("#btn-wa").onclick = ()=> openWA(row);
  q("#btn-copy").onclick = ()=> {
    const lines = card.innerText;
    navigator.clipboard.writeText(lines).then(()=> toast("Copiado"));
  };
  q("#btn-close-preview").onclick = ()=> q("#modal-preview").close();
}

function openWA(row){
  const {fee, total, pagado, restante} = computeTotals(row);
  const payload = {...row, fee, total, pagado, restante};
  const url = buildWA(payload);
  if(!payload.telefono){ toast("Este registro no tiene teléfono"); return; }
  window.open(url, "_blank");
}

async function loadAll(){
  const rows = await apiList();
  rows.forEach(r=>{
    r.valor = r.valor ? Number(r.valor) : 0;
    r.porcentaje = r.porcentaje ? Number(r.porcentaje) : 0;
    r.libra = r.libra ? Number(r.libra) : 0;
    r.pagado = r.pagado ? Number(r.pagado) : 0;
  });
  state.all = rows;
  render();
}

function initTabs(){
  qa(".tab-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      qa(".tab-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      qa(".tab-panel").forEach(p=>p.classList.remove("active"));
      q(`#${btn.dataset.tab}`).classList.add("active");
      state.view = btn.dataset.tab;
    });
  });
}

function initToolbar(){
  q("#btn-add").addEventListener("click", ()=> openForm(null));
  q("#btn-sync").addEventListener("click", ()=> loadAll());
  q("#search").addEventListener("input", (e)=>{
    state.search = e.target.value;
    render();
  });
}

function initForm(){
  const form = q("#form-item");
  form.addEventListener("input", (e)=>{
    if(["valor","porcentaje","libra"].includes(e.target.name)){
      updatePreviewTotal();
    }
  });
  q("#btn-save").addEventListener("click", async (e)=>{
    e.preventDefault();
    try{
      await saveForm();
    }catch(err){
      console.error(err);
      toast("Error al guardar");
    }
  });
}

function initSplash(){
  // El CSS hará fadeOut a los 2s; aquí solo garantizamos que no bloquee interacciones
  setTimeout(()=>{
    const s = q("#splash");
    if(s) s.style.pointerEvents = "none";
  }, 1200);
}

async function boot(){
  await loadConfig();
  initTabs();
  initToolbar();
  initForm();
  initSplash();
  await loadAll();
}

document.addEventListener("DOMContentLoaded", boot);
