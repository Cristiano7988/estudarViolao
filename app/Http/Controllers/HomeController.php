<?php

namespace App\Http\Controllers;

use App\Models\Resultado;
use App\Models\User;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $id = auth()->user()->id;

        $verifica = Resultado::where("exercicio", "cartas")
            ->where("user_id", $id)
            ->first();

        if(!$verifica) {
            Resultado::insert([
                [
                    'user_id' => $id,
                    'exercicio'=>'cartas',
                    'insignia'=>'Acordes',
                    'concluido'=>false
                ],
            ]);
        }
        return view('home');
    }

    public function getEstudantes() {
        $estudantes = User::all();

        $estudantes->map(function ($estudante) {
            return $estudante->resultados;
        });

        return $estudantes;
    }

    public function getExercicios() {
        // Pega todos os usuários, menos os de teste
        $resultados = Resultado::all()->whereNotIn("user_id", [1, 2]);
        $ordenar = $resultados->where("exercicio", "ordenar");
        $decifrar = $resultados->where("exercicio", "decifrar");
        $decifrar = $resultados->where("exercicio", "cartas");

        $totais = [
            [
                "refere" => "ordenar",
                "acertos" => $ordenar->pluck("acertos")->sum(),
                "erros" => $ordenar->pluck("erros")->sum(),
                "concluidos" => $ordenar->pluck("concluido")->sum()
            ],
            [
                "refere" => "decifrar",
                "acertos" => $decifrar->pluck("acertos")->sum(),
                "erros" => $decifrar->pluck("erros")->sum(),
                "concluidos" => $decifrar->pluck("concluido")->sum()
            ],
            [
                "refere" => "cartas",
                "acertos" => $decifrar->pluck("acertos")->sum(),
                "erros" => $decifrar->pluck("erros")->sum(),
                "concluidos" => $decifrar->pluck("concluido")->sum()
            ],
            [
                "refere" => "total",
                "erros" => $resultados->pluck("erros")->sum(),
                "acertos" => $resultados->pluck("acertos")->sum(),
                "concluidos" => $resultados->pluck("concluido")->sum()
            ]
        ];

        return $totais;
    }
}
