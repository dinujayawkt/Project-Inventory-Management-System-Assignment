<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index()
    {
        return response()->json(
            Item::with('place')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|unique:items,code',
            'quantity' => 'required|integer|min:0',
            'place_id' => 'required|exists:places,id'
        ]);

        $item = Item::create($request->all());
        $this->logActivity(
                'created',
                'item',
                $item->id,
                null,
                json_encode($item)
            );

        return response()->json($item, 201);
    }

    public function show(Item $item)
    {
        return response()->json($item->load('place'));
    }

    public function update(Request $request, Item $item)
    {
            $oldData = $item->toJson();

            $item->update($request->all());

            $this->logActivity(
                'updated',
                'item',
                $item->id,
                $oldData,
                json_encode($item)
            );

        return response()->json($item);
    }

    public function destroy(Item $item)
    {
        $item->delete();

        return response()->json([
            'message' => 'Item deleted successfully'
        ]);
    }
}