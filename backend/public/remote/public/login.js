const form = document.getElementById("form");
const inputs = form.querySelectorAll("#loginInput");
let userCode = 0000;
const results = document.getElementById("resultsDiv");

const serverPort = 3000;
const serverHost = 'http://localhost';
const serverUrl = `${serverHost}:${serverPort}/search-screen`;
let localSessionID = localStorage.getItem("sessionID");
const socket = io(serverUrl, {
  auth: {
    token: userCode, //socket handshake token
    sessionID: localSessionID
  },
  reconnection: false,
  autoConnect: true,
});


function windowLoaded() {
  // codeBlock = document.getElementById("code-block");
  // code = document.getElementById("code");
  // form = document.getElementById("form");
  // inputs = form.querySelectorAll("input");  
  reset();
  localSessionID = localStorage.getItem("sessionID");
  if (localSessionID) {
    connectSocket();
  }
  document.getElementById("errorDiv").classList.add("hidden");
}

inputs.forEach((input, key) => {
  if (key !== 0) {
    input.addEventListener("click", function () {
      inputs[0].focus();
    });
  }
  input.addEventListener("keyup", function (evt) {
    if (input.textLength > 1) {
      ;
      inputs[key].value = input.value.charAt(0);
    }
    if (evt.keyCode < 48 || evt.keyCode > 57) {
      if (evt.keyCode != 8) {
        inputs[key].value = '';
        return;
      }
    }
    if (evt.keyCode == 8) {
      if (key > 0) {
        inputs[key - 1].value = '';
        inputs[key - 1].focus();
      }
    }
    else if (input.value) {
      if (key === 3) {
        // Last one tadaa
        userCode = [...inputs].map((input) => input.value).join("");
        connectSocket();
        //codeBlock.classList.remove("hidden");
        //code.innerText = userCode;
      } else {
        inputs[key + 1].focus();
      }
    }
  });
});

import React from 'react';
import {PinCode} from 'baseui/pin-code';
export default function Example() {
  const [values, setValues] = React.useState(['', '', '', '']);
  return (
    <PinCode
      values={values}
      onChange={({values}) => {
        setValues(values);
      }}
    />
  );
}

function reset() {
  form.reset();
  resetResults();
  document.getElementById("searchErrorField").classList.add("hidden");
  document.getElementById("search-string").value="";
  //codeBlock.classList.add("hidden");
  //code.innerText = "";
};

function resetResults(){
//   results.innerHTML= `<li class="group">
//   <a href="#" class="block bg-custom_gray group-hover:bg-gray-200">
//     <div class="flex items-center px-4 py-4 sm:px-6">
//       <div class="min-w-0 mx-auto flex items-center text-3xl text-gray-300 mb-1">
//         Start searching
//         <svg class="w-20 h-20 mr-2 ml-10 animate-bounce mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//         </svg>
//       </div>
//     </div>
//   </a>
// </li>`;
}

function fetchVideos() {
  const searchIcon = document.getElementById("searchIcon");
  const search_string = document.getElementById("search-string");
  const errorField = document.getElementById("searchErrorField");
  searchIcon.classList.add("animate-ping");
  searchIcon.classList.add("animate-ping");
  if (!search_string.value) {//check if field isnt empty
    errorField.classList.remove("hidden");
    searchIcon.classList.remove("animate-ping");
    errorField.value = "Field is empty!";
    return;
  }
  socket.emit("retrieveVideos", search_string.value, (response) => {
    console.log(response);
    if (response == "Could not find any videos") {
      errorField.classList.remove("hidden");
      errorField.value = "Nothing found!";
      searchIcon.classList.remove("animate-ping");
      return;
    }
    results.innerHTML = "";
    response.forEach((video) => {
      results.innerHTML += `<li class="group">
          <a href="#" class="block bg-custom_gray group-hover:bg-gray-200">
            <div class="flex items-center px-4 py-4 sm:px-6">
              <div class="min-w-0 flex-1 flex items-center">
                <div class="flex-shrink-0 border-2 border-opacity-40 rounded-lg border-custom_blue2">
                  <img class="h-12 w-20 rounded-md" src="${video.thumbnail}" alt="Preview" />
                </div>
                <div class="min-w-0 flex-1 px-4 md:gap-4">
                  <div>
                    <p class="text-sm font-medium text-custom_turquoise truncate">${video.title}</p>
                    <p class="mt-2 flex items-center text-sm text-custom_blue2">
                      <!-- Heroicon name: microphone -->
                      <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-custom_blue2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 411.546 411.546" fill="currentColor" aria-hidden="true">
                        <g>
                          <path
                            d="M338.96,28.886C320.333,10.259,295.566,0,269.222,0c-20.138,0-39.495,6.018-55.979,17.403
                        c-2.912,2.011-4.514,4.396-4.758,7.088c-0.214,2.353,0.698,4.678,2.569,6.549l125.752,125.752c1.581,1.58,3.54,2.416,5.666,2.416
                        c0.001,0,0.001,0,0.002,0c3.752,0,6.59-2.628,7.677-4.183C377.54,115.808,372.833,62.759,338.96,28.886z"
                          />
                          <path
                            d="M201.24,45.987c-3.003-3.003-6.037-3.633-8.054-3.633c-5.96,0-9.863,5.056-11.265,7.23
                        c-12.024,18.649-17.412,41.145-15.171,63.345c2.272,22.518,12.354,43.749,28.386,59.781c18.627,18.627,43.395,28.887,69.741,28.887
                        c0.001,0,0,0,0.002,0c19.573,0,38.481-5.713,54.679-16.521c2.013-1.344,5.544-4.87,6.006-9.559c0.302-3.056-0.804-6.01-3.112-8.319
                        L201.24,45.987z"
                          />
                          <path
                            d="M228.797,386.546h-50.916V256.248l38.21-29.667c4.579-3.555,6.81-8.2,6.118-12.743c-0.692-4.543-4.203-8.313-9.629-10.344
                        c-0.174-0.065-17.558-6.688-29.55-18.68c-11.993-11.992-18.617-29.376-18.681-29.546c-2.286-6.109-6.766-9.756-11.985-9.756
                        c-4.035,0-7.979,2.217-11.104,6.242L48.067,271.789c-6.564,8.454-5.747,21.488,1.821,29.057l17.111,17.111
                        c3.997,3.996,9.7,6.288,15.649,6.289c0,0,0,0,0,0c4.935,0,9.696-1.587,13.407-4.468l56.826-44.12v110.888h-50.916
                        c-6.903,0-12.5,5.597-12.5,12.5s5.597,12.5,12.5,12.5h126.831c6.903,0,12.5-5.597,12.5-12.5S235.7,386.546,228.797,386.546z"
                          />
                        </g>
                      </svg>
                      <span class="truncate">${video.author.name}</span>

                      <!-- Heroicon name: views -->
                      <svg class="align flex-shrink-0 mr-1.5 h-5 w-5 text-custom_blue2 ml-4 hidden sm:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span class="truncate hidden sm:block">${video.views}</span>

                      <!-- Heroicon name: duration -->
                      <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-custom_blue2 ml-4 hidden sm:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="truncate hidden sm:block">${video.timestamp}</span>
                    </p>
                    <p class="mt-2 flex text-sm text-custom_blue2 sm:hidden block">
                      <!-- Heroicon name: views -->
                      <svg class="align flex-shrink-0 mr-1.5 h-5 w-5 text-custom_blue2 ml-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span class="truncate">${video.views}</span>

                      <!-- Heroicon name: duration -->
                      <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-custom_blue2 ml-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="truncate">${video.timestamp}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <!-- Heroicon name: solid/chevron-right -->
                <svg class="h-7 w-7 text-gray-400 group-hover:rotate-90 group-hover:transition group-hover:duration-200 group-hover:text-custom_blue2 group-hover:ease-in-out" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </a>
        </li>
      `;
    });
    searchIcon.classList.remove("animate-ping");
  });
}

function connectSocket() {
  socket.auth.token = userCode;
  socket.connect();
  inputs[0].focus();
  reset();
};
socket.on("disconnect", (reason) => {
  if (reason === "io server disconnect") {
    toggleModal(true, "Please reconnect to the sceen");
  } else {
    toggleModal(true, "Connection lost");
  }
});

socket.on("connect_error", (err) => {
  if (err == "Error: Not authorized") {
    toggleModal(true, "Invalid PIN");
  } else {
    toggleModal(true, "Unknown error");
  }
});

socket.on("session", sessionID => {
  // attach the session ID to the next reconnection attempts
  socket.auth = sessionID;
  // store it in the localStorage
  localStorage.setItem("sessionID", sessionID);
  // save the ID of the user
  toggleModal(false);
});

function toggleModal(visible, error) {
  const errorField = document.getElementById("errorField");
  const errorDiv = document.getElementById("errorDiv");
  const modal = document.getElementById("loginModal");
  if (visible) {
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
  if (error) {
    errorDiv.classList.remove('hidden');
    errorField.innerText = error;
  } else {
    errorDiv.classList.add('hidden');
  }
}
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