import { NextResponse } from 'next/server'
import { connectToDB } from '@/libs/mongodb'
import { Order } from '../../../../../models/order'
// import { Order } from '../../../../models/order'

export async function DELETE(request, { params }) {
  await connectToDB()

  try {
    const { id } = params
    console.log('deleteid', id)

    const deletedOrder = await Order.findByIdAndDelete(id)

    if (!deletedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete order.', error: error.message }, { status: 500 })
  }
}
