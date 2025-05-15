
namespace HauerBet;
public class BetGetter
{
    //data

    private static HttpClient client = new HttpClient();

    private static string betList = "";

/*     public static void create()
    {
        if (myGetter == null)
        {
            myGetter = new BetGetter();
            client = new HttpClient();
        }
    } */

    private static async void refreshFixtures()
    {
        // Call asynchronous network methods in a try/catch block to handle exceptions.
    try
    {
        using HttpResponseMessage response = await client.GetAsync("https://api.the-odds-api.com/v4/sports/?apiKey=000f83be953d41ae8d849fc090694057");
        response.EnsureSuccessStatusCode();
        betList = await response.Content.ReadAsStringAsync();
        // Above three lines can be replaced with new helper method below
        // string responseBody = await client.GetStringAsync(uri);

    }
    catch (HttpRequestException e)
    {
        Console.WriteLine("\nException Caught!");
        Console.WriteLine("Message :{0} ", e.Message);
    }
    }

    public static string getBetList()
    {
        refreshFixtures();
        return betList;
    }
}