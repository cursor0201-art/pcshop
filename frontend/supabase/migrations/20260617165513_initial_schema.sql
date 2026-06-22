-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name_ru TEXT NOT NULL,
  name_uz TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  name_ru TEXT NOT NULL,
  name_uz TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_ru TEXT,
  description_uz TEXT,
  price BIGINT NOT NULL,
  old_price BIGINT,
  stock INTEGER DEFAULT 0,
  specs JSONB DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  warranty_months INTEGER DEFAULT 12,
  brand TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  comment TEXT,
  total BIGINT NOT NULL,
  status TEXT DEFAULT 'new',
  telegram_message_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price BIGINT NOT NULL
);

-- Reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings (for Telegram bot config)
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name_ru, name_uz, slug) VALUES
('Готовые ПК', 'Tayyor PK', 'ready-pc'),
('Процессоры', 'Protserlar', 'processors'),
('Видеокарты', 'Videokartalar', 'videocards'),
('Материнские платы', 'Platalar', 'motherboards'),
('Оперативная память', ' operative xotira', 'ram'),
('SSD', 'SSD', 'ssd'),
('HDD', 'HDD', 'hdd'),
('Блоки питания', 'Blok pitaniya', 'psu'),
('Корпуса', 'Korpuslar', 'cases'),
('Кулеры', 'Kulerlar', 'coolers'),
('Мониторы', 'Monitorlar', 'monitors'),
('Клавиатуры', 'Klaviaturalar', 'keyboards'),
('Мышки', 'Sichqonchalar', 'mice'),
('Наушники', 'Naushniklar', 'headphones');

-- Insert settings for Telegram bot
INSERT INTO settings (key, value) VALUES
('telegram_bot_token', ''),
('telegram_chat_id', '');

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "categories_select" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "categories_insert" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "categories_update" ON categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "categories_delete" ON categories FOR DELETE TO authenticated USING (true);

-- RLS Policies for products (public read)
CREATE POLICY "products_select" ON products FOR SELECT TO anon USING (true);
CREATE POLICY "products_insert" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "products_update" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "products_delete" ON products FOR DELETE TO authenticated USING (true);

-- RLS Policies for orders (only authenticated)
CREATE POLICY "orders_insert" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "orders_select" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "orders_update" ON orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "orders_delete" ON orders FOR DELETE TO authenticated USING (true);

-- RLS Policies for order_items
CREATE POLICY "order_items_insert" ON order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "order_items_select" ON order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "order_items_update" ON order_items FOR UPDATE TO authenticated USING (true);

-- RLS Policies for reviews (public read, anon insert)
CREATE POLICY "reviews_select" ON reviews FOR SELECT TO anon USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "reviews_update" ON reviews FOR UPDATE TO authenticated USING (true);
CREATE POLICY "reviews_delete" ON reviews FOR DELETE TO authenticated USING (true);

-- RLS Policies for settings (authenticated only)
CREATE POLICY "settings_select" ON settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "settings_update" ON settings FOR UPDATE TO authenticated USING (true);