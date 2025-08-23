<?php

namespace App\Controllers;

use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class Users extends ResourceController
{
    protected $format = 'json';
    
    public function index()
    {
        return $this->respond(['message' => 'GET /users - index']);
    }

    public function show($id = null)
    {
        return $this->respond(['message' => "GET /users/$id - show"]);
    }

    public function new()
    {
        return $this->respond(['message' => 'GET /users/new - new']);
    }

    public function create()
    {
        return $this->respondCreated(['message' => 'POST /users - create']);
    }

    public function edit($id = null)
    {
        return $this->respond(['message' => "GET /users/$id/edit - edit"]);
    }

    public function update($id = null)
    {
        return $this->respond(['message' => "PUT/PATCH /users/$id - update"]);
    }

    public function delete($id = null)
    {
        return $this->respondDeleted(['message' => "DELETE /users/$id - delete"]);
    }
}
