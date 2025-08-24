<?php

namespace App\Controllers;

helper('filesystem');
helper('cookie');
use CodeIgniter\Controller;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\Database\Exceptions\DatabaseException;
use Ramsey\Uuid\Uuid;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth extends Controller
{
    use ResponseTrait;
    

    private $secret = "some secret key";  //
    
    protected $format = 'json';
    protected $db;

    public function __construct() {
        $this->db = \Config\Database::connect();
    }

    public function signup()    
    {   
        // echo "db = " . dd($this->db->getDatabase());
        
        $json = $this->request->getJSON(true);
        if (empty($json)) {
            return $this->failValidationErrors('Invalid JSON input or empty request body.', 400);
        }
        $name = $json['name'] ?? null;
        $password = $json['password'] ?? null;
         if (empty($name) || empty($password)) {    
            return $this->failValidationErrors('Name, email, and password are required.', 400);
        }
        $uuid = Uuid::uuid4()->toString();
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $data = [
            'id' => $uuid,
            'name' => $name,
            'password' => $hashedPassword
        ];

        $builder = $this->db->table('users');

        try {
            $builder->insert($data);      
            
            $payload = [
                'userId' => $uuid,
                'name' => $name,
                'exp' => time() + 3600  
            ];

            $jwt = JWT::encode($payload,$this->secret,'HS256');

            set_cookie("token",$jwt,3600);

            return $this->respondCreated([
                'message' => 'User registered successfully.',
        ]);
        
        } catch (DatabaseException $e) {
            log_message('error', 'General Error during signup: ' . $e->getMessage());
            return $this->failServerError("An unexpected error occured during signup");
        }
    }

    public function signin()
    {
        $json = $this->request->getJSON(true);
        if (empty($json)) {
            return $this->failValidationErrors('Invalid JSON input or empty request body.', 400);
        }
        $name = $json['name'] ?? null;
        $password = $json['password'] ?? null;

        $builder = $this->db->table("users");


        try {
            $user = $builder->where('name',$name)->get()->getRowArray();
            if(!$user) {
                return $this->failNotFound("User not found");
            }
            if(!password_verify($password,$user['password'])) {
                return $this->failUnauthorized("Invalid credentials.");
            }

            $payload = [
                'userId' => $user['id'],
                'name' => $user['name'],
                'exp' => time() + 3600
            ];

            $jwt = JWT::encode($payload,$this->secret,'HS256');
            set_cookie("token",$jwt,3600);
            return $this->respond([
                'status' => 200,
                'message' => 'Login successful',
                ]);
        } catch(DatabaseException $e) {
            log_message('error', 'General Error during signup: ' . $e->getMessage());
            return $this->failServerError("An unexpected error occured during signup");
        }
    }

   public function testDb()
{
    try {
        // Attempt to connect
        $this->db = \Config\Database::connect();
        $this->db->initialize();

        if ($this->db->connID) {
            echo "✅ Connected! Database: " . $this->db->getDatabase() . "\n";
            echo "Connection ID: " . $this->db->connID;
        } else {
            echo "❌ Connection failed (connID is empty)";
        }
    } catch (\Exception $e) {
        // Catch any exception thrown by the DB connection
        echo "❌ Exception caught during DB connection: " . $e->getMessage() . "\n";
    }
}
}