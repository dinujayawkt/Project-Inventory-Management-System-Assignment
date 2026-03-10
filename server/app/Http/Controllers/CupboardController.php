<?php

namespace App\Http\Controllers;

use App\Models\Cupboard;
use Illuminate\Http\Request;

class CupboardController extends Controller
{
    /**
     * Display all cupboards
     */
    public function index()
    {
        return response()->json(Cupboard::all());
    }

    /**
     * Store a new cupboard
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $cupboard = Cupboard::create([
            'name' => $request->name
        ]);

        return response()->json($cupboard, 201);
    }

    /**
     * Show single cupboard
     */
    public function show(Cupboard $cupboard)
    {
        return response()->json($cupboard);
    }

    /**
     * Update cupboard
     */
    public function update(Request $request, Cupboard $cupboard)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $cupboard->update([
            'name' => $request->name
        ]);

        return response()->json($cupboard);
    }

    /**
     * Delete cupboard
     */
    public function destroy(Cupboard $cupboard)
    {
        $cupboard->delete();

        return response()->json([
            'message' => 'Cupboard deleted successfully'
        ]);
    }
}