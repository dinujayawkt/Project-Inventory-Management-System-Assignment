<?php

namespace App\Models;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
        protected $fillable = [
        'user_id',
        'action',
        'entity_type',
        'entity_id',
        'old_value',
        'new_value'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
