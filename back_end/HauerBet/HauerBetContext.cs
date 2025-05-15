using System;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace HauerBet;

public class HauerBetContext : DbContext
{
    public DbSet<Fixture> Fixtures { get; set; }
    public DbSet<Wager> Wagers { get; set; }

    public HauerBetContext()
    {

    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source=HauerBet.db");
}