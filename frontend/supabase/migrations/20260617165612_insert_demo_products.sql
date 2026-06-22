-- Insert demo products
INSERT INTO products (category_id, name_ru, name_uz, slug, description_ru, description_uz, price, old_price, stock, brand, specs, images, is_featured, is_new) VALUES
-- Готовые ПК
(1, 'Игровой ПК RTX 4070', 'Oyin PK RTX 4070', 'gaming-pc-rtx-4070', 'Мощный игровой ПК с RTX 4070, Ryzen 7 7800X3D, 32GB RAM', 'RTX 4070, Ryzen 7 7800X3D, 32GB RAM bilan kuchli oyun PK', 28000000, 32000000, 5, 'PcShop_uz', '{"CPU": "Ryzen 7 7800X3D", "GPU": "RTX 4070 12GB", "RAM": "32GB DDR5", "SSD": "1TB NVMe", "PSU": "750W 80+ Gold"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], true, true),

(1, 'Игровой ПК RTX 4080', 'Oyin PK RTX 4080', 'gaming-pc-rtx-4080', 'Топовый игровой ПК с RTX 4080, Intel i9-14900K, 64GB RAM', 'RTX 4080, Intel i9-14900K, 64GB RAM bilan eng yaxshi oyun PK', 45000000, 52000000, 3, 'PcShop_uz', '{"CPU": "Intel i9-14900K", "GPU": "RTX 4080 16GB", "RAM": "64GB DDR5", "SSD": "2TB NVMe", "PSU": "1000W 80+ Platinum"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], true, true),

-- Процессоры
(2, 'AMD Ryzen 9 7950X', 'AMD Ryzen 9 7950X', 'amd-ryzen-9-7950x', '16 ядер, 32 потока, базовая частота 4.5 GHz', '16 yadro, 32 oqim, bazaviy chastota 4.5 GHz', 8500000, 9000000, 15, 'AMD', '{"Cores": "16", "Threads": "32", "Base Clock": "4.5 GHz", "Boost Clock": "5.7 GHz", "TDP": "170W"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], true, false),

(2, 'Intel Core i9-14900K', 'Intel Core i9-14900K', 'intel-core-i9-14900k', '24 ядра, 32 потока, базовая частота 3.2 GHz', '24 yadro, 32 oqim, bazaviy chastota 3.2 GHz', 9200000, 9800000, 12, 'Intel', '{"Cores": "24", "Threads": "32", "Base Clock": "3.2 GHz", "Boost Clock": "6.0 GHz", "TDP": "125W"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], true, false),

(2, 'AMD Ryzen 7 7800X3D', 'AMD Ryzen 7 7800XD', 'amd-ryzen-7-7800x3d', '8 ядер, 16 потоков, технология 3D V-Cache', '8 yadro, 16 oqim, 3D V-Cache texnologiyasi', 6500000, NULL, 20, 'AMD', '{"Cores": "8", "Threads": "16", "Base Clock": "4.2 GHz", "Boost Clock": "5.0 GHz", "TDP": "120W"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], false, true),

-- Видеокарты
(3, 'NVIDIA RTX 4090', 'NVIDIA RTX 4090', 'nvidia-rtx-4090', '24GB GDDR6X, Ray Tracing, DLSS 3.0', '24GB GDDR6X, Ray Tracing, DLSS 3.0', 28000000, 30000000, 4, 'NVIDIA', '{"Memory": "24GB GDDR6X", "Clock": "2520 MHz", "Power": "450W", "Ports": "3x DP, 1x HDMI"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], true, false),

(3, 'NVIDIA RTX 4070 Ti', 'NVIDIA RTX 4070 Ti', 'nvidia-rtx-4070-ti', '12GB GDDR6X, Ray Tracing, DLSS 3.0', '12GB GDDR6X, Ray Tracing, DLSS 3.0', 12500000, 13500000, 8, 'NVIDIA', '{"Memory": "12GB GDDR6X", "Clock": "2610 MHz", "Power": "285W", "Ports": "3x DP, 1x HDMI"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], true, false),

(3, 'AMD RX 7900 XTX', 'AMD RX 7900 XTX', 'amd-rx-7900-xtx', '24GB GDDR6, FSR 3.0', '24GB GDDR6, FSR 3.0', 18500000, 19500000, 6, 'AMD', '{"Memory": "24GB GDDR6", "Clock": "2500 MHz", "Power": "355W", "Ports": "2x DP, 1x HDMI, 1x USB-C"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], false, true),

-- Материнские платы
(4, 'ASUS ROG Maximus Z790 Hero', 'ASUS ROG Maximus Z790 Hero', 'asus-rog-maximus-z790-hero', 'Intel LGA 1700, DDR5, WiFi 6E', 'Intel LGA 1700, DDR5, WiFi 6E', 7500000, 8000000, 7, 'ASUS', '{"Socket": "LGA 1700", "Memory": "DDR5", "PCIe": "5.0", "WiFi": "6E"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], true, false),

(4, 'MSI MPG X670E Carbon WiFi', 'MSI MPG X670E Carbon WiFi', 'msi-mpg-x670e-carbon-wifi', 'AMD AM5, DDR5, WiFi 6E', 'AMD AM5, DDR5, WiFi 6E', 5500000, NULL, 10, 'MSI', '{"Socket": "AM5", "Memory": "DDR5", "PCIe": "5.0", "WiFi": "6E"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], false, true),

-- ОЗУ
(5, 'G.Skill Trident Z5 RGB 32GB DDR5-6000', 'G.Skill Trident Z5 RGB 32GB DDR5-6000', 'gskill-trident-z5-32gb-ddr5-6000', '32GB (2x16GB) DDR5-6000 CL30', '32GB (2x16GB) DDR5-6000 CL30', 2800000, 3000000, 25, 'G.Skill', '{"Capacity": "32GB", "Speed": "6000 MHz", "Latency": "CL30", "Type": "DDR5"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], true, false),

(5, 'Kingston Fury Beast 64GB DDR5-5200', 'Kingston Fury Beast 64GB DDR5-5200', 'kingston-fury-beast-64gb-ddr5-5200', '64GB (2x32GB) DDR5-5200 CL40', '64GB (2x32GB) DDR5-5200 CL40', 4200000, NULL, 15, 'Kingston', '{"Capacity": "64GB", "Speed": "5200 MHz", "Latency": "CL40", "Type": "DDR5"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], false, false),

-- SSD
(6, 'Samsung 990 Pro 2TB', 'Samsung 990 Pro 2TB', 'samsung-990-pro-2tb', 'NVMe M.2, чтение 7450 МБ/с', 'NVMe M.2, oqish 7450 MB/s', 3200000, 3500000, 30, 'Samsung', '{"Capacity": "2TB", "Read": "7450 MB/s", "Write": "6900 MB/s", "Interface": "PCIe 4.0"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], true, false),

(6, 'WD Black SN850X 1TB', 'WD Black SN850X 1TB', 'wd-black-sn850x-1tb', 'NVMe M.2, чтение 7300 МБ/с', 'NVMe M.2, oqish 7300 MB/s', 1800000, 2000000, 45, 'Western Digital', '{"Capacity": "1TB", "Read": "7300 MB/s", "Write": "6300 MB/s", "Interface": "PCIe 4.0"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], false, true),

-- БП
(8, 'Corsair RM1000x 1000W', 'Corsair RM1000x 1000W', 'corsair-rm1000x-1000w', '80+ Gold, полностью модульный', '80+ Gold, toliq modulli', 2800000, 3000000, 12, 'Corsair', '{"Power": "1000W", "Efficiency": "80+ Gold", "Modular": "Full", "Fan": "135mm"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], true, false),

-- Мониторы
(11, 'LG UltraGear 27GP950-B', 'LG UltraGear 27GP950-B', 'lg-ultragear-27gp950-b', '27" 4K 144Hz IPS, HDR 600, G-Sync', '27" 4K 144Hz IPS, HDR 600, G-Sync', 8500000, 9000000, 8, 'LG', '{"Size": "27 inch", "Resolution": "4K", "Refresh": "144Hz", "Panel": "IPS"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], true, true),

(11, 'Samsung Odyssey G7 32"', 'Samsung Odyssey G7 32"', 'samsung-odyssey-g7-32', '32" QHD 240Hz VA, HDR 600', '32" QHD 240Hz VA, HDR 600', 7200000, NULL, 10, 'Samsung', '{"Size": "32 inch", "Resolution": "QHD", "Refresh": "240Hz", "Panel": "VA"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], false, true),

-- Клавиатуры
(12, 'Logitech G Pro X TKL', 'Logitech G Pro X TKL', 'logitech-g-pro-x-tkl', 'Mechanical, GX Red switches, RGB', 'Mexanik, GX Red switches, RGB', 1800000, 2000000, 20, 'Logitech', '{"Type": "Mechanical", "Switches": "GX Red", "Layout": "TKL", "Connection": "Wired"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], true, false),

-- Мышки
(13, 'Razer DeathAdder V3 Pro', 'Razer DeathAdder V3 Pro', 'razer-deathadder-v3-pro', 'Wireless, 30K DPI, 63g', 'Simli, 30K DPI, 63g', 2200000, 2500000, 15, 'Razer', '{"DPI": "30000", "Weight": "63g", "Connection": "Wireless", "Battery": "90h"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], true, false),

-- Наушники
(14, 'SteelSeries Arctis Nova Pro', 'SteelSeries Arctis Nova Pro', 'steelseries-arctis-nova-pro', 'Wireless, Active Noise Cancellation', 'Simli, Faol shovqinni bostirish', 4500000, 5000000, 8, 'SteelSeries', '{"Type": "Over-ear", "Connection": "Wireless", "ANC": "Yes", "Battery": "36h"}', ARRAY['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'], true, false);