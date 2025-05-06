import { NextResponse } from 'next/server'
import { connectToDB } from '@/libs/mongodb'
import { Order } from '../../../../models/order'

export async function GET() {
  await connectToDB()

  try {
    const orders = await Order.find()
    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch orders.' }, { status: 500 })
  }
}

export async function POST(request) {
  await connectToDB()

  try {
    const body = await request.json()
    const newOrder = new Order(body)
    const savedOrder = await newOrder.save()
    return NextResponse.json(savedOrder, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}


