import { NextResponse } from 'next/server'
import { connectToDB } from '@/libs/mongodb'
import Newsletter from '../../../../models/newsletter'

// POST - Add a new newsletter signup
export async function POST(request) {
  try {
    await connectToDB()

    // Get client IP address
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    // Get request body
    const body = await request.json()

    if (!body.email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await Newsletter.findOne({ email: body.email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 })
    }

    // Create new signup
    const newsletter = new Newsletter({
      email: body.email.toLowerCase(),
      source: body.source || 'landing_page',
      ipAddress: ip
    })

    await newsletter.save()

    return NextResponse.json({ message: 'Signup successful' }, { status: 201 })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json({ message: 'Failed to process signup' }, { status: 500 })
  }
}

// GET - Retrieve newsletter signups (admin only)
export async function GET(request) {
  try {
    await connectToDB()

    // Could add authentication check here
    // if (!isAdmin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const page = parseInt(url.searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const signups = await Newsletter.find().sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Newsletter.countDocuments()

    return NextResponse.json(
      {
        signups,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching newsletter signups:', error)
    return NextResponse.json({ message: 'Failed to fetch signups' }, { status: 500 })
  }
}
