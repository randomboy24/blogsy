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

//    public function test(){
//      $email = \Config\Services::email();

//         // SMTP configuration (without .env)
//         $config['protocol']  = 'smtp';
//         $config['SMTPHost']  = 'smtp.gmail.com';
//         $config['SMTPUser']  = 'rathorjatin70@gmail.com';        // your Gmail
//         $config['SMTPPass']  = 'frhw elvi caif bwru';          // 16-digit App Password
//         $config['SMTPPort']  =  465;
//         $config['SMTPTimeout'] = 60;
//         $config['mailType']  = 'html'; 
//         $config['charset']   = 'utf-8';
//         $config['wordWrap']  = true;
//         $config['newline']   = "\r\n";
//         $config['SMTPCrypto'] = 'ssl'; // use "tls" if using port 587

//         $email->initialize($config);

//         // Sender & recipient
//         $email->setFrom('rathorjatin70@gmail.com', 'jatin');
//         $email->setTo('jatinthegod212@gmail.com');

//         // Subject & body
//         $email->setSubject('Test Email from CodeIgniter 4');
//         $email->setMessage('<h1>Hello!</h1><p>This is a test email using Gmail SMTP in CI4.</p>');

//         // Send email
//         if ($email->send()) {
//             echo "✅ Email sent successfully!";
//         } else {
//             echo "❌ Email sending failed.<br>";
//             print_r($email->printDebugger(['headers']));
//         }
//     return $this->respond(([
//         'message' => "testing...."
//     ]));
//    }

    public function logout() {
        set_cookie("token","");
    } 
}