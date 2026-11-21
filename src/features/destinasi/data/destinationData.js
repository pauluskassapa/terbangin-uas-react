import baliPhoto from '../../penerbangan/assets/destination-bali.jpg'
import jogjaPhoto from '../../penerbangan/assets/destination-yogyakarta.jpg'
import bajoPhoto from '../../penerbangan/assets/destination-labuan-bajo.jpg'
import lombokPhoto from '../../penerbangan/assets/destination-lombok.jpg'

export const destinations = {
  DPS: {
    code: 'DPS',
    city: 'Bali',
    province: 'Bali, Indonesia',
    airport: 'Bandara Internasional I Gusti Ngurah Rai (DPS)',
    tagline: 'Pulau Dewata dengan harmoni pantai tropis, sawah terasering, dan budaya yang hidup.',
    heroTitle: 'Jelajahi Pesona',
    heroAccent: 'Bali.',
    heroImage: baliPhoto,
    startingPrice: 760000,
    flightDuration: '1j 50m dari Jakarta (CGK)',
    bestSeason: 'April - Oktober (Musim Kemarau)',
    videoTitle: 'Cinematic Preview · Pesona Pulau Dewata',
    videoDescription:
      'Saksikan cuplikan keindahan tebing Uluwatu, hamparan sawah Ubud, hingga suasana matahari terbenam di pesisir Bali sebelum memulai perjalananmu.',
    videoUrl: 'https://www.youtube.com/embed/BFS9n4B_2xA?rel=0',
    highlights: [
      { label: 'KODE BANDARA', value: 'DPS · Denpasar' },
      { label: 'DURASI RATA-RATA', value: '1 Jam 50 Menit' },
      { label: 'HARGA MULAI', value: 'Rp760.000 / org' },
    ],
    categories: ['Semua', 'Pantai & Laut', 'Budaya & Alam', 'Kuliner & Sunset'],
    spots: [
      {
        id: 'uluwatu',
        name: 'Pura Luhur Uluwatu & Pantai Melasti',
        area: 'Badung Selatan',
        category: 'Pantai & Laut',
        rating: '4.9',
        bestTime: '16.00 - 18.30 WITA',
        description:
          'Tebing karang menjulang di atas Samudra Hindia dengan pertunjukan Tari Kecak saat matahari terbenam serta deretan pantai berpasir putih.',
      },
      {
        id: 'ubud',
        name: 'Tegalalang Rice Terrace & Ubud',
        area: 'Gianyar · Ubud',
        category: 'Budaya & Alam',
        rating: '4.8',
        bestTime: '07.00 - 10.30 WITA',
        description:
          'Lanskap sawah bertingkat dengan sistem irigasi tradisional Subak, udara sejuk pedesaan, serta galeri seni dan kerajinan khas Bali.',
      },
      {
        id: 'nusa-penida',
        name: 'Kelingking Beach & Broken Beach',
        area: 'Nusa Penida',
        category: 'Pantai & Laut',
        rating: '4.9',
        bestTime: '08.00 - 15.00 WITA',
        description:
          'Formasi tebing ikonik menyerupai punggung T-Rex dengan gradasi air laut biru turkis yang spektakuler untuk fotografi dan snorkeling.',
      },
      {
        id: 'kintamani',
        name: 'Kaldera Gunung & Danau Batur',
        area: 'Kintamani · Bangli',
        category: 'Budaya & Alam',
        rating: '4.8',
        bestTime: '05.30 - 09.00 WITA',
        description:
          'Deretan kafe di tepi kaldera dengan panorama matahari terbit di balik Gunung Batur dan hamparan kabut tipis di atas danau.',
      },
      {
        id: 'jimbaran',
        name: 'Teluk Jimbaran Seafood & Sunset',
        area: 'Jimbaran · Kuta Selatan',
        category: 'Kuliner & Sunset',
        rating: '4.7',
        bestTime: '17.00 - 21.00 WITA',
        description:
          'Santap malam hidangan laut bakar khas bumbu Bali langsung di atas pasir pantai sambil menikmati langit senja dan debur ombak tenang.',
      },
      {
        id: 'tanah-lot',
        name: 'Pura Tanah Lot & Batu Bolong',
        area: 'Tabanan',
        category: 'Kuliner & Sunset',
        rating: '4.8',
        bestTime: '16.30 - 18.30 WITA',
        description:
          'Pura laut bersejarah di atas bongkahan batu besar yang tampak terapung saat air pasang dengan siluet senja paling populer di Bali.',
      },
    ],
    tips: [
      {
        title: 'Pesan Tiket Lebih Awal',
        detail: 'Pilih jadwal keberangkatan pagi (08.00 - 10.30) agar waktu check-in hotel dan eksplorasi hari pertama lebih maksimal.',
      },
      {
        title: 'Siapkan Pakaian Sopan untuk Pura',
        detail: 'Kunjungan ke kawasan pura membutuhkan kain kamen dan selendang yang umumnya juga disediakan di pintu masuk.',
      },
      {
        title: 'Atur Rute Berdasarkan Wilayah',
        detail: 'Kelompokkan perjalanan per area (misal: Bali Selatan di hari ke-1, Ubud & Kintamani di hari ke-2) agar hemat waktu di perjalanan.',
      },
    ],
  },
    YIA: {
    code: 'YIA',
    city: 'Yogyakarta',
    province: 'DI Yogyakarta, Indonesia',
    airport: 'Bandara Internasional Yogyakarta (YIA)',
    tagline: 'Kota budaya dengan warisan keraton, kemegahan candi bersejarah, hingga petualangan alam Gunung Merapi dan pantai selatan.',
    heroTitle: 'Telusuri Cerita',
    heroAccent: 'Yogyakarta.',
    heroImage: jogjaPhoto,
    startingPrice: 760000,
    flightDuration: '1j 15m dari Jakarta (CGK)',
    bestSeason: 'Mei - September (Musim Kemarau)',
    videoTitle: 'Cinematic Preview · Istimewanya Yogyakarta',
    videoDescription:
      'Nikmati suasana hangat Malioboro, kemegahan Candi Prambanan saat senja, hingga pesona alam perbukitan dan pantai selatan Yogyakarta.',
    videoUrl: 'https://www.youtube.com/embed/1V_4E2G1tJc?rel=0',
    highlights: [
      { label: 'KODE BANDARA', value: 'YIA · Kulon Progo' },
      { label: 'DURASI RATA-RATA', value: '1 Jam 15 Menit' },
      { label: 'HARGA MULAI', value: 'Rp760.000 / org' },
    ],
    categories: ['Semua', 'Budaya & Sejarah', 'Alam & Pantai', 'Kuliner & Kota'],
    spots: [
      {
        id: 'prambanan',
        name: 'Candi Prambanan & Ratu Boko',
        area: 'Sleman · Perbatasan Klaten',
        category: 'Budaya & Sejarah',
        rating: '4.9',
        bestTime: '15.30 - 18.00 WIB',
        description:
          'Kompleks candi Hindu terbesar di Indonesia dari abad ke-9 dengan relief Ramayana yang megah dan panorama matahari terbenam dari Bukit Ratu Boko.',
      },
      {
        id: 'malioboro',
        name: 'Kawasan Jalan Malioboro & Titik Nol',
        area: 'Pusat Kota Yogyakarta',
        category: 'Kuliner & Kota',
        rating: '4.8',
        bestTime: '18.00 - 22.00 WIB',
        description:
          'Jantung keramaian Jogja dengan pedestrian estetik, gedung heritage kolonial, belanja batik di Pasar Beringharjo, dan kuliner lesehan malam.',
      },
      {
        id: 'keraton',
        name: 'Keraton Yogyakarta & Taman Sari',
        area: 'Kraton · Kota Yogyakarta',
        category: 'Budaya & Sejarah',
        rating: '4.8',
        bestTime: '08.30 - 13.00 WIB',
        description:
          'Istana resmi Kesultanan Ngayogyakarta Hadiningrat yang masih hidup dengan tradisi Jawa serta kompleks pemandian bersejarah Taman Sari.',
      },
      {
        id: 'merapi',
        name: 'Lava Tour Gunung Merapi & Kaliurang',
        area: 'Pakem · Sleman Utara',
        category: 'Alam & Pantai',
        rating: '4.8',
        bestTime: '05.30 - 09.30 WIB',
        description:
          'Petualangan seru menyusuri lereng Merapi dengan mobil Jeep terbuka, mengunjungi Bunker Kaliadem, dan menikmati udara dingin pegunungan.',
      },
      {
        id: 'gunungkidul',
        name: 'Pantai Indrayanti & HeHa Ocean View',
        area: 'Gunungkidul',
        category: 'Alam & Pantai',
        rating: '4.7',
        bestTime: '15.00 - 18.30 WIB',
        description:
          'Deretan pantai pasir putih berbatu karang di pesisir selatan lengkap dengan spot santai di atas tebing menghadap langsung ke Samudra Hindia.',
      },
      {
        id: 'kotagede',
        name: 'Kampung Heritage Kotagede & Gudeg Wijilan',
        area: 'Kotagede & Wijilan',
        category: 'Kuliner & Kota',
        rating: '4.8',
        bestTime: '09.00 - 20.00 WIB',
        description:
          'Sentra kerajinan perak tradisional dengan gang-gang arsitektur klasik Mataram Kuno serta pusat kuliner Gudeg autentik khas Yogyakarta.',
      },
    ],
    tips: [
      {
        title: 'Gunakan Kereta Bandara YIA Xpress',
        detail: 'Dari Bandara YIA Kulon Progo, naik KA Bandara menuju Stasiun Tugu Yogyakarta (tepat di dekat Malioboro) hanya sekitar 35 menit.',
      },
      {
        title: 'Datang Pagi ke Keraton & Taman Sari',
        detail: 'Kawasan wisata budaya Keraton umumnya tutup pukul 14.00 WIB, sehingga paling ideal dikunjungi pada pagi hari.',
      },
      {
        title: 'Siapkan Waktu Khusus ke Gunungkidul',
        detail: 'Perjalanan ke pantai selatan Gunungkidul memakan waktu sekitar 1,5 - 2 jam dari pusat kota; berangkatlah siang hari agar tiba saat sunset.',
      },
    ],
  },
    LBJ: {
    code: 'LBJ',
    city: 'Labuan Bajo',
    province: 'Nusa Tenggara Timur, Indonesia',
    airport: 'Bandara Internasional Komodo (LBJ)',
    tagline: 'Gerbang menuju Taman Nasional Komodo dengan gugusan pulau eksotis, perairan sebening kristal, dan lanskap perbukitan savana.',
    heroTitle: 'Berlayar Menuju',
    heroAccent: 'Labuan Bajo.',
    heroImage: bajoPhoto,
    startingPrice: 760000,
    flightDuration: '2j 25m dari Jakarta (CGK)',
    bestSeason: 'April - November (Musim Kemarau)',
    videoTitle: 'Cinematic Preview · Keajaiban Labuan Bajo',
    videoDescription:
      'Intip panorama ikonik Pulau Padar dari puncak bukit, hamparan pasir merah muda di Pink Beach, hingga petualangan berlayar melintasi perairan Taman Nasional Komodo.',
    videoUrl: 'https://www.youtube.com/embed/5_4d7613i7A?rel=0',
    highlights: [
      { label: 'KODE BANDARA', value: 'LBJ · Manggarai Barat' },
      { label: 'DURASI RATA-RATA', value: '2 Jam 25 Menit' },
      { label: 'HARGA MULAI', value: 'Rp760.000 / org' },
    ],
    categories: ['Semua', 'Pulau & Laut', 'Taman Nasional', 'Bukit & Sunset'],
    spots: [
      {
        id: 'pulau-padar',
        name: 'Puncak Bukit Pulau Padar',
        area: 'Taman Nasional Komodo',
        category: 'Bukit & Sunset',
        rating: '4.9',
        bestTime: '05.30 - 08.30 WITA',
        description:
          'Ikon utama Labuan Bajo dengan jalur trekking menuju puncak bukit yang menyuguhkan panorama tiga teluk berpasir putih, hitam, dan merah muda.',
      },
      {
        id: 'pulau-komodo',
        name: 'Pulau Komodo & Pulau Rinca',
        area: 'Taman Nasional Komodo',
        category: 'Taman Nasional',
        rating: '4.9',
        bestTime: '08.00 - 12.00 WITA',
        description:
          'Habitat asli kadal purba Komodo yang dilindungi UNESCO, ditemani pemandu resmi (ranger) menyusuri jalur hutan dan savana alami.',
      },
      {
        id: 'pink-beach',
        name: 'Pink Beach (Pantai Long Beach)',
        area: 'Pulau Komodo & Padar',
        category: 'Pulau & Laut',
        rating: '4.9',
        bestTime: '09.00 - 14.00 WITA',
        description:
          'Pantai berpasir merah muda alami yang terbentuk dari serpihan karang merah dengan air laut jernih untuk berenang dan snorkeling.',
      },
      {
        id: 'manta-point',
        name: 'Manta Point & Taka Makassar',
        area: 'Perairan Selat Komodo',
        category: 'Pulau & Laut',
        rating: '4.8',
        bestTime: '10.00 - 14.30 WITA',
        description:
          'Spot snorkeling terbaik untuk berenang bersama ikan pari manta yang ramah, berdekatan dengan gosong pasir putih berbentuk bulan sabit di tengah laut.',
      },
      {
        id: 'pulau-kanawa',
        name: 'Pulau Kanawa & Pulau Kelor',
        area: 'Perairan Labuan Bajo',
        category: 'Pulau & Laut',
        rating: '4.8',
        bestTime: '11.00 - 16.00 WITA',
        description:
          'Pulau kecil dengan dermaga kayu fotogenik, terumbu karang dangkal penuh bintang laut, serta bukit pendek dengan pemandangan teluk biru.',
      },
      {
        id: 'bukit-sylvia',
        name: 'Bukit Sylvia & Marina Waterfront',
        area: 'Kota Labuan Bajo',
        category: 'Bukit & Sunset',
        rating: '4.7',
        bestTime: '16.30 - 18.30 WITA',
        description:
          'Perbukitan hijau di pinggir kota dan kawasan tepi laut modern untuk menikmati siluet kapal phinisi saat matahari terbenam.',
      },
    ],
    tips: [
      {
        title: 'Pilih Paket Sailing atau One-Day Speedboat',
        detail: 'Jika waktu terbatas, pilih tur speedboat 1 hari (Padar, Pink Beach, Komodo, Taka Makassar). Jika punya 3 hari 2 malam, coba pengalaman menginap di kapal Phinisi.',
      },
      {
        title: 'Gunakan Alas Kaki Nyaman & Tabir Surya',
        detail: 'Trekking ke Pulau Padar dan Pulau Kelor cukup terjal dan terik; siapkan sepatu trekking ringan, topi, serta sunblock ramah terumbu karang.',
      },
      {
        title: 'Ikuti Arahan Ranger di Pulau Komodo',
        detail: 'Selalu berjalan bersama rombongan, jaga jarak aman dari satwa liar, dan hindari membuat gerakan mendadak selama di kawasan konservasi.',
      },
    ],
  },
  LOP: {
    code: 'LOP',
    city: 'Lombok',
    province: 'Nusa Tenggara Barat, Indonesia',
    airport: 'Bandara Internasional Zainuddin Abdul Madjid (LOP)',
    tagline: 'Pulau Seribu Masjid dengan pesona gugusan Gili, perbukitan Mandalika yang menawan, megahnya Gunung Rinjani, dan tradisi Sasak yang autentik.',
    heroTitle: 'Temukan Ketenangan',
    heroAccent: 'Lombok.',
    heroImage: lombokPhoto,
    startingPrice: 760000,
    flightDuration: '2j 05m dari Jakarta (CGK)',
    bestSeason: 'Mei - Oktober (Musim Kemarau)',
    videoTitle: 'Cinematic Preview · Pesona Pulau Lombok',
    videoDescription:
      'Nikmati birunya perairan Gili Trawangan, lekukan pantai pasir merica di Mandalika, hingga gagahnya lanskap pegunungan Sembalun di kaki Gunung Rinjani.',
    videoUrl: 'https://www.youtube.com/embed/h0b1nS-lN8k?rel=0',
    highlights: [
      { label: 'KODE BANDARA', value: 'LOP · Lombok Tengah' },
      { label: 'DURASI RATA-RATA', value: '2 Jam 5 Menit' },
      { label: 'HARGA MULAI', value: 'Rp760.000 / org' },
    ],
    categories: ['Semua', 'Pantai & Gili', 'Alam & Gunung', 'Budaya & Kuliner'],
    spots: [
      {
        id: 'gili-trawangan',
        name: 'Gili Trawangan, Gili Air & Gili Meno',
        area: 'Lombok Utara',
        category: 'Pantai & Gili',
        rating: '4.9',
        bestTime: '08.00 - 18.00 WITA',
        description:
          'Tiga pulau tropis bebas kendaraan bermotor dengan sepeda santai, terumbu karang dangkal tempat penyu berenang, serta ayunan sunset ikonik.',
      },
      {
        id: 'bukit-merese',
        name: 'Bukit Merese & Pantai Tanjung Aan',
        area: 'Kuta · Mandalika',
        category: 'Pantai & Gili',
        rating: '4.9',
        bestTime: '15.30 - 18.30 WITA',
        description:
          'Perbukitan hijau luas di atas garis pantai berpasir unik menyerupai butiran merica dengan pemandangan teluk biru dan sunset terbaik di Lombok Selatan.',
      },
      {
        id: 'sembalun-rinjani',
        name: 'Lembah Sembalun & Bukit Pergasingan',
        area: 'Lombok Timur · Kaki Rinjani',
        category: 'Alam & Gunung',
        rating: '4.9',
        bestTime: '06.00 - 10.30 WITA',
        description:
          'Dataran tinggi sejuk di lereng Gunung Rinjani dengan petak kebun warna-warni, jalur pendakian ramah pemula, dan udara pegunungan yang segar.',
      },
      {
        id: 'air-terjun-senaru',
        name: 'Air Terjun Sendang Gile & Tiu Kelep',
        area: 'Senaru · Lombok Utara',
        category: 'Alam & Gunung',
        rating: '4.8',
        bestTime: '08.30 - 13.00 WITA',
        description:
          'Dua air terjun bertingkat yang tersembunyi di tengah hutan tropis rimbun dengan aliran air dingin langsung dari mata air Gunung Rinjani.',
      },
      {
        id: 'desa-sade',
        name: 'Desa Adat Sade & Sentra Tenun Sukarara',
        area: 'Lombok Tengah',
        category: 'Budaya & Kuliner',
        rating: '4.8',
        bestTime: '09.00 - 16.00 WITA',
        description:
          'Perkampungan tradisional Suku Sasak dengan rumah lumbung beratap alang-alang, proses menenun kain songket tradisional, dan tari peresean.',
      },
      {
        id: 'senggigi-taliwang',
        name: 'Pantai Senggigi & Kuliner Ayam Taliwang',
        area: 'Lombok Barat & Mataram',
        category: 'Budaya & Kuliner',
        rating: '4.7',
        bestTime: '17.00 - 21.00 WITA',
        description:
          'Garis pantai klasik menghadap Gunung Agung Bali saat senja, dilengkapi wisata kuliner khas Lombok seperti Ayam Taliwang, Plecing Kangkung, dan Sate Rembiga.',
      },
    ],
    tips: [
      {
        title: 'Mulai Eksplorasi dari Lombok Selatan',
        detail: 'Bandara LOP hanya berjarak sekitar 25 menit dari kawasan Kuta Mandalika dan Desa Sade, cocok dijadikan destinasi hari pertama setibanya di Lombok.',
      },
      {
        title: 'Atur Jadwal Penyeberangan ke Tiga Gili',
        detail: 'Gunakan fast boat atau perahu dari Pelabuhan Bangsal pada pagi hari (sebelum pukul 10.00 WITA) saat ombak relatif lebih tenang.',
      },
      {
        title: 'Siapkan Jaket Jika ke Sembalun atau Senaru',
        detail: 'Meski area pantai cukup terik, suhu di kawasan lereng Rinjani dan Sembalun bisa turun cukup dingin terutama di pagi dan malam hari.',
      },
    ],
  },
}

export const defaultDestinationCode = 'DPS'
