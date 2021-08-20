const inputs = document.querySelectorAll("input");
const codeBlock = document.getElementById("code-block");
const code = document.getElementById("code");
const form = document.querySelector("form");
let userCode = 0000;

function reconnectToServer(){
  reset();
  const localSessionID = localStorage.getItem("sessionID");
  if(localSessionID){
    connectSocket();
  }
}

inputs.forEach((input, key) => {
  if (key !== 0) {
    input.addEventListener("click", function () {
      inputs[0].focus();
    });
  }
  input.addEventListener("keyup", function () {
    if (input.value) {
      if (key === 3) {
        // Last one tadaa
        userCode = [...inputs].map((input) => input.value).join("");
        connectSocket();
        codeBlock.classList.remove("hidden");
        code.innerText = userCode;
      } else {
        inputs[key + 1].focus();
      }
    }
  });
});

const reset = () => {
  form.reset();
  codeBlock.classList.add("hidden");
  code.innerText = "";
};

function connectSocket() {
  const serverPort = 3000;
  const serverHost = 'http://localhost';
  const serverUrl = `${serverHost}:${serverPort}/search-screen`;
  const localSessionID = localStorage.getItem("sessionID");
  const socket = io(serverUrl, {
    auth: {
      token: userCode, //socket handshake token
      sessionID: localSessionID
    },
    reconnection: false,
    autoConnect: true,
  });
  socket.on("session", ({ sessionID }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };
    // store it in the localStorage
    localStorage.setItem("sessionID", sessionID);
    // save the ID of the user
  });
  inputs[0].focus();
  reset();
};


// const inputs = document.getElementsByName("id");
// const codeBlock = document.getElementsByName("code-block");
// const code = document.getElementsByName("code");
// const form = document.getElementsByName("id-form");

// console.log(inputs);

// inputs.forEach((input, key) => {
// if (key !== 0) {
//     input.addEventListener("click", function () {
//     inputs[0].focus();
//     });
// }
// //Array.from(inputs).forEach(function(input){
//     inputs.addEventListener("keyup", function(event) {
//       // Number 13 is the "Enter" key on the keyboard
//       input.nextElementSibling.focus();
//       console.log("input");
//       //if (event.keyCode === 13 || input.value.length == 3) {
//       //  // Focus on the next sibling
//       //  elt.nextElementSibling.focus()
//       //}
//     });
// //  })
// function nextInput(){
//     console.log("next");
// }

// inputs.addEventListener("keyup", function () {
//     console.log("hi");
//     if (input.value) {
//     if (key === 3) {
//         // Last one tadaa
//         const userCode = [...inputs].map((input) => input.value).join("");
//         codeBlock.classList.remove("hidden");
//         code.innerText = userCode;
//     } else {
//         inputs[key + 1].focus();
//     }
//     }
// });
// });

// const reset = () => {
// form.reset();
// codeBlock.classList.add("hidden");
// code.innerText = "";
// };