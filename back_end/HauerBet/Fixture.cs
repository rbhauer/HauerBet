using System;

namespace HauerBet;

public class Fixture
{   
    public int Id{get; set;}

    public string FixtureID {get; set;}
    public string HomeTeam{get; set;}
    public string AwayTeam{get; set;}

    public float HomeLine{get; set;}

    public float AwayLine{get; set;}

    public int HomeVig{get; set;} 
    public int AwayVig{get; set;} 

    public string FixtureDate{get; set;} 

    public Fixture()
    {

    }

    public Fixture(Fixture inFixture)
{
    if (inFixture.Id < 0)
        {
            this.Id = Random.Shared.Next(1000, 9999);
        }
        else
        {
            this.Id = inFixture.Id;
        }       

        this.FixtureID = inFixture.FixtureID;
        this.HomeTeam = inFixture.HomeTeam;
        this.AwayTeam = inFixture.AwayTeam;
        this.HomeLine = inFixture.HomeLine;
        this.AwayLine = inFixture.AwayLine;
        this.HomeVig = inFixture.HomeVig;
        this.AwayVig = inFixture.AwayVig;
        this.FixtureDate = inFixture.FixtureDate;

}

    public Fixture(int id, string fixtureID, string homeTeam, string awayTeam, float homeLine, float awayLine, int homeVig, int awayVig, string fixtureDate)
    {
         if (id < 0){
            this.Id = Random.Shared.Next(1000,9999);
        }
        else{
            this.Id = id;
        }
        
        this.FixtureID = fixtureID;
        this.HomeTeam = homeTeam;
        this.AwayTeam = awayTeam;
        this.HomeLine = homeLine;
        this.AwayLine = awayLine;
        this.HomeVig = homeVig;
        this.AwayVig = awayVig;
        this.FixtureDate = fixtureDate;
    }
}