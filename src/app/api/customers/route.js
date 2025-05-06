import { NextResponse } from 'next/server'
import { connectToDB } from '@/libs/mongodb'
import Customer from '../../../../models/customer'

export async function POST(request) {
  await connectToDB()
  console.log('Connected to database')
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json({ message: 'Name and email are required fields' }, { status: 400 })
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email: body.email.toLowerCase() })
    if (existingCustomer) {
      return NextResponse.json({ message: 'Customer with this email already exists' }, { status: 409 })
    }

    // Create new customer
    const newCustomer = new Customer({
      name: body.name,
      email: body.email.toLowerCase(),
      isAdmin: body.isAdmin || false
      // No orders initially - they'll be added later
    })

    const savedCustomer = await newCustomer.save()

    return NextResponse.json(savedCustomer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ message: 'Failed to create customer', error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectToDB()

    // Simply fetch all customers
    const customers = await Customer.find().sort({ createdAt: -1 })

    return NextResponse.json(customers, { status: 200 })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ message: 'Failed to fetch customers', error: error.message }, { status: 500 })
  }
}
