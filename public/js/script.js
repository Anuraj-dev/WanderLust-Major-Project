// Example starter JavaScript for disabling form submissions if there are invalid fields
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

// Search Form Validation - Ensure at least one field is filled
document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.querySelector(".bigbar");
  const searchBtn = searchForm?.querySelector(".search-btn");
  const locationInput = searchForm?.querySelector('input[name="location"]');
  const countrySelect = searchForm?.querySelector('select[name="country"]');
  const priceInput = searchForm?.querySelector('input[name="maxPrice"]');

  // Function to validate search form
  function validateSearchForm() {
    if (!searchForm) return;

    const locationValue = locationInput?.value.trim();
    const countryValue = countrySelect?.value;
    const priceValue = priceInput?.value.trim();

    const isFormValid = locationValue || countryValue || priceValue;

    if (searchBtn) {
      searchBtn.disabled = !isFormValid;
      searchBtn.classList.toggle("disabled", !isFormValid);
    }
  }

  // Initialize country select plugin if available
  if (countrySelect) {
    // Initialize event listeners for form validation
    [locationInput, countrySelect, priceInput].forEach((input) => {
      if (input) {
        input.addEventListener("input", validateSearchForm);
        input.addEventListener("change", validateSearchForm);
      }
    });

    // Run validation on page load
    validateSearchForm();
  }

  // Custom Country Dropdown Functionality
  function setupCustomDropdown() {
    const dropdownContainers = document.querySelectorAll(
      ".custom-dropdown-container"
    );

    dropdownContainers.forEach((container) => {
      const selectedElement = container.querySelector(
        ".custom-dropdown-selected"
      );
      const optionsElement = container.querySelector(
        ".custom-dropdown-options"
      );
      const options = container.querySelectorAll(".dropdown-option");
      const hiddenSelect = container.querySelector("select.hidden");
      const searchInput = container.querySelector(".dropdown-search-input");
      const selectedTextElement = container.querySelector(".selected-text");
      const selectedFlagElement = container.querySelector(".selected-flag");

      // Toggle dropdown when the selected element is clicked
      selectedElement.addEventListener("click", function () {
        optionsElement.classList.toggle("active");
        selectedElement.classList.toggle("active");

        if (optionsElement.classList.contains("active")) {
          // When opening dropdown, focus search input
          if (searchInput) searchInput.focus();

          // Close dropdown when clicking outside
          document.addEventListener("click", closeDropdownOnOutsideClick);
        } else {
          document.removeEventListener("click", closeDropdownOnOutsideClick);
        }
      });

      // Function to close dropdown when clicking outside
      function closeDropdownOnOutsideClick(e) {
        if (!container.contains(e.target)) {
          optionsElement.classList.remove("active");
          selectedElement.classList.remove("active");
          document.removeEventListener("click", closeDropdownOnOutsideClick);
        }
      }

      // Handle option selection
      options.forEach((option) => {
        option.addEventListener("click", function () {
          const value = this.getAttribute("data-value");
          const countryCode = this.getAttribute("data-country-code");
          const displayText = this.textContent.trim();

          // Update hidden select element value (for form submission)
          if (hiddenSelect) {
            hiddenSelect.value = value;
            hiddenSelect.dispatchEvent(new Event("change"));
          }

          // Update the selected text display
          if (selectedTextElement) {
            selectedTextElement.textContent = displayText;
          }

          // Update the flag if country has a code
          if (selectedFlagElement && countryCode) {
            selectedFlagElement.innerHTML = countryCode
              ? `<img src="https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png" alt="${displayText} flag">`
              : "";
          } else if (selectedFlagElement) {
            selectedFlagElement.innerHTML = "";
          }

          // Mark the selected option
          options.forEach((opt) => opt.classList.remove("selected"));
          this.classList.add("selected");

          // Close the dropdown
          optionsElement.classList.remove("active");
          selectedElement.classList.remove("active");

          // Trigger validation
          validateSearchForm();
        });
      });

      // Filter options based on search input
      if (searchInput) {
        searchInput.addEventListener("input", function () {
          const searchValue = this.value.toLowerCase().trim();

          options.forEach((option) => {
            // Skip the "Any Country" option (always visible)
            if (option.getAttribute("data-value") === "") {
              option.style.display = "flex";
              return;
            }

            const optionText = option.textContent.toLowerCase();
            if (optionText.includes(searchValue)) {
              option.style.display = "flex";
            } else {
              option.style.display = "none";
            }
          });
        });

        // Prevent dropdown from closing when clicking in search input
        searchInput.addEventListener("click", function (e) {
          e.stopPropagation();
        });
      }
    });
  }

  // Initialize custom dropdown
  setupCustomDropdown();
});

const wishBtns = document.querySelectorAll(".wishlist-button");

wishBtns.forEach((wishBtn) => {
  wishBtn.addEventListener("click", (event) => {
    event.preventDefault();

    event.stopPropagation();

    console.log("Wishlist button clicked, navigation prevented.");
    const icon = wishBtn.querySelector("i");
    if (icon.classList.contains("fa-regular")) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    } else {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
    }
  });
});
