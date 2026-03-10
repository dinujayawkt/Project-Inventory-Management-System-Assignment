<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{






    public function login(Request $request)
    {

        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email',$request->email)->first();

        if(!$user || !Hash::check($request->password,$user->password)){
            return response()->json([
                'message' => 'Invalid credentials'
            ],401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token'=>$token,
            'user'=>$user
        ]);

    }

        // public function createUser(Request $request)
        // {

        //     if(auth()->user()->role !== 'admin'){
        //         return response()->json([
        //             'message' => 'Unauthorized'
        //         ],403);
        //     }


        //     $request->validate([
        //         'name'=>'required',
        //         'email'=>'required|email|unique:users',
        //         'password'=>'required|min:6',
        //         'role'=>'required'
        //     ]);

        //     $user = User::create([
        //         'name'=>$request->name,
        //         'email'=>$request->email,
        //         'password'=>Hash::make($request->password),
        //         'role'=>$request->role
        //     ]);

        //     return response()->json($user);

        // }


        public function createUser(Request $request)
        {
            $authUser = Auth::user();

            if (!$authUser || $authUser->role !== 'admin') {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            $request->validate([
                'name' => 'required',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6',
                'role' => 'required'
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role
            ]);

            return response()->json($user);
        }

        public function getUsers()
        {
            $users = User::all();

            return response()->json($users);
        }



}
