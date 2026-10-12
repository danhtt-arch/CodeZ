// Cấu hình Tailwind dùng chung (đồng bộ với DESIGN.md). Nạp SAU script Tailwind CDN.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0056D2', light: '#2563EB' },
        surface: '#F8FAFC',
        ink: { DEFAULT: '#0F172A', soft: '#333333' },
      },
      fontFamily: {
        heading: ['Montserrat', 'Inter', 'sans-serif'],
        body: ['Roboto', '"Open Sans"', 'sans-serif'],
      },
    },
  },
};
