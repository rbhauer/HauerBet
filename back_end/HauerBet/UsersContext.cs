using System;
using Microsoft.EntityFrameworkCore;

namespace HauerBet;

public class UsersContext : DbContext
{
    public DbSet<PrivateUser> users {get;set;}

    public UsersContext(){
        
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source=users.db");
}