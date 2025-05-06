import { NextResponse } from 'next/server'
import { connectToDB } from '@/libs/mongodb'
import Inventory from '../../../../models/inventory'


export async function GET(request) {
  try {
  
    await connectToDB()
    const url = new URL(request.url)
    const upc = url.searchParams.get('code')

    if (!upc) {
      return NextResponse.json({ message: 'UPC code is required as a query parameter' }, { status: 400 })
    }


    const product = await Inventory.findOne({ upc })

    if (!product) {
      return NextResponse.json({ message: 'Product not found with the specified UPC code' }, { status: 404 })
    }


    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    console.error('Error fetching product by UPC:', error)
    return NextResponse.json({ message: 'Failed to fetch product', error: error.message }, { status: 500 })
  }
}
