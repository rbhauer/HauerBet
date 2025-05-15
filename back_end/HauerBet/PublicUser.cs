using System;
namespace HauerBet;

public class PublicUser{
    public string userName {get;set;}
    public string password {get;set;}
    protected PrivateUser pu;   

    public PublicUser(string userName, string password) {
        this.userName = userName;
        this.password = password;

        this.pu = new PrivateUser(this.userName, this.password);
    }

    public PrivateUser GetPrivateUser()
    {
        return pu;
    }
}