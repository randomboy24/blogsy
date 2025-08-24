<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;
use CodeIgniter\Controller;

class BlogController extends Controller {
    
    use ResponseTrait;

    public function test(){
        return $this->respondCreated([
            'message' => "working"
        ]);
    }
}