const USER_OBJ = {
  contents: [],
  init() {
    let _contents = localStorage.getItem(USER_OBJ);
    if (_contents) {
      USER_OBJ.contents = JSON.parse(_contents);
    } else {
      return null;
    }
  },
  getAll() {
    if (this.init() === null) return null;
    return USER_OBJ.contents;
  },

  register(obj) {
    this.init();
    if (this.findByEmail(obj.email) == true) return;
    USER_OBJ.contents.push(obj);
    USER_OBJ.sync();
  },

  async sync() {
    let _USER_OBJ = JSON.stringify(USER_OBJ.contents);
    await localStorage.setItem(USER_OBJ, _USER_OBJ);
  },

  logout(id) {
    USER_OBJ.contents = USER_OBJ.contents.filter((item) => {
      if (item.id !== id) return true;
    });

    USER_OBJ.sync();
  },
  empty() {
    USER_OBJ.contents = [];
    USER_OBJ.sync();
  },
  findByEmail(id) {
    let match = USER_OBJ.contents.filter((item) => {
      if (item.email == id) return true;
    });

    if (match && match[0]) {
      return true;
    } else {
      return false;
    }
  },
  getUserByEmail(email) {
    let match = this.getAll().filter((item) => {
      if (item.email === email) return true;
    });

    if (match && match[0]) {
      return match[0];
    } else {
      return false;
    }
  },
};

// ┌──────────────────────────────────────────────────────────────────────────────┐
// │                                                                              │
// │                           validation and role                                                   │
// │                                                                              │
// │                                                                              │
// └──────────────────────────────────────────────────────────────────────────────┘
const Role = {
  str_length: 3,
  home_page: "http://localhost:5500",
};

function checkEmptyInput(input) {
  if (input === undefined || input === null || input === "") return;
}

function checkPasswordMatches(password, re_password) {
  // here customize css
  if (password.length != re_password.length) return;
  // here customize css
  if (password != re_password) return;
}

function validateEmail(emailInput) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(emailInput).toLowerCase());
}

// ┌──────────────────────────────────────────────────────────────────────────────┐
// │                                                                              │
// │                           Register                                                    │
// │                                                                              │
// │                                                                              │
// └──────────────────────────────────────────────────────────────────────────────┘
const registerForm = document.getElementById("register_form");

if (registerForm != undefined) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let content = e.target;
    let username = content.querySelector("#username").value;
    let email = content.querySelector("#email").value;
    let password = content.querySelector("#password").value;
    let r_password = content.querySelector("#r_password").value;

    //check user exist

    // here customize css
    if (USER_OBJ.findByEmail(email)) return;

    // length
    if (username.length < Role.str_length) return;
    if (password.length < Role.str_length) return;
    /**
     * filter inputs
     */
    // here customize css
    checkEmptyInput(username);
    checkEmptyInput(email);
    checkEmptyInput(password);
    checkEmptyInput(r_password);

    // check password
    // here customize css
    checkPasswordMatches(password, r_password);
    // check for email
    // here customize css
    if (!validateEmail(email)) return;

    let newUser = {
      id: Math.floor(Math.random() * 50000),
      username: username,
      email: email,
      password: password,
    };

    // console.log(newUser);
    USER_OBJ.register(newUser);

    window.location.href = Role.home_page;
  });
}

// ┌──────────────────────────────────────────────────────────────────────────────┐
// │                                                                              │
// │                           Login                                                   │
// │                                                                              │
// │                                                                              │
// └──────────────────────────────────────────────────────────────────────────────┘

const isLogin = localStorage.getItem("login", null);
const currentUser = localStorage.getItem("currentUser", null);

const loginForm = document.getElementById("login_form");

if (loginForm != undefined) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let content = e.target;
    let email = content.querySelector("#email").value;
    let password = content.querySelector("#password").value;

    // validation email and password
    /**
     *
     *
     *
     */

    let isUser = USER_OBJ.getUserByEmail(email);

    if (isUser.password !== password) {
      // css error
      return;
    }
    localStorage.setItem("login", true);
    localStorage.setItem("currentUser", isUser.username);

    window.location.href = Role.home_page;
  });
}

// ┌──────────────────────────────────────────────────────────────────────────────┐
// │                                                                              │
// │                           check login                                                   │
// │                                                                              │
// │                                                                              │
// └──────────────────────────────────────────────────────────────────────────────┘
function checkIfLogin() {
  let navLogin = document.querySelector(".nav-container .login-container");
  let userAndLogout = document.querySelector(".nav-container .current-user");
  let username = document.querySelector(
    ".nav-container .current-user .username"
  );

  let localLogin = localStorage.getItem("login");
  let localUser = localStorage.getItem("currentUser");

  if (localLogin != "null" || localUser != "null") {
    navLogin.style.display = "none";
    userAndLogout.style.display = "flex";

    username.textContent = localUser;
  }
}

checkIfLogin();

// ┌──────────────────────────────────────────────────────────────────────────────┐
// │                                                                              │
// │                           logout                                                   │
// │                                                                              │
// │                                                                              │
// └──────────────────────────────────────────────────────────────────────────────┘
const logout = document.querySelector(".nav-container .current-user .logout");
if (logout != undefined) {
  logout.addEventListener("click", () => {
    localStorage.setItem("login", null);
    localStorage.setItem("currentUser", null);

    let navLogin = document.querySelector(".nav-container .login-container");
    let userAndLogout = document.querySelector(".nav-container .current-user");

    navLogin.style.display = "flex";
    userAndLogout.style.display = "none";

    // window.location.href = Role.home_page;
  });
}
