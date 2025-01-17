console.log("Gmail content script loaded");

// Get the content of the current email
const getEmailContent = () => {
  const emailBody = document.querySelector('.a3s'); // Gmail's email body class
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
      for (let i = 0; i < object.length; i++) {
        console.log(object[i].eventTitle);
        const startDate = new Date(object[i].startYear, object[i].startMonth-1, object[i].startDay, object[i].startHour, object[i].startMinute).toISOString().replaceAll("-", "").replaceAll(":","");
        const endDate = new Date(object[i].endYear, object[i].endMonth-1, object[i].endDay, object[i].endHour, object[i].endMinute).toISOString().replaceAll("-", "").replaceAll(":","");
        console.log(`https://www.google.com/calendar/render?action=TEMPLATE&text=${object[i].eventTitle.replaceAll(" ", "+")}&details=${object[i].eventDescription.replaceAll(" ", "+")}&location=${object[i].eventLocation.replaceAll(" ", "+")}&dates=${startDate.slice(0,-5)}Z%2F${endDate.slice(0,-5)}Z`)
      }
    })
    .catch(error => console.error("Error:", error));  
}

// Function to check if the URL matches the desired format
const isEmailViewUrl = (url) => {
    // TODO: handle non inbox emails
    const emailViewRegex = /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/#\w+\/[^?]+$/;
    return emailViewRegex.test(url);
  };
  

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
        getEmailContent();
    } else {
        console.log("Not an email view URL.");
    }    
  }
});

urlObserver.observe(document.body, { childList: true, subtree: true });

