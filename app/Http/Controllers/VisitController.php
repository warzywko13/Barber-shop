<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

use App\Models\User;

class VisitController extends Controller
{
    public function get_all_visits(){
        try {
            $todayDate = date('Y-m-d');
            $visits = Visit::where('date', '>=', $todayDate)->get();

            return response()->json([
                'visits' => $visits
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'visits' => $e
            ], Response::HTTP_ERROR);
        }
    }

    public function get_visit(Request $request, $id){
        try{
            /* Find Visit from database */
            $visit = Visit::findOrFail($id);

            /* Return response to user */
            return response()->json([
                'visit' => $visit
            ], Response::HTTP_OK);
        } catch (Exception $e) {

            /* Return response if error */
            return response()->json([
                'visit' => $e
            ], Response::HTTP_ERROR);
        }
    }

    public function add_visit(Request $request){
        try{
            $service = $request->service;
            $date = $request->date;
            $time = $request->time;
            $serviceTime = $request->serviceTime;
            $user = $request->user;

            /* Validate exacly the same visit time */
            $visitRepeat = Visit::where('date', '=', $date)->where('time', '=', $time);

            if($visitRepeat->count() > 0){
                return response()->json([
                    'message' => "Wizyta koliduje z inną wizytą!"
                ], Response::HTTP_UNAUTHORIZED);
            }

            /* Validate next visit time (time + sertviceTime)*/
            $startTime = date("H:i:s", strtotime($time));
            $finishTime = date("H:i:s", strtotime($startTime. ' +'.$serviceTime.' minutes'));
            $visitTimeRepeat = Visit::whereRaw("AddTime(time, IF(serviceTime = 60, '01:00:00', CONCAT('00:', serviceTime, ':00'))) BETWEEN ? AND ?", [$startTime, $finishTime])
                ->where('date', '=', $date)
                ->orWhereBetween('time', [$startTime, $finishTime])
                ->where('date', '=', $date)
                ->get();

            if($visitTimeRepeat->count() > 0){
                return response()->json([
                    'message' => "Czas wizyty koliduje z inną wizytą"
                ], Response::HTTP_UNAUTHORIZED);
            }

            /* Create new Visit */
            $visit = new Visit();

            $visit->service = $service;
            $visit->date = $date;
            $visit->time = $time;
            $visit->serviceTime = $serviceTime;
            $visit->user = $user;

            $visit->save();

            /* Return response to user */
            return response()->json([
                'message' => "Wizyta została dodana pomyślnie"
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            /* Return response to user if error */
            return response()->json([
                'message' => $e
            ], Response::HTTP_ERROR);
        }
    }

    public function edit_visit(Request $request, $id){
        try{
            $visit = Visit::findOrFail($id);
            $auth_user = Auth::user()->name;

            $visit_user = $visit->user;
            $id = $visit->id;
            $service = $request->service;
            $date = $request->date;
            $time = $request->time;
            $serviceTime = $request->serviceTime;

            /* Validate is the same user */
            if($visit_user != $auth_user){
                return response()->json([
                    'error' => "Użytkownik niepoprawny!"
                ], Response::HTTP_UNAUTHORIZED);
            }

            /* Validate exacly the same visit time */
            $visitRepeat = Visit::where('date', '=', $date)->where('time', '=', $time)->where('id', '<>', $id);

            if($visitRepeat->count() > 0){
                return response()->json([
                    'message' => "Wizyta koliduje z inną wizytą!"
                ], Response::HTTP_UNAUTHORIZED);
            }

            /* Validate date with the current day and time in past */
            $currentDateTime = strtotime(date('Y-m-d H:i:s'));
            $formDateTime = strtotime($date . ' ' . $time);

            if($formDateTime < $currentDateTime){
                return response()->json([
                    'message' => "Data i czas wizyty nie może być z przeszłości!"
                ], Response::HTTP_UNAUTHORIZED);
            }

            /* Validate next visit time (time + sertviceTime)*/
            $startTime = date("H:i:s", strtotime($time));
            $finishTime = date("H:i:s", strtotime($startTime. ' +'.$serviceTime.' minutes'));

            $visitTimeRepeat = Visit::where(function($query) use($startTime, $finishTime) {
                $query->whereRaw("AddTime(time, IF(serviceTime = '60', '01:00:00', CONCAT('00:', serviceTime, ':00'))) BETWEEN ? AND ?", [$startTime, $finishTime]);
            })->where('id', '<>', $id)->get();

            /* Return response to client if visit colidate with another */
            if($visitTimeRepeat->count() > 0){
                return response()->json([
                    'message' => "Czas wizyty koliduje z inną wizytą"
                ], Response::HTTP_UNAUTHORIZED);
            }

            /* Update Visit */
            Visit::where('id', '=', $id)->update([
                'service' => $service,
                'date' => $date,
                'time' => $time,
                'serviceTime' => $serviceTime
            ]);

            /* Return response to client */
            return response()->json([
                'message' => "Wizyta została zaktualizowana pomyślnie"
            ], Response::HTTP_OK);
        } catch(Exception $e) {
            /* Return response if error */
            return response()->json([
                'message' => $e
            ], Response::HTTP_ERROR);
        }
    }

    public function delete_visit(Request $request, $id){
       try{
            /* Delete visit from database */
            $visit = Visit::findOrFail($id);
            $visit->delete();
        } catch (Exception $e){
            /* Return response if error */
            return response()->json([
                'response' => $e
            ], Response::HTTP_ERROR);
        }
    }
}
