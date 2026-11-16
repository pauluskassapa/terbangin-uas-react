export const destinations = {
  DPS: {
    code: 'DPS',
    city: 'Bali',
    province: 'Bali, Indonesia',
    airport: 'Bandara Internasional I Gusti Ngurah Rai (DPS)',
    tagline: 'Pulau Dewata dengan harmoni pantai tropis, sawah terasering, dan budaya yang hidup.',
    heroTitle: 'Jelajahi Pesona',
    heroAccent: 'Bali.',
    startingPrice: 760000,
    flightDuration: '1j 50m dari Jakarta (CGK)',
    bestSeason: 'April – Oktober (Musim Kemarau)',
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
        bestTime: '16.00 – 18.30 WITA',
        description:
          'Tebing karang menjulang di atas Samudra Hindia dengan pertunjukan Tari Kecak saat matahari terbenam serta deretan pantai berpasir putih.',
      },
      {
        id: 'ubud',
        name: 'Tegalalang Rice Terrace & Ubud',
        area: 'Gianyar · Ubud',
        category: 'Budaya & Alam',
        rating: '4.8',
        bestTime: '07.00 – 10.30 WITA',
        description:
          'Lanskap sawah bertingkat dengan sistem irigasi tradisional Subak, udara sejuk pedesaan, serta galeri seni dan kerajinan khas Bali.',
      },
      {
        id: 'nusa-penida',
        name: 'Kelingking Beach & Broken Beach',
        area: 'Nusa Penida',
        category: 'Pantai & Laut',
        rating: '4.9',
        bestTime: '08.00 – 15.00 WITA',
        description:
          'Formasi tebing ikonik menyerupai punggung T-Rex dengan gradasi air laut biru turkis yang spektakuler untuk fotografi dan snorkeling.',
      },
      {
        id: 'kintamani',
        name: 'Kaldera Gunung & Danau Batur',
        area: 'Kintamani · Bangli',
        category: 'Budaya & Alam',
        rating: '4.8',
        bestTime: '05.30 – 09.00 WITA',
        description:
          'Deretan kafe di tepi kaldera dengan panorama matahari terbit di balik Gunung Batur dan hamparan kabut tipis di atas danau.',
      },
      {
        id: 'jimbaran',
        name: 'Teluk Jimbaran Seafood & Sunset',
        area: 'Jimbaran · Kuta Selatan',
        category: 'Kuliner & Sunset',
        rating: '4.7',
        bestTime: '17.00 – 21.00 WITA',
        description:
          'Santap malam hidangan laut bakar khas bumbu Bali langsung di atas pasir pantai sambil menikmati langit senja dan debur ombak tenang.',
      },
      {
        id: 'tanah-lot',
        name: 'Pura Tanah Lot & Batu Bolong',
        area: 'Tabanan',
        category: 'Kuliner & Sunset',
        rating: '4.8',
        bestTime: '16.30 – 18.30 WITA',
        description:
          'Pura laut bersejarah di atas bongkahan batu besar yang tampak terapung saat air pasang dengan siluet senja paling populer di Bali.',
      },
    ],
    tips: [
      {
        title: 'Pesan Tiket Lebih Awal',
        detail: 'Pilih jadwal keberangkatan pagi (08.00 – 10.30) agar waktu check-in hotel dan eksplorasi hari pertama lebih maksimal.',
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
}

export const defaultDestinationCode = 'DPS'
