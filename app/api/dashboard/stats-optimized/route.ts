import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      stats: {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrdersToday: 0,
        revenueToday: 0
      }
    }
  })
}
