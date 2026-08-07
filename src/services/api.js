const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby5N52q5C7PQhQ0-b9GIyQM5K1c5GwHcIJEEUl68wJegF91kdzThakbQkc0ir8fdP66Cw/exec";


export async function getMasterData(){

  const response = await fetch(
    `${SCRIPT_URL}?t=${Date.now()}`
  );

  return await response.json();
}