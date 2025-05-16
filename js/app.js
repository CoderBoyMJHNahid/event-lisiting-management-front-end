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

  function loadedGallery() {
    $.get(`${BACKEND_API_URL}/gallery`)
      .then((res) => {
        console.log(res);
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
