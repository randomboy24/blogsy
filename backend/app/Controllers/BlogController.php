<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;
use CodeIgniter\Controller;
use CodeIgniter\Database\Exceptions\DatabaseException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Ramsey\Uuid\Uuid;

class BlogController extends Controller {
    
    use ResponseTrait;
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function setBlog(){

        $json = $this->request->getJSON(true);
        $jwt = $this->request->getCookie("token");

        $title = $json['title'] ?? null;
        $content = $json['content'] ?? null;

        $decode = JWT::decode($jwt,new Key("some secret key","HS256"));

        $userId = $decode->userId;

        $uuid = Uuid::uuid4()->toString();

        $builder = $this->db->table('blogs');

        $data = [
            'id' => $uuid,
            'title' => $title,
            'content' => $content,
            'authorId' => $userId,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        try {
            $builder->insert($data);
            return $this->respondCreated([
                'message' => 'Blog created successfully.',
                'blog' => $data
            ]);
        } catch ( DatabaseException $e) {
            log_message('error', 'General Error during setBlog: ' . $e->getMessage());
            return $this->failServerError("An unexpected error occured during setBlog");
        }
    }

    public function getBlogs() {        
        $builder = $this->db->table("blogs");
        try {
            $blogs = $builder->get()->getResultArray();

            return $this->respond([
                'message' => 'OK',
                'blogs' => $blogs
            ]);
        } catch ( DatabaseException $e) {
            log_message('error', 'General Error during getBlogs: ' . $e->getMessage());
            return $this->failServerError("An unexpected error occured during getBlogs");
        }
    }
}