// prisma/seed.ts — Database Seeder

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ─── Seed Categories ────────────────────────────────
  console.log('📦 Seeding categories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'skincare' },
      update: {},
      create: { name: 'Skincare', slug: 'skincare', isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'sunscreen' },
      update: {},
      create: { name: 'Sunscreen', slug: 'sunscreen', isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'makeup' },
      update: {},
      create: { name: 'Makeup', slug: 'makeup', isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'hair-care' },
      update: {},
      create: { name: 'Hair Care', slug: 'hair-care', isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'body-care' },
      update: {},
      create: { name: 'Body Care', slug: 'body-care', isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'fragrance' },
      update: {},
      create: { name: 'Fragrance', slug: 'fragrance', isActive: true },
    }),
  ]);
  console.log(`   ✅ ${categories.length} categories seeded`);

  // ─── Seed Admin User ────────────────────────────────
  console.log('👤 Seeding admin user...');
  const adminPassword = await bcrypt.hash('Admin@12345', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@ecommerce.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      phoneNumber: '081234567890',
    },
  });
  console.log(`   ✅ Admin created: ${admin.email}`);

  // ─── Seed Demo Customer ─────────────────────────────
  console.log('🛒 Seeding demo customer...');
  const customerPassword = await bcrypt.hash('Customer@12345', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'Demo Customer',
      email: 'customer@example.com',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      phoneNumber: '089876543210',
    },
  });

  // Buat cart untuk customer jika belum ada
  await prisma.cart.upsert({
    where: { userId: customer.id },
    update: {},
    create: { userId: customer.id },
  });

  // Buat alamat default untuk customer
  await prisma.address.upsert({
    where: { id: 'demo-address-id' },
    update: {},
    create: {
      id: 'demo-address-id',
      userId: customer.id,
      label: 'Rumah',
      receiver: 'Demo Customer',
      phone: '089876543210',
      fullAddress: 'Jl. Melati No. 24, Kelurahan Mawar, Kecamatan Sukajadi',
      city: 'Bandung',
      province: 'Jawa Barat',
      postalCode: '40162',
      isDefault: true,
    },
  });
  console.log(`   ✅ Customer created: ${customer.email}`);

  // ─── Seed Sample Products ───────────────────────────
  console.log('🛍️  Seeding sample products...');

  const skincareCategory = categories.find((c) => c.slug === 'skincare')!;
  const sunscreenCategory = categories.find((c) => c.slug === 'sunscreen')!;
  const makeupCategory = categories.find((c) => c.slug === 'makeup')!;

  const products = [
    {
      name: 'Hydrating Face Serum',
      description: 'Serum wajah dengan kandungan Hyaluronic Acid yang melembapkan kulit secara mendalam dan membuat kulit terasa kenyal sepanjang hari.',
      price: 185000,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'],
      rating: 4.5,
      categoryId: skincareCategory.id,
    },
    {
      name: 'Brightening Vitamin C Cream',
      description: 'Krim pencerah dengan Vitamin C stabil yang membantu meratakan warna kulit dan menyamarkan noda hitam secara bertahap.',
      price: 225000,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'],
      rating: 4.3,
      categoryId: skincareCategory.id,
    },
    {
      name: 'SPF 50+ Daily Sunscreen',
      description: 'Sunscreen ringan untuk pemakaian sehari-hari dengan perlindungan PA+++ dan SPF 50+. Tidak meninggalkan white cast.',
      price: 145000,
      stock: 80,
      images: ['https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400'],
      rating: 4.7,
      categoryId: sunscreenCategory.id,
    },
    {
      name: 'Matte Foundation',
      description: 'Foundation dengan formula full coverage yang tahan lama hingga 24 jam. Tersedia dalam 20 pilihan warna.',
      price: 295000,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1631214499382-5745b48c7c6f?w=400'],
      rating: 4.2,
      categoryId: makeupCategory.id,
    },
    {
      name: 'Acne Spot Treatment',
      description: 'Treatment jerawat dengan kandungan Salicylic Acid 2% yang efektif mengatasi jerawat dalam 24 jam.',
      price: 95000,
      stock: 60,
      images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'],
      rating: 4.6,
      categoryId: skincareCategory.id,
    },
    {
      name: 'Mineral Sunscreen SPF 30',
      description: 'Sunscreen mineral dengan bahan aktif Zinc Oxide yang aman untuk kulit sensitif dan kulit berjerawat.',
      price: 175000,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'],
      rating: 4.4,
      categoryId: sunscreenCategory.id,
    },
  ];

  let productCount = 0;
  for (const product of products) {
    await prisma.product.create({ data: product });
    productCount++;
  }
  console.log(`   ✅ ${productCount} products seeded`);

  console.log('\n✨ Database seed completed successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('   Admin  : admin@ecommerce.com  | Admin@12345');
  console.log('   Customer: customer@example.com | Customer@12345\n');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
