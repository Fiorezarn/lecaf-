const BASE_API = import.meta.env.VITE_BASE_URL_BE;

async function fetchRegister({
  fullname,
  username,
  email,
  phonenumber,
  password,
}) {
  const response = await fetch(`${BASE_API}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ fullname, username, email, phonenumber, password }),
  });
  return await response.json();
}

async function fetchlogin({ input, password }) {
  const response = await fetch(`${BASE_API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ input, password }),
  });
  return await response.json();
}

export { fetchRegister, fetchlogin };
