using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.SignalR;

namespace HauerBet;

public enum RESULT
{
    WIN= 1,
    LOSS= -1,
    PUSH= 0,
    PENDING= 2
}

public class Wager
{
    //try to connect to fixture database - can maybe make active/inactive fixtures? 
    
    public int Id { get; set; }
   [Key]
    public int Wager_Id { get; set; }
    public string FixtureID { get; set; }
    public string? Team { get; set; }
    public float WagerAmount { get; set; }
    public float Payout { get; set; }

    public string UserId {get; set;}

    public float Spread { get; set; }
    public int Vig {get; set;}

    public string WagerDate { get; set; }

    public RESULT Status { get; set; }

public Wager()
{

}
public Wager(Wager inWager)
{
    if (inWager.Id < 0)
        {
            this.Id = Random.Shared.Next(1000, 9999);
        }
        else
        {
            this.Id = inWager.Id;
        }
        if (inWager.Wager_Id < 0)
        {
            this.Wager_Id = Random.Shared.Next(1000, 9999);
        }
        else
        {
            this.Wager_Id = inWager.Wager_Id;
        }
    this.FixtureID = inWager.FixtureID;
        this.Team = inWager.Team;
        this.Payout = inWager.Payout;
        this.WagerAmount = inWager.WagerAmount;
        this.Spread = inWager.Spread;
        this.Vig = inWager.Vig;
        this.WagerDate = inWager.WagerDate;
        this.Status = inWager.Status;

}
    public Wager(int id, int wager_Id, string fixtureID, string team, float wagerAmount, float payout, string userId, float spread, int Vig, string wagerDate, RESULT status)
    {
        if (id < 0)
        {
            this.Id = Random.Shared.Next(1000, 9999);
        }
        else
        {
            this.Id = id;
        }
        if (wager_Id < 0)
        {
            this.Wager_Id = Random.Shared.Next(1000, 9999);
        }
        else
        {
            this.Wager_Id = wager_Id;
        }
        this.FixtureID = fixtureID;
        this.Team = team;
        this.Payout = payout;
        this.WagerAmount = wagerAmount;
        this.UserId = userId;
        this.Spread = spread;
        this.Vig = Vig;
        this.WagerDate = wagerDate;
        this.Status = status; 
    }
}