import React, { useState } from 'react';
import { X, Search, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';

interface GuidebookProps {
  onClose: () => void;
}

const sectionData = [
  {
    id: 'intro',
    title: '1. Pendahuluan',
    content: `
      <h3 class="text-xl font-bold mb-2">Apa itu NanzzEditor?</h3>
      <p class="mb-4">NanzzEditor adalah sebuah environment pengembangan terpadu (IDE) berbasis web yang didesain khusus agar ringan, cepat, dan bekerja secara offline langsung di peramban (browser) Anda. Terinspirasi oleh aplikasi mobile populer seperti ACode, NanzzEditor membawa pengalaman coding yang sama powerfulnya ke ranah desktop dan tablet tanpa memerlukan instalasi software yang berat.</p>
      <p class="mb-4">Tujuan utama NanzzEditor adalah untuk memberikan platform bagi developer pemula hingga tingkat lanjut agar bisa "Code Anywhere, Learn Everywhere". Mulai dari menyusun prototipe HTML/CSS, mencoba logika JavaScript, belajar Python dasar, hingga merancang antarmuka, semua bisa dilakukan dalam satu tab browser.</p>
      <h3 class="text-xl font-bold mb-2">Keunggulan Utama</h3>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li><strong>Ringan & Cepat:</strong> Dibuat tanpa backend kompleks, NanzzEditor memuat dalam hitungan detik.</li>
        <li><strong>Offline-First:</strong> Menggunakan teknologi LocalStorage dan IndexedDB standar peramban, kode Anda tetap aman meskipun Anda kehilangan koneksi internet.</li>
        <li><strong>Live Preview Real-Time:</strong> Tidak perlu terus-menerus menekan tombol refresh. Kode web (HTML/CSS/JS) Anda dirender langsung kapan pun Anda berhenti mengetik.</li>
        <li><strong>Privasi Penuh:</strong> Karena kode tidak dikirim ke server (kecuali Anda menggunakan fitur colab eksperimental), Anda memegang kendali 100% atas kekayaan intelektual Anda.</li>
      </ul>
      <p>Selamat datang di masa depan koding yang portabel. Mari kita jelajahi fitur-fiturnya!</p>
    `
  },
  {
    id: 'getting-started',
    title: '2. Memulai Proyek Pertama',
    content: `
      <h3 class="text-xl font-bold mb-2">Langkah Pertama Anda</h3>
      <p class="mb-4">Saat Anda pertama kali membuka NanzzEditor, Anda akan disambut oleh antarmuka yang bersih dengan tiga bagian utama: Sidebar (pengelola file), Editor (ruang kerja utama), dan Live Preview (hasil eksekusi web).</p>
      
      <h4 class="font-bold text-lg mb-1 mt-4">Membuat File Baru</h4>
      <p class="mb-4">Di panel sebelah kiri (File Manager), klik ikon tambah file (+ File). Sebuah prompt akan muncul meminta Anda memberi nama beserta ekstensinya (misalnya: <code>index.html</code>, <code>style.css</code>, atau <code>app.js</code>). NanzzEditor langsung mendeteksi bahasa dari ekstensi yang Anda ketik dan mengaktifkan syntax highlighting yang sesuai.</p>

      <h4 class="font-bold text-lg mb-1 mt-4">Menulis Kode</h4>
      <p class="mb-4">Pilih file yang baru dibuat dari daftar file untuk membukanya di editor. Mulailah mengetik eksprimen Anda. Fitur auto-closing brackets (kurung buka-tutup otomatis) dan auto-indentation sudah menyala secara bawaan untuk memudahkan.</p>

      <h4 class="font-bold text-lg mb-1 mt-4">Menyimpan dan Manajemen</h4>
      <p class="mb-4">Sistem akan secara otomatis menyertakan kode Anda pada preview ketika Anda mengetik (debounce diterapkan agar tidak lag). Anda juga bisa menekan tombol save (ikon disket) atau <code>Ctrl + S</code> untuk memastikan data ter-serialize secara sinkron ke database lokal (LocalStorage). Data ini akan tetap ada meskipun Anda merefresh halaman.</p>
    `
  },
  {
    id: 'features',
    title: '3. Panduan Fitur Utama',
    content: `
      <h3 class="text-xl font-bold mb-2">Panel Editor Kode</h3>
      <p class="mb-4">Editor ditenagai oleh mesin CodeMirror yang sangat responsif. Ini mendukung lebih dari semantik teks biasa; secara dinamis menyoroti (highlight) kode HTML, CSS, JavaScript, Python, PHP, dan Markdown.</p>
      
      <h3 class="text-xl font-bold mb-2">Live Preview (Panel Output)</h3>
      <p class="mb-4">Jika proyek Anda adalah proyek Web, live preview menghubungkan tiga file sekaligus secara virtual: HTML, CSS, dan JS. Panel ini berjalan di atas iframe sandbox yang mendeteksi berkas bernama <code>index.html</code> dalam root Anda (atau menggunakan file aktif jika bukan root web). NanzzEditor membungkusnya secara ajaib tanpa setup server.</p>

      <h3 class="text-xl font-bold mb-2">Konsol Output Cerdas</h3>
      <p class="mb-4">Di mana saya bisa melihat error JS saya? NanzzEditor menginjeksi pengait (hook) khusus ke dalam iframe pratinjau yang mencegat panggilan <code>console.log</code>, <code>console.error</code>, <code>console.warn</code>, dan <code>console.info</code>. Hasil cetakannya diteruskan (melalui message passing) dan dimunculkan di panel Console bawaan kita. Hal ini sangat krusial saat Anda sedang melakukan debugging logika.</p>

      <h3 class="text-xl font-bold mb-2">Tema Adaptif</h3>
      <p class="mb-4">Terdapat saklar "Matahari/Bulan" di bilah alat atas. Mode Gelap (Dark Mode) sangat disarankan untuk pengerjaan pada malam hari dengan kontras yang rendah ketegangan, terinspirasi dari skema warna estetika modern. Mode Terang cukup terang untuk kondisi di bawah terik siang.</p>

      <h3 class="text-xl font-bold mb-2">Ekspor Proyek (Download ZIP)</h3>
      <p class="mb-4">Setelah proyek cukup matang dan Anda ingin melanjutkannya di VSCode desktop atau mempublishnya ke GitHub, klik ikon awan-unduh (Download ZIP). NanzzEditor memaketkan seluruh dokumen di file manager dan mengunduhnya seketika sebagai satu berkas arsip.</p>
    `
  },
  {
    id: 'shortcuts',
    title: '4. Shortcut Keyboard Lengkap',
    content: `
      <p class="mb-4">Maksimalkan produktivitas Anda tanpa harus melepaskan tangan dari keyboard selagi mengoding. NanzzEditor mendukung pemetaan kombinasi standar industri:</p>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-100 dark:bg-gray-800">
              <th class="p-2 border border-gray-300 dark:border-gray-700">Pintasan (Windows/Linux)</th>
              <th class="p-2 border border-gray-300 dark:border-gray-700">Pintasan (Mac)</th>
              <th class="p-2 border border-gray-300 dark:border-gray-700">Fungsi / Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-2 border border-gray-300 dark:border-gray-700"><code>Ctrl + S</code></td>
              <td class="p-2 border border-gray-300 dark:border-gray-700"><code>Cmd + S</code></td>
              <td class="p-2 border border-gray-300 dark:border-gray-700">Menyimpan File Aktif ke Storage Lokal</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-300 dark:border-gray-700"><code>Ctrl + /</code></td>
              <td class="p-2 border border-gray-300 dark:border-gray-700"><code>Cmd + /</code></td>
              <td class="p-2 border border-gray-300 dark:border-gray-700">Toggle Komentar pada Baris Saat Ini / Teks Terpilih</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-300 dark:border-gray-700"><code>Ctrl + F</code></td>
              <td class="p-2 border border-gray-300 dark:border-gray-700"><code>Cmd + F</code></td>
              <td class="p-2 border border-gray-300 dark:border-gray-700">Buka Panel Pencarian (Search)</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-300 dark:border-gray-700"><code>F11</code></td>
              <td class="p-2 border border-gray-300 dark:border-gray-700"><code>F11</code> / <code>Cmd+Ctrl+F</code></td>
              <td class="p-2 border border-gray-300 dark:border-gray-700">Beralih Mode Layar Penuh (Fullscreen)</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-300 dark:border-gray-700"><code>Ctrl + Z</code></td>
              <td class="p-2 border border-gray-300 dark:border-gray-700"><code>Cmd + Z</code></td>
              <td class="p-2 border border-gray-300 dark:border-gray-700">Membatalkan Perubahan Terakhir (Undo)</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-300 dark:border-gray-700"><code>Ctrl + Shift + Z</code> / <code>Ctrl + Y</code></td>
              <td class="p-2 border border-gray-300 dark:border-gray-700"><code>Cmd + Shift + Z</code></td>
              <td class="p-2 border border-gray-300 dark:border-gray-700">Mengerjakan Ulang yang Dibatalkan (Redo)</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-300 dark:border-gray-700"><code>Tab</code></td>
              <td class="p-2 border border-gray-300 dark:border-gray-700"><code>Tab</code></td>
              <td class="p-2 border border-gray-300 dark:border-gray-700">Menyisipkan Indentasi (2 Spasi standar)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-4 text-sm text-gray-500">Kustomisasi shortcut lebih lanjut sedang dalam tahap pengembangan dan akan dirilis pada iterasi selanjutnya.</p>
    `
  },
  {
    id: 'tips-and-tricks',
    title: '5. Tips & Trik / Praktik Terbaik',
    content: `
      <h3 class="text-xl font-bold mb-2">Struktur File</h3>
      <p class="mb-4">Bila Anda membuat proyek halaman web, praktik terbaiknya adalah memastikan Anda memiliki setidaknya <code>index.html</code> (sebagai titik masuk/entry point). Kemudian tambahkan <code>style.css</code> (untuk gaya visual), dan hubungkan keduanya dengan baris kode: <code>&lt;link rel="stylesheet" href="style.css"&gt;</code>.</p>
      
      <h3 class="text-xl font-bold mb-2">Snippet Kilat HTML</h3>
      <p class="mb-4">Pada file berekstensi .html, ketik blok elemen secara urut dan rapih. Menguasai struktur dasar dokumen mempercepat kerja Anda, hindari melupakan <code>&lt;!DOCTYPE html&gt;</code> untuk memastikan kompatibilitas modern pada Live Preview di NanzzEditor.</p>
      
      <h3 class="text-xl font-bold mb-2">Mengelola Proyek Skala Menengah</h3>
      <p class="mb-4">Meskipun terbatas di dalam browser Anda, Anda tetap bisa membuat proyek besar. Buatlah format penamaan file yang rapi. Misalnya: <code>components_button.css</code> jika belum mendukung folder. Pemisahan kode adalah kunci agar baris dari satu berkas tidak membengkak ke angka ribuan.</p>
      
      <h3 class="text-xl font-bold mb-2">Pembukaan File External</h3>
      <p class="mb-4">Anda juga bisa memilih "Import / Open Local File" dari toolbar. NanzzEditor akan membacanya melalui FileReader API murni sisi-klien, dan menambahkan isinya ke sistem file proyek simulasi kita tanpa mengirim satu bit pun ke awan.</p>
    `
  },
  {
    id: 'troubleshooting',
    title: '6. Troubleshooting (Pemecahan Masalah)',
    content: `
      <h3 class="text-xl font-bold mb-2">Preview Tidak Muncul atau Putih Bersih?</h3>
      <ul class="list-disc pl-5 mb-4">
        <li><strong>Periksa Console:</strong> Seringkali ada typo (salah ketik) pada skrip Javascript Anda. Tagihan sintaks error akan mucul di bagian konsol.</li>
        <li><strong>Inclusion File:</strong> Pastikan path/nama file di tag <code>src="..."</code> atau <code>href="..."</code> sama persis huruf besar-kecilnya dengan nama di file manager.</li>
        <li><strong>Loop Tanpa Henti (Infinite Loop):</strong> Jika halaman hang karena loop <code>while(true)</code>, NanzzEditor memiliki pelindung waktu namun kadang browser butuh waktu (atau tab ditutup dan dibuka lagi).</li>
      </ul>
      
      <h3 class="text-xl font-bold mb-2">Pekerjaan Saya Hilang?</h3>
      <p class="mb-4">NanzzEditor menyimpan data Anda ke LocalStorage per domain. Apabila Anda menghapus setelan cache/data penjelajahan di peramban, ada risiko data tersebut terhapus. Solusinya: Jangan lupa sesekali melakukan <strong>Export to ZIP</strong> untuk membackupnya ke disk komputer Anda sebagai asuransi.</p>
      
      <h3 class="text-xl font-bold mb-2">Tema Tidak Teraplikasi</h3>
      <p class="mb-4">Refresh paksa bisa menyelesaikan hal yang ganjal di state memori. Semua opsi tema mestinya tersimpan di LocalStorage preferensi pengguna secara otomatis.</p>
    `
  },
  {
    id: 'about',
    title: '7. Tentang & Kredit',
    content: `
      <p class="mb-4"><strong>NanzzEditor: "Code Anywhere, Learn Everywhere"</strong></p>
      <p class="mb-4">Diciptakan untuk memenuhi kebutuhan coder mandiri, siswa, fasilitator, dan hobiis akan IDE ringkas tanpa birokrasi, pendaftaran, dan login.</p>
      <p class="mb-4"><strong>Versi: </strong> 1.0.0-release</p>
      <p class="mb-4"><strong>Lisensi: </strong> MIT Open Source. Dibebaskan bagi siapa pun untuk mempelajari mekanisme sistem editor internal ini dan meremix/melakukan modifikasi independen atau menyematkannya pada aplikasi e-learning mereka sendiri.</p>
      <p class="mb-4"><strong>Credits (Core Open Source Technologies):</strong></p>
      <ul class="list-disc pl-5 mb-4 text-sm font-mono opacity-80">
        <li>CodeMirror 6 (Sistem Text Editor Utama)</li>
        <li>React & Vite (Infrastruktur Rendering & Sistem Pemaket)</li>
        <li>Tailwind CSS (Konstruktor Estetika & Responsivitas)</li>
        <li>Lucide Icons (Vektor Ikonografi UI)</li>
        <li>JSZip & FileSaver.js (Modul Manajemen Kompresi & Unduhan Arsip)</li>
      </ul>
      <br/>
      <p class="italic text-center text-gray-500">Selamat Mengoding, masa depan ada di jari Anda!</p>
    `
  }
];

export default function Guidebook({ onClose }: GuidebookProps) {
  const [activeSegment, setActiveSegment] = useState<string>('intro');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = sectionData.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-end animate-in slide-in-from-right duration-200">
      <div className="bg-[#252526] w-[320px] h-full flex flex-col border-l border-[#111]">
        {/* Header */}
        <div className="p-4 bg-blue-600 text-white font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> 
            BUKU PANDUAN
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-black/20 text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 bg-[#1e1e1e] border-b border-[#333]">
          <div className="relative items-center flex">
            <input 
              type="text" 
              placeholder="Cari di panduan..." 
              className="w-full bg-[#2d2d2d] border border-[#444] rounded-full py-1.5 px-4 text-xs outline-none focus:border-blue-500 text-[#cccccc]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-3.5 h-3.5 absolute right-3 text-[#858585]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm text-[#cccccc] leading-relaxed">
          {filteredData.length > 0 ? (
            filteredData.map(section => (
              <section key={section.id}>
                <h3 className="text-blue-400 font-bold mb-2 uppercase text-xs">{section.title}</h3>
                <div 
                  className="prose prose-invert prose-sm max-w-none text-[#cccccc] prose-headings:text-white prose-a:text-blue-400 prose-code:text-[#ce9178] prose-code:bg-[#1e1e1e] prose-code:px-1 prose-code:rounded marker:text-blue-500 text-xs"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[#858585]">
              <Search className="w-8 h-8 mb-4 opacity-50" />
              <p>Tidak ada panduan yang cocok.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
