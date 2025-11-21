/* =====================================================
   ANIMASI SCROLL (Fade-Up)
===================================================== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

// aktifkan animasi untuk elemen yang punya class .animate
document.querySelectorAll(".animate").forEach(el => observer.observe(el));



/* =====================================================
   POPUP NOTIFIKASI KEREN
===================================================== */
function showPopup(text) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerText = text;

  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add("visible"), 50);

  setTimeout(() => {
    popup.classList.remove("visible");
    setTimeout(() => popup.remove(), 300);
  }, 2000);
}



/* =====================================================
   MENAMBAHKAN PRODUK KE KERANJANG
===================================================== */
function addCart(kode) {
  let cart = JSON.parse(localStorage.getItem("keranjang") || "[]");

  // ambil daftar produk global
  const produkList = window.produk || [];
  const item = produkList.find(p => p.kode === kode);

  if (!item) {
    showPopup("Produk tidak ditemukan!");
    return;
  }

  const existing = cart.find(c => c.kode === kode);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  localStorage.setItem("keranjang", JSON.stringify(cart));

  showPopup("Ditambahkan ke keranjang!");
}



/* =====================================================
   HALAMAN KERANJANG
===================================================== */
function loadCartPage() {
  const tbody = document.getElementById("cart-body");
  const totalEl = document.getElementById("total");

  // jika bukan halaman keranjang, hentikan
  if (!tbody) return;

  let cart = JSON.parse(localStorage.getItem("keranjang") || "[]");

  // render tabel keranjang
  function render() {
    tbody.innerHTML = "";
    let total = 0;

    cart.forEach((item, i) => {
      const subtotal = item.harga * item.qty;
      total += subtotal;

      tbody.innerHTML += `
        <tr>
          <td>${item.nama}</td>
          <td>Rp ${item.harga.toLocaleString()}</td>
          <td>
            <input type="number" min="1" value="${item.qty}" data-i="${i}" class="qty-input">
          </td>
          <td>Rp ${subtotal.toLocaleString()}</td>
          <td><button data-del="${i}">Hapus</button></td>
        </tr>
      `;
    });

    totalEl.innerHTML = "Rp " + total.toLocaleString();
    localStorage.setItem("keranjang", JSON.stringify(cart));
  }

  render();



  /* ================================================
       EVENT: Ubah Qty
  =================================================== */
  document.addEventListener("change", e => {
    if (e.target.classList.contains("qty-input")) {
      const index = Number(e.target.getAttribute("data-i"));
      cart[index].qty = Math.max(1, parseInt(e.target.value));
      render();
    }
  });



  /* ================================================
       EVENT: Hapus Item
  =================================================== */
  document.addEventListener("click", e => {
    if (e.target.hasAttribute("data-del")) {
      const index = Number(e.target.getAttribute("data-del"));
      cart.splice(index, 1);
      render();
      showPopup("Produk dihapus!");
    }
  });
}
/* =====================================================
   KIRIM ORDER KE WHATSAPP
===================================================== */
function kirimWhatsapp() {
  let cart = JSON.parse(localStorage.getItem("keranjang") || "[]");

  if (cart.length === 0) {
    showPopup("Keranjang masih kosong!");
    return;
  }

  let pesan = "Halo, saya ingin memesan:%0A%0A";

  cart.forEach(item => {
    pesan += `- ${item.nama} (Qty: ${item.qty}) - Rp ${item.harga.toLocaleString()}%0A`;
  });

  let total = cart.reduce((a, b) => a + b.harga * b.qty, 0);

  pesan += `%0ATotal: Rp ${total.toLocaleString()}%0A%0A`;

  pesan += "Silakan proses pesanannya ya 🙂";

  // Nomor WhatsApp tujuan (GANTI DENGAN NOMOR KAMU)
  let nomor = "6283869812467"; // ganti dengan nomor kamu

  let url = `https://wa.me/${nomor}?text=${pesan}`;

  window.open(url, "_blank");
}



/* =====================================================
   PANGGIL FUNGSI KETIKA HALAMAN DIMUAT
===================================================== */
loadCartPage();
