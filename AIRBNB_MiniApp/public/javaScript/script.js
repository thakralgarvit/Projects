(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

const filters = document.querySelectorAll(".filter");

filters.forEach((filter) => {
  filter.addEventListener("click", async () => {
    console.log("clicked");
    filters.forEach((f) => f.classList.remove("active"));
    filter.classList.add("active");

    const activeFilter = document
      .querySelector(".active p")
      .textContent.toLowerCase();
    console.log(activeFilter);

    const listings = document.querySelectorAll(".card");
    listings.forEach((listing) => {
      const listingText = listing
        .querySelector(".listingcat")
        .textContent.toLowerCase();
      console.log(listingText);

      if (listingText.includes(activeFilter)) {
        listing.style.display = "block";
      } else {
        listing.style.display = "none";
      }

      // when we go back to no filter it doesnot show all listing back an update for future
      // and also give all listing a category
    });
  });
});

// tax
let taxSwitch = document.getElementById("flexSwitchCheckDefault");

taxSwitch.addEventListener("click", () => {
  const listings = document.querySelectorAll(".card");
  listings.forEach((listing) => {
    const priceElement = listing.querySelector(".tax-price"); // Select the price element
    let price = parseFloat(listing.querySelector(".tax-price").textContent.replace(/[^\d.-]/g, '')); // Extract numerical price

    if (taxSwitch.checked) {
      const gst = price * 0.18;
      price += gst;
    } else { // Toggle is OFF (GST removed)
        price = price / 1.18; //(approximation)
    }

    // Format the price with commas and update the HTML
    priceElement.textContent = `₹ ${price.toLocaleString("en-IN")}/night`; 
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".input-btn");
  const listings = document.querySelectorAll(".card");

  searchInput.addEventListener("input", e => { //to track each individual increment
    const value = e.target.value.toLowerCase(); //to protect it from case sensitivity 

    listings.forEach((listing) => {
      const textcontent = listing.textContent.toLowerCase();

      const match = textcontent.includes(value); //return true or false
      listing.style.display = match? "block" : "none"; 
    });
  });
});



