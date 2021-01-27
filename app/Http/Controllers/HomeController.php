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

        $totais = [
            [
                "refere" => "ordenar",
                "acertos" => $ordenar->pluck("acertos")->sum(),
                "erros" => $ordenar->pluck("erros")->sum()
            ],
            [
                "refere" => "decifrar",
                "acertos" => $decifrar->pluck("acertos")->sum(),
                "erros" => $decifrar->pluck("erros")->sum()
            ],
            [
                "refere" => "total",
                "erros" => $resultados->pluck("erros")->sum(),
                "acertos" => $resultados->pluck("acertos")->sum()
            ]
        ];

        return $totais;
    }
}
