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
      // TODO: supply current date
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
  const emailViewRegex = /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/#\w+\/[^?]+$/;
  return emailViewRegex.test(url);
};

const insertCollapsible = () => {
  const emailHeader = document.querySelector('.gE');
  if(emailHeader) {
    const style = document.createElement('style');
    style.innerHTML = `
      .collapsible {
        color: #555;
        cursor: pointer;
        padding: 18px;
        width: 90%;
        border: none;
        text-align: left;
        font-size: 15px;
        border-radius: 30px;
        font-family: monospace;
        font-weight: 600;
        transition: all 0.5s ease;
        margin: 20px 10px;
      }

      .active, .collapsible:hover {
        background-color: #555;
        color: #eeeeed;
      }
      
      .content {
        padding: 0 18px;
        background-color: white;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.2s ease-out;
      }
    `;
    document.head.appendChild(style);

    console.log("email header detected");
    const collapsible = document.createElement("button");
    collapsible.classList.add("collapsible");
    collapsible.textContent = "Catching events...";
    emailHeader.insertAdjacentElement("afterend", collapsible);

    const content = document.createElement("div");
    content.classList.add("content");
    collapsible.insertAdjacentElement("afterend", content);
  }
}

const updateCollapsible = (links, titles) => {
  const collapsible = document.querySelector('.collapsible');
  if(collapsible) {
    if(links.length == 0){
      collapsible.textContent = `Couldn't catch any event`;
    } else {
      // change content text
      const content = collapsible.nextElementSibling;
      for(var i = 0; i < links.length; i++) {
        const anEvent = document.createElement("a");
        anEvent.textContent = titles[i];
        anEvent.style.display = "block";
        const attr = document.createAttribute("href");
        attr.value = links[i];
        anEvent.setAttributeNode(attr);
        content.appendChild(anEvent);
      }

      collapsible.textContent = `Caught ${links.length} event(s)`;
      collapsible.addEventListener("click", function() {
        this.classList.toggle("active");
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }    
      });
    }
  }
}

const errorCollapsible = () => {
  const collapsible = document.querySelector('.collapsible');
  if(collapsible){
    collapsible.textContent = `Unexpected Error :(`;
  }
}

let lastUrl = location.href;

// TODO: handle initial load of email
const urlObserver = new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
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
});

urlObserver.observe(document.body, { childList: true, subtree: true });

