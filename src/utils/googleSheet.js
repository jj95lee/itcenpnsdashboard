const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby5N52q5C7PQhQ0-b9GIyQM5K1c5GwHcIJEEUl68wJegF91kdzThakbQkc0ir8fdP66Cw/exec";


export async function saveBusiness(data) {

  const response = await fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return await response.json();
}



export async function deleteBusiness(id) {

  const response = await fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "delete",
      id,
    }),
  });

  return await response.json();

}