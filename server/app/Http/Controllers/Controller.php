<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

abstract class Controller
{

    protected function logActivity($action, $entityType, $entityId, $oldValue = null, $newValue = null)
    {
        ActivityLog::create([
            'user_id' => Auth::user()->id,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'old_value' => $oldValue,
            'new_value' => $newValue
        ]);
    }

}