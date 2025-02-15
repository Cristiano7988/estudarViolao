<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resultado extends Model
{
    use HasFactory;
    protected $fillable = ['acertos','erros'];
    public $timestamps = false;

    public function user() {
        $this->belongsTo(User::class);
    }
}
