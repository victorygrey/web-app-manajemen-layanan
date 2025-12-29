const STORAGE_KEYS = {
  PELANGGAN: "sm_layanan_pelanggan",
  TRANSAKSI: "sm_layanan_transaksi",
  USER: "sm_layanan_user",
};

function loadStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const DEMO_USERS = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" },
];

document.addEventListener("alpine:init", () => {
  Alpine.data("appState", () => ({
    currentUser: null,
    activePage: "dashboard",
    serviceType: "travel",

    // Login
    loginForm: {
      username: "",
      password: "",
    },
    loginError: "",

    // Data
    pelanggan: [],
    transaksi: [],

    // Pelanggan
    pelangganSearch: "",
    pelangganModal: {
      open: false,
      isEdit: false,
      form: {
        id: null,
        nama: "",
        kontak: "",
        jenisLayanan: "travel",
        catatan: "",
      },
    },

    // Transaksi
    transaksiForm: {
      pelangganId: "",
      tanggal: "",
      deskripsi: "",
      nominal: null,
      status: "pending",
    },
    transaksiSearch: "",
    transaksiFilterStatus: "",

    // Laporan
    laporanRange: {
      from: "",
      to: "",
    },

    chartInstance: null,

    init() {
      // Load
      this.pelanggan = loadStorage(STORAGE_KEYS.PELANGGAN);
      this.transaksi = loadStorage(STORAGE_KEYS.TRANSAKSI);
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        try {
          this.currentUser = JSON.parse(savedUser);
        } catch {
          this.currentUser = null;
        }
      }

      // Init chart a bit later to ensure DOM ready
      setTimeout(() => this.initChart(), 50);
    },

    isAdmin() {
      return this.currentUser?.role === "admin";
    },

    // ===== LOGIN =====
    handleLogin() {
      const { username, password } = this.loginForm;
      const found = DEMO_USERS.find(
        (u) => u.username === username && u.password === password
      );
      if (!found) {
        this.loginError = "Username / password tidak cocok.";
        return;
      }
      this.currentUser = { username: found.username, role: found.role };
      this.loginError = "";
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.currentUser));
      this.activePage = "dashboard";
      // Refresh chart when login
      this.updateChart();
    },

    logout() {
      this.currentUser = null;
      localStorage.removeItem(STORAGE_KEYS.USER);
    },

    // ===== PELANGGAN CRUD =====
    openPelangganForm(existing) {
      if (!this.isAdmin()) return;
      // Reset form dulu
      this.pelangganModal.form = {
        id: null,
        nama: "",
        kontak: "",
        jenisLayanan: this.serviceType,
        catatan: "",
      };
      
      if (existing) {
        this.pelangganModal.isEdit = true;
        // Copy data dengan benar
        this.pelangganModal.form.id = existing.id;
        this.pelangganModal.form.nama = existing.nama || "";
        this.pelangganModal.form.kontak = existing.kontak || "";
        this.pelangganModal.form.jenisLayanan = existing.jenisLayanan || this.serviceType;
        this.pelangganModal.form.catatan = existing.catatan || "";
      } else {
        this.pelangganModal.isEdit = false;
      }
      this.pelangganModal.open = true;
    },

    closePelangganForm() {
      this.pelangganModal.open = false;
      // Reset form setelah modal ditutup
      setTimeout(() => {
        this.pelangganModal.form = {
          id: null,
          nama: "",
          kontak: "",
          jenisLayanan: this.serviceType,
          catatan: "",
        };
      }, 300);
    },

    savePelanggan() {
      const form = this.pelangganModal.form;
      if (!form.nama || !form.kontak) return;
      if (this.pelangganModal.isEdit) {
        this.pelanggan = this.pelanggan.map((p) => (p.id === form.id ? { ...form } : p));
      } else {
        const newId = Date.now().toString();
        this.pelanggan.push({ ...form, id: newId });
      }
      saveStorage(STORAGE_KEYS.PELANGGAN, this.pelanggan);
      this.closePelangganForm();
    },

    deletePelanggan(id) {
      if (!this.isAdmin()) return;
      if (!confirm("Hapus pelanggan ini?")) return;
      this.pelanggan = this.pelanggan.filter((p) => p.id !== id);
      // Juga hapus transaksi terkait
      this.transaksi = this.transaksi.filter((t) => t.pelangganId !== id);
      saveStorage(STORAGE_KEYS.PELANGGAN, this.pelanggan);
      saveStorage(STORAGE_KEYS.TRANSAKSI, this.transaksi);
      this.updateChart();
    },

    filteredPelanggan() {
      const q = this.pelangganSearch.toLowerCase();
      if (!q) return this.pelanggan;
      return this.pelanggan.filter(
        (p) =>
          p.nama.toLowerCase().includes(q) ||
          p.kontak.toLowerCase().includes(q) ||
          (p.catatan || "").toLowerCase().includes(q)
      );
    },

    // ===== TRANSAKSI =====
    saveTransaksi() {
      if (!this.isAdmin()) return;
      const f = this.transaksiForm;
      if (!f.pelangganId || !f.tanggal || !f.deskripsi || !f.nominal) return;
      const id = Date.now().toString();
      this.transaksi.push({
        id,
        pelangganId: f.pelangganId,
        tanggal: f.tanggal,
        deskripsi: f.deskripsi,
        nominal: Number(f.nominal),
        status: f.status,
      });
      saveStorage(STORAGE_KEYS.TRANSAKSI, this.transaksi);
      // reset form
      this.transaksiForm = {
        pelangganId: "",
        tanggal: "",
        deskripsi: "",
        nominal: null,
        status: "pending",
      };
      this.updateChart();
    },

    getPelangganName(id) {
      const p = this.pelanggan.find((x) => x.id === id);
      return p ? p.nama : "-";
    },

    filteredTransaksi() {
      const q = this.transaksiSearch.toLowerCase();
      const status = this.transaksiFilterStatus;
      return this.transaksi.filter((t) => {
        const matchStatus = status ? t.status === status : true;
        const custName = this.getPelangganName(t.pelangganId).toLowerCase();
        const matchQ =
          !q ||
          custName.includes(q) ||
          t.deskripsi.toLowerCase().includes(q) ||
          String(t.nominal).includes(q);
        return matchStatus && matchQ;
      });
    },

    totalRevenue() {
      return this.transaksi
        .filter((t) => t.status === "selesai")
        .reduce((sum, t) => sum + Number(t.nominal || 0), 0);
    },

    // ===== DASHBOARD CHART =====
    initChart() {
      const ctx = document.getElementById("chartTransaksi");
      if (!ctx) return;
      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              label: "Pendapatan per Bulan",
              data: [],
              backgroundColor: "rgba(56, 189, 248, 0.6)",
              borderColor: "rgba(56, 189, 248, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: "#e5e7eb" } },
          },
          scales: {
            x: {
              ticks: { color: "#9ca3af" },
              grid: { color: "rgba(148, 163, 184, 0.2)" },
            },
            y: {
              ticks: { color: "#9ca3af" },
              grid: { color: "rgba(148, 163, 184, 0.2)" },
            },
          },
        },
      });
      this.updateChart();
    },

    updateChart() {
      if (!this.chartInstance) return;
      // group by YYYY-MM
      const map = {};
      this.transaksi
        .filter((t) => t.status === "selesai")
        .forEach((t) => {
          const d = new Date(t.tanggal);
          if (Number.isNaN(d.getTime())) return;
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          map[key] = (map[key] || 0) + Number(t.nominal || 0);
        });
      const labels = Object.keys(map).sort();
      const data = labels.map((k) => map[k]);
      this.chartInstance.data.labels = labels;
      this.chartInstance.data.datasets[0].data = data;
      this.chartInstance.update();
    },

    // ===== LAPORAN =====
    resetLaporanRange() {
      this.laporanRange.from = "";
      this.laporanRange.to = "";
    },

    laporanTransaksi() {
      const from = this.laporanRange.from ? new Date(this.laporanRange.from) : null;
      const to = this.laporanRange.to ? new Date(this.laporanRange.to) : null;
      return this.transaksi.filter((t) => {
        const d = new Date(t.tanggal);
        if (Number.isNaN(d.getTime())) return false;
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      });
    },

    // ===== EXPORT =====
    exportExcel() {
      const rows = [
        ["Tanggal", "Pelanggan", "Deskripsi", "Nominal", "Status"],
        ...this.laporanTransaksi().map((t) => [
          this.formatDate(t.tanggal),
          this.getPelangganName(t.pelangganId),
          t.deskripsi,
          t.nominal,
          t.status,
        ]),
      ];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, "Laporan");
      XLSX.writeFile(wb, "laporan_transaksi.xlsx");
    },

    exportPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const rows = this.laporanTransaksi().map((t) => [
        this.formatDate(t.tanggal),
        this.getPelangganName(t.pelangganId),
        t.deskripsi,
        this.formatCurrency(t.nominal),
        t.status,
      ]);
      doc.text("Laporan Transaksi", 14, 16);
      doc.autoTable({
        head: [["Tanggal", "Pelanggan", "Deskripsi", "Nominal", "Status"]],
        body: rows,
        startY: 20,
      });
      doc.save("laporan_transaksi.pdf");
    },

    // ===== UTIL =====
    formatCurrency(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(value || 0);
    },

    formatDate(value) {
      if (!value) return "-";
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleDateString("id-ID");
    },
  }));
});


