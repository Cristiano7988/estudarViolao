<?php

namespace App\Http\Controllers;

use App\Models\Resultado;
use Illuminate\Http\Request;

class ExerciciosController extends Controller
{
    public function store(Request $request) {
        $id = 1;
        $exercicio = Resultado::find($id);

        if($request->resultado) {
            $exercicio->acertos = ++$exercicio->acertos;
        } else {
            $exercicio->erros = ++$exercicio->erros;
        };

        $exercicio->save();

        return $exercicio;
    }
}
