// ---------- Dữ liệu sản phẩm ----------
const CATEGORIES = ["Nam", "Nữ", "Phụ kiện"];

// imgs: tên file trong thư mục images/, ảnh đầu tiên là ảnh đại diện
const products = [
  { id: 1, name: "Áo thun đỏ in chữ", category: "Nữ", price: 229000, oldPrice: 279000, sizes: ["S", "M", "L"], colors: ["Đỏ"], rating: 4.6, sold: 310,
    imgs: ["4.jpg"] },
  { id: 2, name: "Áo sơ mi dáng dài xám", category: "Nữ", price: 459000, oldPrice: null, sizes: ["S", "M", "L"], colors: ["Xám"], rating: 4.7, sold: 180,
    imgs: ["6.jpg"] },
  { id: 3, name: "Áo blazer đen", category: "Nữ", price: 690000, oldPrice: 820000, sizes: ["S", "M", "L"], colors: ["Đen"], rating: 4.8, sold: 140,
    imgs: ["7.jpg"] },
  { id: 4, name: "Áo khoác bomber nâu", category: "Nam", price: 590000, oldPrice: 720000, sizes: ["M", "L", "XL"], colors: ["Nâu"], rating: 4.6, sold: 205,
    imgs: ["8.jpg"] },
  { id: 5, name: "Áo len dệt kim cổ tròn", category: "Nam", price: 389000, oldPrice: null, sizes: ["M", "L", "XL"], colors: ["Kem"], rating: 4.5, sold: 260,
    imgs: ["9.jpg"] },
  { id: 6, name: "Bộ vest nữ màu be", category: "Nữ", price: 1190000, oldPrice: 1390000, sizes: ["S", "M", "L"], colors: ["Be"], rating: 4.7, sold: 75,
    imgs: ["10.jpg"] },
  { id: 7, name: "Áo măng tô dạ", category: "Nữ", price: 950000, oldPrice: null, sizes: ["S", "M", "L"], colors: ["Nâu"], rating: 4.8, sold: 120,
    imgs: ["11.jpg"] },
  { id: 8, name: "Áo cardigan len", category: "Nữ", price: 329000, oldPrice: 390000, sizes: ["S", "M", "L"], colors: ["Kem"], rating: 4.4, sold: 230,
    imgs: ["12.jpg"] },
  { id: 9, name: "Túi xách da chần bông", category: "Phụ kiện", price: 790000, oldPrice: null, sizes: ["M"], colors: ["Đen"], rating: 4.6, sold: 160,
    imgs: ["13.jpg"] },
  { id: 10, name: "Áo len móc tua rua", category: "Nữ", price: 299000, oldPrice: 350000, sizes: ["S", "M"], colors: ["Be"], rating: 4.3, sold: 160,
    imgs: ["15.jpg"] },
  { id: 11, name: "Áo khoác dáng dài xanh", category: "Nữ", price: 850000, oldPrice: 990000, sizes: ["S", "M", "L"], colors: ["Xanh"], rating: 4.7, sold: 110,
    imgs: ["16.jpg"] },
  { id: 12, name: "Bộ nỉ thể thao vàng", category: "Nữ", price: 459000, oldPrice: null, sizes: ["S", "M", "L", "XL"], colors: ["Vàng"], rating: 4.5, sold: 190,
    imgs: ["dom-hill-nimElTcTNyY-unsplash.jpg"] }
];


// ---------- Hàm dùng chung ----------
const $ = (id) => document.getElementById(id);

// Đường dẫn ảnh trong thư mục images/
const imgPath = (file) => "images/" + file;

const formatPrice = (v) => v.toLocaleString("vi-VN") + "đ";


function starHtml(rating) {
  let s = "";
  for (let i = 1; i <= 5; i++) {
    s += rating >= i ? '<i class="bi bi-star-fill"></i>'
       : rating >= i - 0.5 ? '<i class="bi bi-star-half"></i>'
       : '<i class="bi bi-star"></i>';
  }
  return `<span class="stars">${s}</span>`;
}

function productCard(p) {
  const sale = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return `
    <div class="col-6 col-md-4 col-xl-3">
      <a href="#/product/${p.id}" class="product-card">
        <div class="img-box">
          ${sale ? `<span class="hang-tag">-${sale}%</span>` : ""}
          <img src="${imgPath(p.imgs[0])}" alt="${p.name}" loading="lazy">
        </div>
        <div class="card-info">
          <span class="meta">${p.category}</span>
          <h3 class="card-name">${p.name}</h3>
          <div class="meta">${starHtml(p.rating)} ${p.rating} · Đã bán ${p.sold}</div>
          <div class="price-row">
            <span class="price ${sale ? "is-sale" : ""}">${formatPrice(p.price)}</span>
            ${p.oldPrice ? `<del>${formatPrice(p.oldPrice)}</del>` : ""}
          </div>
        </div>
      </a>
    </div>`;
}

const toast = new bootstrap.Toast($("toast"));
function notify(msg) {
  $("toastMsg").textContent = msg;
  toast.show();
}

// ---------- Trang chủ: tab danh mục, bộ lọc ----------
const state = { category: "all", price: "all", sizes: [], colors: [], saleOnly: false };

// Tab danh mục
$("catTabs").innerHTML = ["all", ...CATEGORIES].map(c =>
  `<li class="nav-item"><button class="nav-link" data-cat="${c}">${c === "all" ? "Tất cả" : c}</button></li>`
).join("");
$("catTabs").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cat]");
  if (btn) { state.category = btn.dataset.cat; renderProducts(); }
});

// Nút chọn size và màu trong bộ lọc
function makeToggleButtons(boxId, values, key) {
  $(boxId).innerHTML = values.map(v => `<button type="button" class="btn btn-sm btn-outline-dark" data-val="${v}">${v}</button>`).join("");
  $(boxId).addEventListener("click", (e) => {
    const btn = e.target.closest("[data-val]");
    if (!btn) return;
    btn.classList.toggle("active");
    const list = state[key];
    const i = list.indexOf(btn.dataset.val);
    i === -1 ? list.push(btn.dataset.val) : list.splice(i, 1);
    renderProducts();
  });
}
makeToggleButtons("sizeFilter", ["S", "M", "L", "XL"], "sizes");
makeToggleButtons("colorFilter", [...new Set(products.flatMap(p => p.colors))], "colors");

$("priceFilter").addEventListener("change", (e) => { state.price = e.target.value; renderProducts(); });
$("saleOnly").addEventListener("change", (e) => { state.saleOnly = e.target.checked; renderProducts(); });

$("resetBtn").addEventListener("click", () => {
  Object.assign(state, { price: "all", sizes: [], colors: [], saleOnly: false });
  $("p0").checked = true;
  $("saleOnly").checked = false;
  document.querySelectorAll("#sizeFilter .active, #colorFilter .active").forEach(b => b.classList.remove("active"));
  renderProducts();
});

function renderProducts() {
  const [min, max] = state.price === "all" ? [0, Infinity] : state.price.split("-").map(Number);

  const list = products.filter(p =>
    (state.category === "all" || p.category === state.category) &&
    p.price >= min && p.price <= max &&
    (state.sizes.length === 0 || state.sizes.some(s => p.sizes.includes(s))) &&
    (state.colors.length === 0 || state.colors.some(c => p.colors.includes(c))) &&
    (!state.saleOnly || p.oldPrice)
  );

  document.querySelectorAll("#catTabs .nav-link").forEach(b => b.classList.toggle("active", b.dataset.cat === state.category));
  $("productGrid").innerHTML = list.map(productCard).join("");
  $("resultCount").textContent = `${list.length} sản phẩm`;
  $("emptyMsg").classList.toggle("d-none", list.length > 0);
}

// ---------- Trang chi tiết: zoom ảnh (Drift), xem toàn màn hình (Fancybox) ----------
let current = null;            // sản phẩm đang mở
let images = [];               // danh sách ảnh của sản phẩm đang xem
let imgIndex = 0;              // vị trí ảnh đang hiện
let drift = null;              // bộ zoom Drift, tạo một lần rồi dùng lại
const choice = { color: null, size: null };

function setMainImage(i) {
  imgIndex = i;
  const src = imgPath(images[i]);   // ảnh gốc đủ nét nên dùng luôn để zoom
  $("mainImg").src = src;
  $("mainImg").setAttribute("data-zoom", src);
  if (drift) drift.setZoomImageURL(src);
  document.querySelectorAll(".thumb").forEach((t, k) => t.classList.toggle("active", k === i));
}

function showProduct(id) {
  current = products.find(p => p.id === id);
  if (!current) { location.hash = "#/"; return; }
  const p = current;
  document.title = p.name + " - TK_WEB_TH30.12";

  $("bcCat").textContent = p.category;
  $("bcCat").href = "#/cat/" + p.category;
  $("bcName").textContent = p.name;
  $("pCat").textContent = p.category;
  $("pName").textContent = p.name;
  $("pRating").innerHTML = `${starHtml(p.rating)} <span class="meta">${p.rating} · Đã bán ${p.sold}</span>`;
  $("pPrice").textContent = formatPrice(p.price);
  $("pOldPrice").textContent = p.oldPrice ? formatPrice(p.oldPrice) : "";
  $("tabDesc").innerHTML = `<p><strong>${p.name}</strong> thuộc dòng ${p.category.toLowerCase()} của TK_WEB_TH30.12, chất liệu thoáng mát, đường may chắc chắn, dễ phối đồ đi học, đi làm, đi chơi.</p>
    <ul class="mb-0"><li>Màu: ${p.colors.join(", ")}</li><li>Size: ${p.sizes.join(", ")}</li><li>Giặt máy chế độ nhẹ, không dùng chất tẩy.</li></ul>`;

  // Ảnh nhỏ bên dưới ảnh chính
  images = p.imgs;
  $("thumbs").classList.toggle("d-none", images.length < 2);   // chỉ có 1 ảnh thì ẩn dãy ảnh nhỏ
  $("thumbs").innerHTML = images.map((file, i) =>
    `<img src="${imgPath(file)}" class="thumb" data-index="${i}" alt="Ảnh ${i + 1}">`
  ).join("");
  setMainImage(0);

  // Rê chuột lên ảnh: phần phóng to hiện đè lên cột thông tin bên phải
  if (!drift) {
    drift = new Drift($("mainImg"), {
      paneContainer: $("zoomPane"),
      inlinePane: 768,          // màn hình dưới 768px thì phóng to ngay trên ảnh
      zoomFactor: 2.5,
      hoverBoundingBox: true,
      handleTouch: false        // điện thoại dùng Fancybox, chụm 2 ngón để zoom
    });
  }

  // Đặt lại lựa chọn màu, size, số lượng
  choice.color = choice.size = null;
  $("colorLabel").textContent = $("sizeLabel").textContent = "";
  $("pColors").innerHTML = p.colors.map(v => `<button class="btn btn-outline-dark option-btn" data-val="${v}">${v}</button>`).join("");
  $("pSizes").innerHTML = p.sizes.map(v => `<button class="btn btn-outline-dark option-btn" data-val="${v}">${v}</button>`).join("");
  $("qty").value = 1;
  $("likeBtn").querySelector("i").className = "bi bi-heart";

  $("related").innerHTML = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4).map(productCard).join("");
}

// Bấm ảnh nhỏ để đổi ảnh chính
$("thumbs").addEventListener("click", (e) => {
  if (e.target.dataset.index) setMainImage(Number(e.target.dataset.index));
});

// Bấm ảnh chính để xem toàn màn hình: cuộn chuột hoặc chụm ngón để zoom, kéo để di chuyển
$("mainImg").addEventListener("click", () => {
  Fancybox.show(images.map(file => ({ src: imgPath(file), type: "image" })), { startIndex: imgIndex });
});

// Chọn màu và size
function bindOptions(boxId, labelId, key) {
  $(boxId).addEventListener("click", (e) => {
    const btn = e.target.closest("[data-val]");
    if (!btn) return;
    $(boxId).querySelectorAll(".active").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    choice[key] = btn.dataset.val;
    $(labelId).textContent = btn.dataset.val;
  });
}
bindOptions("pColors", "colorLabel", "color");
bindOptions("pSizes", "sizeLabel", "size");

$("qtyMinus").onclick = () => { $("qty").value = Math.max(1, Number($("qty").value) - 1); };
$("qtyPlus").onclick = () => { $("qty").value = Number($("qty").value) + 1; };

$("addCart").onclick = () => {
  if (!choice.color || !choice.size) return notify("Chọn màu và kích cỡ trước khi thêm vào giỏ");
  notify(`Đã thêm ${$("qty").value} × ${current.name} (${choice.color}, size ${choice.size}) vào giỏ`);
};

$("likeBtn").onclick = () => {
  const icon = $("likeBtn").querySelector("i");
  const liked = icon.classList.toggle("bi-heart-fill");
  icon.classList.toggle("bi-heart", !liked);
  notify(liked ? "Đã thêm vào yêu thích" : "Đã bỏ khỏi yêu thích");
};

// ---------- Trang liên hệ ----------
$("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  form.classList.add("was-validated");
  if (!form.checkValidity()) return;
  notify("Đã gửi liên hệ, TK_WEB_TH30.12 sẽ trả lời qua email của bạn");
  form.reset();
  form.classList.remove("was-validated");
});

// ---------- Chuyển trang bằng #hash ----------
// Các địa chỉ: #/  #/cat/Nam  #/sale  #/shop  #/product/3  #/contact
function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("d-none", v.id !== id));
}

function router() {
  const [page, param] = decodeURIComponent(location.hash.replace(/^#\/?/, "")).split("/");
  document.title = "TK_WEB_TH30.12 - Thời trang nam nữ";

  if (page === "product") {
    showView("viewProduct");
    showProduct(Number(param));
    window.scrollTo(0, 0);
  } else if (page === "contact") {
    showView("viewContact");
    window.scrollTo(0, 0);
  } else {
    showView("viewHome");
    if (page === "cat") state.category = CATEGORIES.includes(param) ? param : "all";
    if (page === "") state.category = "all";
    if (page === "sale") { state.saleOnly = true; $("saleOnly").checked = true; }
    renderProducts();
    if (page) $("shop").scrollIntoView({ behavior: "smooth" });
    else window.scrollTo(0, 0);
  }

  // Tô sáng mục menu đang mở, thu gọn menu trên điện thoại
  document.querySelectorAll("#menu .nav-link").forEach(a =>
    a.classList.toggle("active", decodeURIComponent(a.getAttribute("href")) === decodeURIComponent(location.hash || "#/"))
  );
  bootstrap.Collapse.getInstance($("mainNav"))?.hide();
}

window.addEventListener("hashchange", router);
router();
