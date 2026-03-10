<?php

namespace App\Http\Controllers;

use App\Models\BorrowRecord;
use App\Models\Item;
use Illuminate\Http\Request;

class BorrowRecordController extends Controller
{
    public function index()
    {
        return response()->json(
            BorrowRecord::with('item')->get()
        );
    }

    public function borrowItem(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'borrower_name' => 'required|string',
            'contact' => 'required|string',
            'quantity' => 'required|integer|min:1'
        ]);

        $item = Item::findOrFail($request->item_id);

        if ($item->quantity < $request->quantity) {
            return response()->json([
                'message' => 'Not enough stock available'
            ], 400);
        }

        // reduce stock
        $item->quantity -= $request->quantity;
        $item->save();

        $borrow = BorrowRecord::create($request->all());

        $this->logActivity(
            'borrowed',
            'item',
            $item->id,
            null,
            json_encode($borrow)
        );

        return response()->json($borrow, 201);
    }

    public function returnItem($id)
    {
        $borrow = BorrowRecord::findOrFail($id);
        $item = Item::findOrFail($borrow->item_id);

        // increase stock
        $item->quantity += $borrow->quantity;
        $item->save();

        $borrow->returned_at = now();
        $borrow->save();

                // Log return action
        $this->logActivity(
            'returned',
            'item',
            $item->id,
            null,
            json_encode($borrow)
        );

        return response()->json([
            'message' => 'Item returned successfully'
        ]);
    }



        public function borrowedItems()
        {
            $records = BorrowRecord::with('item')
                ->whereNull('returned_at')
                ->get();

            return response()->json($records);
        }

        public function returnedItems()
        {
            $records = BorrowRecord::with('item')
                ->whereNotNull('returned_at')
                ->get();

            return response()->json($records);
        }
}