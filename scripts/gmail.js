console.log("Gmail content script loaded");

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
      for (let i = 0; i < object.length; i++) {
        console.log(object[i].eventTitle);
        const startDate = new Date(object[i].startYear, object[i].startMonth-1, object[i].startDay, object[i].startHour, object[i].startMinute).toISOString().replaceAll("-", "").replaceAll(":","");
        const endDate = new Date(object[i].endYear, object[i].endMonth-1, object[i].endDay, object[i].endHour, object[i].endMinute).toISOString().replaceAll("-", "").replaceAll(":","");
        links[i] = `https://www.google.com/calendar/render?action=TEMPLATE&text=${object[i].eventTitle.replaceAll(" ", "+")}&details=${object[i].eventDescription.replaceAll(" ", "+")}&location=${object[i].eventLocation.replaceAll(" ", "+")}&dates=${startDate.slice(0,-5)}Z%2F${endDate.slice(0,-5)}Z`
        console.log(`https://www.google.com/calendar/render?action=TEMPLATE&text=${object[i].eventTitle.replaceAll(" ", "+")}&details=${object[i].eventDescription.replaceAll(" ", "+")}&location=${object[i].eventLocation.replaceAll(" ", "+")}&dates=${startDate.slice(0,-5)}Z%2F${endDate.slice(0,-5)}Z`);
      }
      updateCollapsible(links);
    })
    .catch(error => console.error("Error:", error));  
}

// Function to check if the URL matches the desired format
const isEmailViewUrl = (url) => {
  // TODO: handle non inbox emails
  const emailViewRegex = /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/#\w+\/[^?]+$/;
  return emailViewRegex.test(url);
};

const insertCollapsible = () => {
  const emailHeader = document.querySelector('.gE');
  if(emailHeader) {
    console.log("email header detected");
    const collapsible = document.createElement("button");
    collapsible.classList.add("collapsible");
    collapsible.textContent = "Catching events...";
    emailHeader.insertAdjacentElement("afterend", collapsible);

    const content = document.createElement("p");
    content.textContent = "this is content";
    content.style.display = "none";
    collapsible.insertAdjacentElement("afterend", content);
  }
}

const updateCollapsible = (links) => {
  const collapsible = document.querySelector('.collapsible');
  if(collapsible) {
    console.log("found coll");
    const content = collapsible.nextElementSibling;

    var str = "";
    for(var i = 0; i < links.length; i++) {
      str += links[i] + "\n";
    }
    content.textContent = str;

    collapsible.textContent = `Caught ${links.length} events`;
    collapsible.addEventListener("click", function() {
      console.log("clicked");
      this.classList.toggle("active");
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}
  

let lastUrl = location.href;

// TODO: handle initial load of email
const urlObserver = new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    console.log("URL changed:", currentUrl);

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

