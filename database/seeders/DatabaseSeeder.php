<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $admin = Role::create(['name' => 'Admin']);
        $operativo = Role::create(['name' => 'Operativo']);

        Permission::create(['name' => 'dashboard'])->syncRoles($admin);
        Permission::create(['name' => 'users'])->syncRoles($admin, $operativo);

        \App\Models\User::factory()->create([
            'name' => 'Usuario administrador',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345678')
        ])->assignRole('Admin');

        \App\Models\User::factory()->create([
            'name' => 'Usuario operativo',
            'email' => 'operativo@gmail.com',
            'password' => Hash::make('12345678')
        ])->assignRole('Operativo');
    }
}
