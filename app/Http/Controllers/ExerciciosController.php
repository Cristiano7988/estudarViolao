<?php

namespace App\Http\Controllers;

use App\Models\Resultado;
use App\Models\User;
use Illuminate\Http\Request;

class ExerciciosController extends Controller
{
    public function store(Request $request)
    {
        $id = $request->id;
        $usuario = User::find($id);
        $exercicio = $usuario->resultados->where('exercicio', $request->exercicio)->first();
        
        if ($request->resultado) {
            $exercicio->acertos = ++$exercicio->acertos;
        } else {
            $exercicio->erros = ++$exercicio->erros;
        };

        $exercicio->save();

        $dados['exercicio'] = $exercicio;

        return $dados;
    }

    public function getResultados(Resultado $resultado) {
        return $resultado;
    }

    public function conclui(Resultado $resultado) {
        $resultado->concluido = true;
        $resultado->save();
    }
}
