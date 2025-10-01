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
            'createdAt' => date('Y-m-d H:i:s'),
            'updatedAt' => date('Y-m-d H:i:s')
        ];
        
        try {
            $builder->insert($data);
            return $this->respondCreated([
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
            // $blogs = $builder->get()->getResultArray();
            $builder->select('blogs.id,blogs.title,blogs.content,blogs.createdAt,users.name as author');
            $builder->join('users','users.id = blogs.authorId');
            $blogs = $builder->get()->getResult();
            return $this->respond([
                'message' => 'OK',
                'blogs' => $blogs
            ]);
        } catch ( DatabaseException $e) {
            log_message('error', 'General Error during getBlogs: ' . $e->getMessage());
            return $this->failServerError("An unexpected error occured during getBlogs");
        }
    }   

    public function getBlog($id) {
        $builder = $this->db->table("blogs");
        try {
            $builder->select('blogs.id, blogs.title, blogs.content, blogs.createdAt, users.name as author');
            $builder->join('users', 'users.id = blogs.authorId');
            $builder->where('blogs.id', $id);

            $blog = $builder->get()->getRow(); // single row

            if (!$blog) {
                return $this->failNotFound("Blog not found");
            }

            return $this->respond([
                'message' => 'OK',
                'blog' => $blog
            ]);
        } catch (DatabaseException $e) {
            log_message('error', 'General Error during getBlog: ' . $e->getMessage());
            return $this->failServerError("An unexpected error occurred during getBlog");
        }
    }


    public function likeBlog() {
        // 1. Get blog ID from request body
        $json = $this->request->getJSON(true);
        $blogId = $json['blogId'] ?? null;

        if (!$blogId) {
            return $this->failValidationErrors('Blog ID is required.');
        }

        // 2. Get user ID from JWT cookie
        $jwt = $this->request->getCookie("token");
        if (!$jwt) {
            return $this->failUnauthorized('JWT token is missing.');
        }

        try {
            $decode = JWT::decode($jwt, new Key("some secret key", "HS256"));
            $userId = $decode->userId;
        } catch (\Exception $e) {
            log_message('error', 'JWT decode error: ' . $e->getMessage());
            return $this->failUnauthorized('Invalid token.');
        }   

        // 3. Insert like into database
        $builder = $this->db->table('blog_likes');

        // Optional: prevent duplicate likes
        $existing = $builder->where(['blog_id' => $blogId, 'user_id' => $userId])->get()->getRow();
        if ($existing) {
            return $this->fail('You already liked this blog.');
        }

        try {
            $builder->insert([
                'blog_id' => $blogId,
                'user_id' => $userId,
                'created_at' => date('Y-m-d H:i:s')
            ]);

            return $this->respondCreated([
                'message' => 'Blog liked successfully',
                'blog_id' => $blogId,
                'user_id' => $userId
            ]);
        } catch (\Exception $e) {
            log_message('error', 'Database error in likeBlog: ' . $e->getMessage());
            return $this->failServerError('An unexpected error occurred while liking the blog.');
        }
    }
    
 public function unlikeBlog() {
        // 1. Get blog ID from request body
        $json = $this->request->getJSON(true);
        $blogId = $json['blogId'] ?? null;

        if (!$blogId) {
            return $this->failValidationErrors('Blog ID is required.');
        }

        // 2. Get user ID from JWT cookie
        $jwt = $this->request->getCookie("token");
        if (!$jwt) {
            return $this->failUnauthorized('JWT token is missing.');
        }

        try {
            $decode = JWT::decode($jwt, new Key("some secret key", "HS256"));
            $userId = $decode->userId;
        } catch (\Exception $e) {
            log_message('error', 'JWT decode error: ' . $e->getMessage());
            return $this->failUnauthorized('Invalid token.');
        }

        // 3. Delete the like from database
        $builder = $this->db->table('blog_likes');

        // Check if the like exists
        $existing = $builder->where(['blog_id' => $blogId, 'user_id' => $userId])->get()->getRow();
        if (!$existing) {
            return $this->failNotFound('Like does not exist.');
        }

        try {
            $builder->where(['blog_id' => $blogId, 'user_id' => $userId])->delete();

            return $this->respondDeleted([
                'message' => 'Like removed successfully',
                'blog_id' => $blogId,
                'user_id' => $userId
            ]);
        } catch (\Exception $e) {
            log_message('error', 'Database error in removeLike: ' . $e->getMessage());
            return $this->failServerError('An unexpected error occurred while removing the like.');
        }
    }
    public function getBlogLikes($blogId = null) {
    if (!$blogId) {
        return $this->failValidationError('Blog ID is required.');
    }

    // Get user ID from JWT cookie
    $jwt = $this->request->getCookie("token");
    $userId = null;

    if ($jwt) {
        try {
            $decode = JWT::decode($jwt, new Key("some secret key", "HS256"));
            $userId = $decode->userId;
        } catch (\Exception $e) {
            log_message('error', 'JWT decode error: ' . $e->getMessage());
            // Not failing here because user may not be logged in
        }
    }

    $builder = $this->db->table('blog_likes');

    // Total likes
    $count = $builder->where('blog_id', $blogId)->countAllResults(false);

    // Whether current user liked
    $liked = false;
    if ($userId) {
        $liked = (bool) $builder
            ->where(['blog_id' => $blogId, 'user_id' => $userId])
            ->get()
            ->getRow();
    }

    return $this->respond([
        'liked' => $liked,
        'count' => $count
    ]);
}

public function searchBlogs()
{
    $query = $this->request->getGet('q'); // from ?q=...
    $builder = $this->db->table("blogs");
    $builder->select('blogs.id, blogs.title, blogs.content, blogs.createdAt, users.name as author');
    $builder->join('users', 'users.id = blogs.authorId');

    if ($query) {
        // STARTS WITH query (case-insensitive)
        $builder->like('blogs.title', $query, 'after'); 
        // 'after' ensures it matches only at the beginning
    }

    try {
        $blogs = $builder->get()->getResult();
        return $this->respond([
            'message' => 'OK',
            'blogs' => $blogs
        ]);
    } catch (DatabaseException $e) {
        log_message('error', 'General Error during searchBlogs: ' . $e->getMessage());
        return $this->failServerError("An unexpected error occurred during searchBlogs");
    }
}


}