<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    /* Register user to system */
    public function register(Request $request)
    {
        try{
            $name = $request->name;
            $email = $request->email;
            $password = Hash::make($request->password);

            /* Validate Repeat Name or Email */
            $nameRepeat = User::where('name', '=', $name )
                -> orWhere('email', '=', $email);

            if($nameRepeat->count() > 0){
                return response()->json([
                    'message' => "Konto o podanym loginie lub haśle już istnieje!"
                ], Response::HTTP_BAD_REQUEST);
            }

            /* Create user */

            $user = new User();
            $user->name = $name;
            $user->email = $email;
            $user->password = $password;

            $user->save();

            return response()->json([
                'message' => "Konto zostało utworzone pomyślnie"
            ], Response::HTTP_OK);
        } catch(Exception $e){
            return response()->json([
                'message' => $e
            ], Response::HTTP_ERROR);
        }
    }

    /* Login user to system */
    public function login(Request $request)
    {
        try {
            $name = $request->name;
            $email = $request->email;
            $password = $request->password;

            /* Validate data */
            if(!Auth::attempt($request->only('email', 'password')))
            {
                return response()->json([
                    'message' => "Dane nieprawidłowe"
                ], Response::HTTP_UNAUTHORIZED);
            }

            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;
            $cookie = cookie('jwt', $token, 60 * 24);

            return response()->json([
                'message' => 'Sukces',
                'user' => $user
            ], Response::HTTP_OK)-> withCookie($cookie);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e
            ], Response::HTTP_ERROR);
        }

    }

    /* Return user object */
    public function user()
    {
        return Auth::user();
    }

    /* Logout user from system */
    public function logout(Request $request)
    {
        try{
            $cookie = \Cookie::forget('jwt');

            return response()->json([
                'message' => 'Sukces'
            ], Response::HTTP_OK)->withCookie($cookie);
        } catch(Exception $e) {
            return response()->json([
                'response' => $e
            ], Response::HTTP_Error)->withCookie($cookie);
        }

    }
}
