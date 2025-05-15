
export const displayDate = (inDateString) =>
    {
      const outDate = new Date(inDateString);
      const prettyTimeArray =outDate.toLocaleTimeString().split(":");
      console.log("Display Date Running");
      return outDate.toDateString().substring(0,10) + ", " + prettyTimeArray[0] + ":" + prettyTimeArray[1] + " " + prettyTimeArray[2].substring(3,5);
    }


export const abbreviatedTeamNameNBA = (inName) =>
{
  const checkArray = inName.split(" ");
  if (checkArray.length > 2)
  {
    const test = checkArray[0].charAt(0)+checkArray[1].charAt(0)+ " " + checkArray[2];
    return test;
  }
  else
  {
    return inName;
  }
}

  export const RESULT = {
    WIN: 1,
    LOSS: -1,
    PUSH: 0,
    PENDING: 2
  }