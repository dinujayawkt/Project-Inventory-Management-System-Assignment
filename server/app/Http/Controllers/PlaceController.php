<?php

namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    public function index()
    {
        return response()->json(
            Place::with('cupboard')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'cupboard_id' => 'required|exists:cupboards,id'
        ]);

        $place = Place::create($request->all());

        return response()->json($place, 201);
    }

    public function show(Place $place)
    {
        return response()->json($place->load('cupboard'));
    }

    public function update(Request $request, Place $place)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $place->update($request->all());

        return response()->json($place);
    }

    public function destroy(Place $place)
    {
        $place->delete();

        return response()->json([
            'message' => 'Place deleted successfully'
        ]);
    }
}