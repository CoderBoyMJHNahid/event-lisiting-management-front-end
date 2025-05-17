const BACKEND_API_URL = "http://localhost:3000/api";

$(document).ready(function () {
  var $grid;
  var lightGalleryInstance = null;

  $("#gallery_content").on("click", "li", function () {
    var filterValue = $(this).attr("data-filter");
    $("#gallery_content li").removeClass("active");
    $(this).addClass("active");
    $grid.isotope({ filter: filterValue });
  });

  function loadEvents() {
    $.get(`${BACKEND_API_URL}/events`).then((res) => {
      let html = "";
      res.data.slice(0, 6).forEach((event) => {
        let descriptionElement = document.createElement("div");
        descriptionElement.innerHTML = event.description;
        let plainTextDescription =
          descriptionElement.textContent || descriptionElement.innerText || "";

        let shortDescription = plainTextDescription.trim().substring(0, 100);
        if (plainTextDescription.length > 100) {
          shortDescription += "...";
        }

        html += `<div class="col-lg-4 mb-5">
            <div class="card">
            <a href="details-events.html?id=${event.id}">
              <img
                src="${event.thumbnail}"
                class="card-img-top"
                alt="Event Images"
              />
              <div class="card-body">
                <h5 class="card-title">
                  <a href="details-events.html?id=${event.id}">${event.title}</a>
                </h5>
                <p class="card-text">
                  ${shortDescription}
                </p>
                <a
                  href="details-events.html?id=${event.id}"
                  class="btn-event"
                  >Read More</a
                >
              </div>
              </a>
            </div>
          </div>`;
      });

      $("#events_content").html(html);
    });
  }
  loadEvents();
  function loadedGallery() {
    $.get(`${BACKEND_API_URL}/gallery`)
      .then((res) => {
        let li_data = `<li data-filter="*" class="active">All</li>`;
        let image_data = "";
        if (res.length > 0) {
          res.forEach((gallery) => {
            li_data += `<li data-filter=".${gallery.categoryName}">${gallery.categoryName}</li>`;
            image_data += `
              <div class="col-sm-6 col-md-4 col-lg-3 mb-4 grid-item ${gallery.categoryName}">
                <a href="${BACKEND_API_URL}/uploads/${gallery.image}" class="gripImg">
                  <img class="gripImg_img" src="${BACKEND_API_URL}/uploads/${gallery.image}" alt="${gallery.imageTitle}" />
                </a>
              </div>`;
          });

          $("#gallery_content").html(li_data);
          $("#lightgallery").html(image_data);

          $grid = $(".grid").isotope({
            itemSelector: ".grid-item",
            percentPosition: true,
            layoutMode: "fitRows",
            fitRows: { gutter: 0 },
          });

          $grid.imagesLoaded().progress(function () {
            $grid.isotope("layout");
          });

          if (lightGalleryInstance) {
            lightGalleryInstance.destroy();
          }

          lightGalleryInstance = lightGallery(
            document.getElementById("lightgallery"),
            {
              selector: ".gripImg",
              plugins: [lgZoom, lgThumbnail],
              speed: 500,
              download: false,
              counter: true,
              thumbnail: true,
              animateThumb: true,
              zoomFromOrigin: true,
              allowMediaOverlap: true,
            }
          );
        }
      })
      .catch((error) => {
        console.error("Error loading gallery:", error);
      });
  }

  loadedGallery();
});
