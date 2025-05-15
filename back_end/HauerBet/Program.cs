using System.Text.Json;
using HauerBet;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.OpenApi.Expressions;
using System.Text.Json.Nodes;



var builder = WebApplication.CreateBuilder(args);

string activeUser = "";

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
    builder =>
    {
        builder.WithOrigins("http://127.0.0.1")
        .AllowCredentials()
        .AllowAnyHeader()
        .SetIsOriginAllowed((host) => true)
        .AllowAnyMethod();
    });
});

builder.Services.AddAuthorization();
builder.Services.AddAuthentication("BasicAuthentication").AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("basic", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "basic",
        In = ParameterLocation.Header,
        Description = "Basic Authorization header using the Bearer scheme."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "basic"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();




// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAllOrigins");

app.MapGet("/Reset", () =>
{
    using (DbContext db = new HauerBetContext())
    {
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        using (StreamReader r = new StreamReader("FixturesBackend.json"))
        {
            string? json = r.ReadToEnd();
            List<Fixture>? source = JsonSerializer.Deserialize<List<Fixture>>(json, options);
            if (source != null)
            {
                foreach (var item in source)
                {
                    db.Add<Fixture>(item);
                }
            }

        }

        db.SaveChanges();
        db.Database.ExecuteSqlRaw("PRAGMA journal_mode=WAL;");
    }



})
.WithName("Reset Data")
.WithOpenApi();

app.MapPost("/login", (PublicUser user) =>
{

    using (var db = new UsersContext())
    {
        var pu = db.users.FirstOrDefault(u => u.Username == user.userName);
        if (pu != null)
        {
            return Results.Ok(pu);
        }
        else
        {
            return Results.Unauthorized();
        }
    }
}).WithName("Login User").WithOpenApi().RequireAuthorization(new AuthorizeAttribute() { AuthenticationSchemes = "BasicAuthentication" });

app.MapGet("/getSports", () => {
    
    return BetGetter.getBetList();

}).WithName("Get Sports").WithOpenApi();

app.MapGet("/ResetUserInfo", () =>
{
    using (DbContext db = new UsersContext())
    {
        db.Database.ExecuteSqlRaw("DELETE FROM users;");
        db.SaveChanges();
        db.Database.ExecuteSqlRaw("PRAGMA journal_mode=WAL;");
    }

})
.WithName("Reset User Info")
.WithOpenApi();

app.MapGet("/ResetWagerInfo", () =>
{
    using (DbContext db = new HauerBetContext())
    {
        db.Database.ExecuteSqlRaw("DELETE FROM Wagers;");
        db.SaveChanges();
        db.Database.ExecuteSqlRaw("PRAGMA journal_mode=WAL;");
    }

})
.WithName("Reset Wager Info")
.WithOpenApi();

app.MapGet("/ResetFixtureInfo", () =>
{
    using (DbContext db = new HauerBetContext())
    {
        db.Database.ExecuteSqlRaw("DELETE FROM Fixtures;");
        db.SaveChanges();
        db.Database.ExecuteSqlRaw("PRAGMA journal_mode=WAL;");
    }

})
.WithName("Reset Fixture Info")
.WithOpenApi();


app.MapPost("/newUser", (PublicUser user) =>
{
    try
    {
        using (UsersContext db = new UsersContext())
        {
            db.users.Add(user.GetPrivateUser());
            db.SaveChanges();
            db.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");
        }
    }
    catch (Exception e)
    {
        return Results.BadRequest(e.Message);
    }
    return Results.Ok("User created successfully");
}).WithName("Create New User").WithOpenApi();

app.MapPost("/setActiveUser", (PublicUser user) =>
{
    try
    {
        activeUser = user.userName;
    }
    catch (Exception e)
    {
        return Results.BadRequest(e.Message);
    }
    return Results.Ok("Active user updated successfully");
}).WithName("Set Active User").WithOpenApi();

app.MapGet("/getActiveUsername", () =>
{
    if (activeUser != "")
    {
        return activeUser;
    }
    return "Please Login";
}).WithName("Get Active Username").WithOpenApi();




app.MapGet("/getFixtures", () =>
{
    var options = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    };

    using (HauerBetContext db = new HauerBetContext())
    {
        List<Fixture>? source = db.Fixtures.ToList();
        return source;
    }
}).WithOpenApi().WithName("Get Fixtures");

app.MapGet("/getActiveWagers", () =>
{
    var options = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    };

    using (HauerBetContext db = new HauerBetContext())
    {
        List<Wager>? source = db.Wagers.ToList();
        if (activeUser != null)
        {
            return source.Where(w => w.UserId == activeUser);
        }
        else
        {
            return [];
        }

    }
}).WithOpenApi().WithName("Get Active Wagers");

app.MapGet("/getActiveBalance", () =>
{
    using (UsersContext db = new UsersContext())
    {
        List<PrivateUser> source = db.users.ToList();
        if (activeUser != null)
        {
            foreach (PrivateUser user in source)
            {
                if (user.Username == activeUser)
                {
                    return user.balance;
                }
            }
            return -100;
        }
        else
        {
            return -100;
        }
    }

}).WithOpenApi().WithName("Get Active Balance");

PrivateUser findActiveUser()
{
    using (UsersContext db = new UsersContext())
    {
        List<PrivateUser> source = db.users.ToList();
        foreach (PrivateUser user in source)
        {
            if (user.Username == activeUser)
            {
                return user;
            }
        }
    }
    return null;

}




app.MapPut("/updateActiveBalance_wager", (Wager inWager) =>
{
    PrivateUser temp = findActiveUser();
    temp.balance -= inWager.WagerAmount;
    using (UsersContext db = new UsersContext())
    {
        db.Update<PrivateUser>(temp);
        db.SaveChanges();
    }

    return activeUser;

}).WithOpenApi().WithName("Update Active Balance Wager");

app.MapPut("/updateWagerStatus", (Wager inWager) =>
{
    using (HauerBetContext db = new HauerBetContext())
    {
        db.Update<Wager>(inWager);
        db.SaveChanges();
    }

    return activeUser;

}).WithOpenApi().WithName("Update Wager Status");

app.MapPut("/depositFunds", (Balance inBalance) =>
{
    PrivateUser temp = findActiveUser();
    temp.balance += inBalance.realBalance;
    using (UsersContext db = new UsersContext())
    {
        db.Update<PrivateUser>(temp);
        db.SaveChanges();
    }

    return activeUser;

}).WithOpenApi().WithName("Deposit Funds");

app.MapPost("/addWager", (Wager inWager) =>
{
    using (HauerBetContext db = new HauerBetContext())
    {
        Wager tempWager = new Wager(inWager);
        if (activeUser != null)
        {
            tempWager.UserId = activeUser;
        }
        db.Add<Wager>(tempWager);
        db.SaveChanges();
        return inWager;
    }
}).WithOpenApi().WithName("Add Wager");

app.MapPost("/addFixtures", (Fixture inFixture) =>
{
    using (HauerBetContext db = new HauerBetContext())
    {
            Fixture tempFixture = new Fixture(inFixture);
            db.Add<Fixture>(tempFixture);
        
        db.SaveChanges();
        return inFixture;
    }
}).WithOpenApi().WithName("Add Fixtures");

app.Run();


