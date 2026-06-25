// src/modules/dashboard/dashboard.service.ts
import { prisma } from '../../lib/prisma';

export async function getDashboardStatsService() {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    pendingOrders,
    ordersResult
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: 'PENDING' } }),
    prisma.order.findMany({
      where: { orderStatus: { not: 'CANCELED' } },
      select: { totalAmount: true },
    }),
  ]);

  // Hitung total revenue dari order yang tidak dibatalkan (asumsi Paid/Pending dihitung sebagai potensi revenue saat testing)
  const revenue = ordersResult.reduce((sum, order) => sum + Number(order.totalAmount), 0);

  // Ambil data chart penjualan
  const chartData = await getSalesReportService();

  return {
    revenue: {
      total: revenue,
      // Di sistem yang lebih kompleks, kita bisa hitung data "thisMonth" dan "growth"
      thisMonth: revenue, 
      growth: 0,
    },
    totalOrders,
    totalCustomers: totalUsers,
    totalProducts,
    pendingOrders,
    chart: chartData,
  };
}

export async function getSalesReportService() {
  const orders = await prisma.order.findMany({
    where: { orderStatus: { not: 'CANCELED' } },
    select: {
      totalAmount: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Group by month
  const salesByMonth: Record<string, number> = {};
  orders.forEach((order) => {
    const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
    salesByMonth[month] = (salesByMonth[month] || 0) + Number(order.totalAmount);
  });

  return Object.entries(salesByMonth).map(([name, total]) => ({ name, total }));
}
