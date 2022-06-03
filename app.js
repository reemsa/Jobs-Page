//this is represent the data the company work with
const countries = ["Palestine", "Jordan", "Lebanon", "Saudi Arabia"];
const cities = ["Beirut", "Jenin", "Nablus", "Amman", "Jada"];
const sectors = ["Sales", "Airlines", "Administration", "Computer Software"];

const jobURL = `http://localhost:3000/jobs`;
const addButton = document.getElementById("add-button");
let enabledSettings = [];

const getTypeList = (list, type) => {
  return (
    list
      .map((item) => item?.[`${type}`])
      .filter((item, pos, self) => {
        return self.indexOf(item) == pos;
      }) ?? []
  );
};

function prepareDropDown() {
  const sectorSelect = document.getElementById("sector-list");
  const countrySelect = document.getElementById("country-list");
  const citySelect = document.getElementById("city-list");

  const sectorItems = sectors.map((item) => {
    const option = document.createElement("option");
    option.textContent = item;
    return option;
  });

  const countryItems = countries.map((item) => {
    const option = document.createElement("option");
    option.textContent = item;
    return option;
  });
  const cityItems = cities.map((item) => {
    const option = document.createElement("option");
    option.textContent = item;
    return option;
  });

  sectorItems.forEach((item) => sectorSelect.appendChild(item));
  countryItems.forEach((item) => countrySelect.appendChild(item));
  cityItems.forEach((item) => citySelect.appendChild(item));
}

function clearCategoriesList() {
  const countryList = document.querySelector("#countriesList");
  const cityList = document.querySelector("#cityList");
  const sectorList = document.querySelector("#sectorList");
  while (countryList.firstChild) {
    countryList.removeChild(countryList.lastChild);
  }
  while (cityList.firstChild) {
    cityList.removeChild(cityList.lastChild);
  }
  while (sectorList.firstChild) {
    sectorList.removeChild(sectorList.lastChild);
  }
}

function prepareCategories() {
  fetch(`${jobURL}`)
    .then((response) => response.json())
    .then((list) => {
      const countryList = document.querySelector("#countriesList");
      const cityList = document.querySelector("#cityList");
      const sectorList = document.querySelector("#sectorList");
      const search = document.getElementById("titleSearch");
      search.addEventListener("input", debounceEvent(inputHandler, 300));

      const countries = getTypeList(list, "country");
      const countryItems = countries.map((country, index) =>
        createItem({ value: country, index, type: "country" })
      );

      const cities = getTypeList(list, "city");
      const cityItems = cities.map((city, index) =>
        createItem({ value: city, index, type: "city" })
      );

      const sectors = getTypeList(list, "sector");
      const sectorItems = sectors.map((sector, index) =>
        createItem({ value: sector, index, type: "sector" })
      );

      countryItems.forEach((item) => countryList.appendChild(item));
      cityItems.forEach((item) => cityList.appendChild(item));
      sectorItems.forEach((item) => sectorList.appendChild(item));

      var checkboxes = document.querySelectorAll("input[type=checkbox]");
      addButton.addEventListener("click", showConfirmationModal);
      checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
          enabledSettings = Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
            .filter((i) => i.checked) // Use Array.filter to remove unchecked checkboxes.
            .map((i) => {
              return { value: i.value, type: i.name };
            }); // Use Array.map to extract only the checkbox values from the array of objects.

          fetchJobList();
        });
      });
    });
}

function createItem({ value, index, type }) {
  // Create checkbox Element
  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = `${type}${index}`;
  input.name = type;
  input.value = value;

  const span = document.createElement("span");
  span.className = "checkmark";

  // Create label
  const label = document.createElement("label");
  // label.for = `${type}${index}`;
  label.textContent = value;
  label.className = "checkbox-container";

  label.appendChild(input);
  label.appendChild(span);

  const item = document.createElement("li");
  item.className = "item";

  // item.appendChild(input);
  item.appendChild(label);

  return item;
}

function deletePost(id) {
  fetch(`${jobURL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(() => fetchJobList());
}

function viewPost(id) {
  fetch(`${jobURL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((response) => {
      const { country, city, sector, jobTitle, description } = response;
      const sectorSelect = document.getElementById("sector-list");
      const countrySelect = document.getElementById("country-list");
      const citySelect = document.getElementById("city-list");
      const jobTitleInput = document.getElementById("newJobTitle");
      const descriptionInput = document.getElementById("description");
      sectorSelect.value = sector ?? "";
      countrySelect.value = country ?? "";
      citySelect.value = city ?? "";
      jobTitleInput.value = jobTitle ?? "";
      descriptionInput.value = description ?? "";

      const backdrop = document.querySelector("#backdrop");
      backdrop.style.display = "flex";
      const close = document.getElementById("cancel");
      const add = document.getElementById("submit-add");
      add.style.display = "none";
      close.addEventListener("click", hideConfirmationModal);
    });
}

function createJobs({ country, city, jobTitle, description, sector, id }) {
  const container = document.createElement("div");
  container.className = "job-container";

  const detailsContainer = document.createElement("div");
  detailsContainer.className = "details-container";

  const image = document.createElement("img");
  image.src = "imageIcon.jpeg";
  image.alt = "image";
  image.width = "100";
  image.height = "100";
  image.class = "image";

  const details = document.createElement("div");
  details.className = "details";

  const jobTitleItem = document.createElement("p");
  jobTitleItem.className = "job-title";
  jobTitleItem.textContent = jobTitle;

  const jobCountryItem = document.createElement("p");
  jobCountryItem.className = "job-country";
  jobCountryItem.textContent = `${city}, ${country}`;

  const jobSectorItem = document.createElement("p");
  jobSectorItem.className = "job-sector";
  jobSectorItem.textContent = sector;

  const jobDescriptionItem = document.createElement("p");
  jobDescriptionItem.className = "job-description";
  jobDescriptionItem.textContent = description;

  details.appendChild(jobTitleItem);
  details.appendChild(jobCountryItem);
  details.appendChild(jobSectorItem);
  details.appendChild(jobDescriptionItem);

  detailsContainer.appendChild(image);
  detailsContainer.appendChild(details);

  const actionButtons = document.createElement("div");
  actionButtons.className = "action-button";

  const deleteIcon = document.createElement("img");
  deleteIcon.src = "delete.jpeg";
  deleteIcon.width = "15";
  deleteIcon.height = "15";
  deleteIcon.onclick = () => deletePost(id);

  const viewIcon = document.createElement("img");
  viewIcon.src = "view.png";
  viewIcon.width = "15";
  viewIcon.height = "15";
  viewIcon.className = "view-button";
  viewIcon.onclick = () => viewPost(id);

  actionButtons.appendChild(viewIcon);
  actionButtons.appendChild(deleteIcon);

  container.appendChild(detailsContainer);
  container.appendChild(actionButtons);

  return container;
}

function debounceEvent(callback, time) {
  let interval;
  return (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      interval = null;
      callback(...args);
    }, time);
  };
}

function fetchJobList(searchValue) {
  const sectorFilters = enabledSettings
    .filter((item) => item?.type === "sector")
    .map((item) => item?.value);
  const countryFilters = enabledSettings
    .filter((item) => item?.type === "country")
    .map((item) => item?.value);
  const cityFilters = enabledSettings
    .filter((item) => item?.type === "city")
    .map((item) => item?.value);

  fetch(`${jobURL}`)
    .then((response) => response.json())
    .then((list) => {
      const jobs = document.querySelector("#jobs");
      while (jobs.firstChild) {
        jobs.removeChild(jobs.lastChild);
      }

      let filteredList = [...list];

      if (enabledSettings?.length > 0) {
        filteredList = list?.filter(
          (item) =>
            (sectorFilters?.length > 0
              ? sectorFilters?.includes(item?.sector)
              : true) &&
            (countryFilters?.length > 0
              ? countryFilters?.includes(item?.country)
              : true) &&
            (cityFilters?.length > 0 ? cityFilters?.includes(item?.city) : true)
        );
      }

      const jobList = filteredList
        .filter((item) =>
          searchValue ? item?.jobTitle.includes(searchValue) : true
        )
        .map((item) => {
          return createJobs({
            country: item?.country,
            city: item?.city,
            jobTitle: item?.jobTitle,
            description: item?.description,
            sector: item?.sector,
            id: item?.id,
          });
        });
      jobList.forEach((item) => jobs.appendChild(item));
      if (jobList?.length === 0) {
        const message = document.createElement("div");
        message.textContent = "No Jobs at the moment";
        message.style.display = "flex";
        message.style.justifyContent = "center";
        message.style.margin = "5rem 0";
        jobs.appendChild(message);
      }
    });
}

function inputHandler(e) {
  fetchJobList(e.target.value);
}

const handleAddJob = (event) => {
  const sectorSelect = document.getElementById("sector-list");
  const countrySelect = document.getElementById("country-list");
  const citySelect = document.getElementById("city-list");
  const jobTitleInput = document.getElementById("newJobTitle");
  const descriptionInput = document.getElementById("description");
  var snackbar = document.getElementById("snackbar");

  const sector = sectorSelect.value;
  const city = citySelect.value;
  const country = countrySelect.value;
  const jobTitle = jobTitleInput.value;
  const description = descriptionInput.value;

  if (!sector || !city || !country || !jobTitle || !description) {
    snackbar.className = "show";
    setTimeout(function () {
      snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
    return;
  }

  fetch(`${jobURL}`, {
    method: "POST",
    body: JSON.stringify({
      country,
      city,
      sector,
      jobTitle,
      description,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => {
      fetchJobList();
      clearCategoriesList();
      prepareCategories();
    })
    .catch((error) => console.log(error))
    .finally(() => {
      hideConfirmationModal();
    });
};

function hideConfirmationModal() {
  const backdrop = document.querySelector("#backdrop");
  backdrop.style.display = "none";
}

function showConfirmationModal() {
  //clear fields
  const sectorSelect = document.getElementById("sector-list");
  const countrySelect = document.getElementById("country-list");
  const citySelect = document.getElementById("city-list");
  const jobTitleInput = document.getElementById("newJobTitle");
  const descriptionInput = document.getElementById("description");
  sectorSelect.value = "";
  countrySelect.value = "";
  citySelect.value = "";
  jobTitleInput.value = "";
  descriptionInput.value = "";

  const backdrop = document.querySelector("#backdrop");
  backdrop.style.display = "flex";
  const close = document.getElementById("cancel");
  const add = document.getElementById("submit-add");
  add.style.display = "inline";
  close.addEventListener("click", hideConfirmationModal);
  add.addEventListener("click", handleAddJob);
}

// Fired On Page Load
function setUp() {
  prepareCategories();
  prepareDropDown();
  fetchJobList();
}

// To Ensure The Script Works Correctly
window.addEventListener("DOMContentLoaded", setUp);
