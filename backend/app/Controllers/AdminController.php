<?php

namespace App\Controllers;   //

use CodeIgniter\API\ResponseTrait;
use CodeIgniter\Controller;

class AdminController extends Controller {
    
    use ResponseTrait;
    protected $db;


    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function getCategories() {
        // Query the categories table
        $builder = $this->db->table('categories');
        $categories = $builder->get()->getResult(); // returns an array of objects

        // Send the response
        return $this->respondCreated([
            'categories' => $categories
        ]);
    }

    public function addCategory() {
        $data = $this->request->getJSON(); // Get JSON payload

        if (!isset($data->name) || empty($data->name)) {
            return $this->failValidationErrors('Category name is required.');
        }

        $builder = $this->db->table('categories');

        $newCategory = [
            'id' => \Ramsey\Uuid\Uuid::uuid4()->toString(), // generate UUID
            'name' => $data->name,
            'description' => isset($data->description) ? $data->description : null
        ];

        $builder->insert($newCategory);

        return $this->respondCreated([
            'message' => 'Category added successfully',
            'category' => $newCategory
        ]);
    }
    public function deleteCategory($id = null) {
        if ($id === null) {
            return $this->fail('Category ID is required.');
        }

        $builder = $this->db->table('categories');

        $category = $builder->where('id', $id)->get()->getRow();

        if (!$category) {
            return $this->failNotFound('Category not found.');
        }

        $builder->where('id', $id)->delete();

        return $this->respondDeleted([
            'message' => 'Category deleted successfully',
            'category_id' => $id
        ]);
    }


}