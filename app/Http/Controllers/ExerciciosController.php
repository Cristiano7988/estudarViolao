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
        $exercicio = Resultado::find($id);

        if ($request->resultado) {
            $exercicio->acertos = ++$exercicio->acertos;
        } else {
            $exercicio->erros = ++$exercicio->erros;
        };

        $exercicio->save();

        $dados['exercicio'] = $exercicio;
        $dados['nivel'] = $usuario->nivel;
        $dados['sub_nivel'] = $usuario->sub_nivel;

        return $dados;
    }

    public function storeNivel(Request $request)
    {
        $usuario = User::find($request->id);

        $usuario->nivel = $request->nivel;
        $usuario->sub_nivel = $request->sub_nivel;

        $usuario->save();

        return $usuario;
    }
}
