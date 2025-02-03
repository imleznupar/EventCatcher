// Get the content of the current email
const getEmailContent = () => {
  const emailBody = document.querySelector('.a3s');
  if (emailBody) {
    console.log("Email body detected:", emailBody.innerText);
    analyzeEmailContent(encodeURIComponent(emailBody.innerText));
  }
};

const analyzeEmailContent = (emailBodyContent) => {
  fetch("http://localhost:3000", {
    method: "GET",
    headers: {
      "email-content": emailBodyContent
    }
  })
    .then(response => response.json())
    .then(object => {
      console.log(object);
      const links = [];
      const titles = [];
      for (let i = 0; i < object.length; i++) {
        console.log(object[i].eventTitle);
        const startDate = new Date(object[i].startYear, object[i].startMonth-1, object[i].startDay, object[i].startHour, object[i].startMinute).toISOString().replaceAll("-", "").replaceAll(":","");
        const endDate = new Date(object[i].endYear, object[i].endMonth-1, object[i].endDay, object[i].endHour, object[i].endMinute).toISOString().replaceAll("-", "").replaceAll(":","");
        links[i] = `https://www.google.com/calendar/render?action=TEMPLATE&text=${object[i].eventTitle.replaceAll(" ", "+")}&details=${object[i].eventDescription.replaceAll(" ", "+")}&location=${object[i].eventLocation.replaceAll(" ", "+")}&dates=${startDate.slice(0,-5)}Z%2F${endDate.slice(0,-5)}Z`
        titles[i] = object[i].eventTitle;
        console.log(`https://www.google.com/calendar/render?action=TEMPLATE&text=${object[i].eventTitle.replaceAll(" ", "+")}&details=${object[i].eventDescription.replaceAll(" ", "+")}&location=${object[i].eventLocation.replaceAll(" ", "+")}&dates=${startDate.slice(0,-5)}Z%2F${endDate.slice(0,-5)}Z`);
      }
      updateCollapsible(links, titles);
    })
    .catch(error => {
      console.error("Error:", error);
      errorCollapsible();
    });  
}

// Function to check if the URL matches the desired format
const isEmailViewUrl = (url) => {
  // TODO: add feature to previous threads
  const emailViewRegex = /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/(\?[a-zA-z]*)?#\w+\/[^?]+$/;
  return emailViewRegex.test(url);
};

const insertCollapsible = () => {
  const allHeaders = document.querySelectorAll('.g3');
  const prevCollapse = document.querySelector('.collapsible');
  if(allHeaders && !prevCollapse) {
    const emailHeader = allHeaders.item(allHeaders.length-1);
    console.log("email header detected");
    const style = document.createElement('style');
    style.innerHTML = `
      .collapsible {
        margin-left: 20px;
        color:rgb(83, 83, 83);
        height: 40px;
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
      }
      .collapsible:not(.inactive):hover {
        background-color: rgb(236, 236, 236);
        border-radius: 50px;
        color:rgb(96, 96, 96);
        cursor: pointer;
        transition: all 0.5s ease-out;
      }
      .active {
        background-color:rgb(220, 220, 220);
        cursor: pointer;
        border-radius: 50px;
        transition: background-color 0.5s ease-out;
      }
      .inactive {
        color:rgb(170, 170, 170);
        cursor: wait;
      }
      .error {
        cursor: default;
      }
      .error:after {
        cursor: default;
        content: '!';
        background-color: rgb(244, 102, 102);
        border-radius: 50%;
        color: rgb(255, 255, 255);
        width: 13px;
        font-size: 10px;
        text-align: center;
        font-weight: bold;
        position: relative;
        top: 7px;
        right: 10px;        
      }
      .content {
        background-color:rgb(255, 255, 255);
        position: absolute;
        z-index: 1;
        border-radius: 3px;
        height: auto;
        top: 55px;
        box-shadow: 0 0 7px rgba(0,0,0,0.2);
        width: 300px;
        text-align: left;
      }
      .event {
        padding: 0 10px 0 30px;
        overflow: hidden;
        text-overflow:ellipsis;
        text-decoration: none;
        display: block;
        white-space: nowrap;
      }
      .event:hover {
        background-color:rgb(241, 241, 241);
        transition: background-color 0.3s ease-out;
      }
      .hx .gH.bAk {
        display: flex;
      }
      `;

    document.head.appendChild(style);

    document.head.insertAdjacentHTML("afterend", '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,350,0,0&icon_names=calendar_add_on" />');

    const collapsible = document.createElement("div");
    collapsible.classList.add("collapsible");
    collapsible.classList.add("inactive");

    const icon = document.createElement("span");
    icon.className = "material-symbols-outlined";
    icon.textContent = "calendar_add_on";
    collapsible.appendChild(icon);

    const content = document.createElement("div");
    content.classList.add("content");
    content.style.display = "none";
    collapsible.appendChild(content);

    emailHeader.insertAdjacentElement("afterend", collapsible);
  } else {
    console.log("NO email header detected");
  }
}

const updateCollapsible = (links, titles) => {
  const collapsible = document.querySelector('.collapsible');
  const content = document.querySelector('.content');
  if(collapsible && content && links.length > 0) {
    // change content text
    for(var i = 0; i < links.length; i++) {
      const anEvent = document.createElement("a");
      anEvent.classList.add("event");
      const attr = document.createAttribute("href");
      attr.value = links[i];
      anEvent.setAttributeNode(attr);

      const anEventDiv = document.createElement("div");
      const anEventText = document.createElement("p");
      const anEventIcon = document.createElement("p");
      const anEventMid = document.createElement("p");
      anEventDiv.style.display = "flex";
      anEventDiv.style.margin = "0";
      anEventText.textContent = titles[i];
      anEventText.style.width = "80%";
      anEventText.style.overflow = "hidden";
      anEventText.style.whiteSpace = "nowrap";
      anEventText.style.textOverflow = "ellipsis";
      anEventText.style.color = "rgb(83, 83, 83)";
      anEventText.style.fontWeight = "500";
      anEventMid.style.width = "10%";
      anEventIcon.textContent = "+";
      anEventIcon.style.width = "10%";
      anEventIcon.style.transform = "scale(1.5)";
      anEventIcon.style.color = "rgb(83, 83, 83)";
      anEventDiv.appendChild(anEventText);
      anEventDiv.appendChild(anEventMid);
      anEventDiv.appendChild(anEventIcon);
      anEvent.appendChild(anEventDiv)
      content.appendChild(anEvent);
    }

    collapsible.classList.toggle("inactive");
    collapsible.addEventListener("click", function() {
      console.log("active collapsible");
      this.classList.toggle("active");
      if (content.style.display == "none"){
        content.style.display = "block";
      } else {
        content.style.display = "none";
      }
    });
  } else if (collapsible) {
    collapsible.style.cursor = "default";
  }
}

const errorCollapsible = () => {
  const collapsible = document.querySelector('.collapsible');
  if(collapsible) {
    collapsible.classList.toggle("error");
  }
}

function checkForElement() {
  console.log("Checking for .g3...");
  const element = document.querySelector('.g3');
  if (element) {
      run(lastUrl);
  } else {
      setTimeout(checkForElement, 500);
  }
}

let lastUrl = location.href;
if(isEmailViewUrl(lastUrl)) {
  checkForElement();
}

const run = (currentUrl) => {
  lastUrl = currentUrl;

  // Check if the current URL matches the email view format
  if (isEmailViewUrl(currentUrl)) {
      console.log("Email view detected:", currentUrl);
      insertCollapsible();
      getEmailContent();
  } else {
      console.log("Not an email view URL.");
  }
}

const urlObserver = new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    run(currentUrl);
  }
});
urlObserver.observe(document.body, { childList: true, subtree: true });