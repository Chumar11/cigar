import { NextResponse } from 'next/server'
import { connectToDB } from '@/libs/mongodb'
import Inventory from '../../../../models/inventory'

export async function GET(request) {
  await connectToDB()

  try {
    const inventoryItems = await Inventory.find()
    return NextResponse.json(inventoryItems, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch inventory items.', error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectToDB()
    console.log('Connected to DB')

    const body = await request.json()
    console.log('Request body:', body)

    const newInventoryItem = new Inventory(body)
    const savedInventoryItem = await newInventoryItem.save()
    console.log('Item saved:', savedInventoryItem)

    return NextResponse.json(savedInventoryItem, { status: 201 })
  } catch (error) {
    console.error('POST error details:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// import { NextResponse } from 'next/server'
// import { connectToDB } from '@/libs/mongodb'
// import Inventory from '../../../../../models/inventory'

// export async function GET(request, { params }) {
//   await connectToDB()

//   try {
//     const { id } = params
//     const inventoryItem = await Inventory.findById(id)

//     if (!inventoryItem) {
//       return NextResponse.json({ message: 'Inventory item not found' }, { status: 404 })
//     }

//     return NextResponse.json(inventoryItem, { status: 200 })
//   } catch (error) {
//     return NextResponse.json({ message: 'Failed to fetch inventory item.', error: error.message }, { status: 500 })
//   }
// }

// export async function PUT(request, { params }) {
//   await connectToDB()

//   try {
//     const { id } = params
//     const body = await request.json()

//     const updatedItem = await Inventory.findByIdAndUpdate(
//       id,
//       body,
//       { new: true, runValidators: true }
//     )

//     if (!updatedItem) {
//       return NextResponse.json({ message: 'Inventory item not found' }, { status: 404 })
//     }

//     return NextResponse.json(updatedItem, { status: 200 })
//   } catch (error) {
//     return NextResponse.json({ message: 'Failed to update inventory item.', error: error.message }, { status: 400 })
//   }
// }

// export async function DELETE(request, { params }) {
//   await connectToDB()

//   try {
//     const { id } = params
//     const deletedItem = await Inventory.findByIdAndDelete(id)

//     if (!deletedItem) {
//       return NextResponse.json({ message: 'Inventory item not found' }, { status: 404 })
//     }

//     return NextResponse.json({ message: 'Inventory item deleted successfully' }, { status: 200 })
//   } catch (error) {
//     return NextResponse.json({ message: 'Failed to delete inventory item.', error: error.message }, { status: 500 })
//   }
// }
