$(document).ready(function () {
  const BACKEND_API_URL = "http://localhost:3000/api";

  // Message functions
  function showSuccessMessage(message) {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: message,
      timer: 1500,
      showConfirmButton: false,
    });
  }

  function showErrorMessage(message) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message || "Something went wrong.",
    });
  }

  // Initialize DataTable
  let table = $("#categoryTable").DataTable({
    processing: true,
    responsive: true,
    lengthChange: false,
    autoWidth: false,
    ajax: {
      url: `${BACKEND_API_URL}/category`,
      dataSrc: function (response) {
        return Array.isArray(response) ? response : response.data || [];
      },
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      { data: "name" },
      {
        data: null,
        render: function (data, type, row) {
          return `
            <button class="btn btn-success btn-sm edit-btn" data-id="${
              row.id || row._id
            }" data-toggle="modal" data-target="#editCategoryModal">
              Edit
            </button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${
              row.id || row._id
            }">
              Delete
            </button>
          `;
        },
      },
    ],
  });

  let galleryTable = $("#galleryTable").DataTable({
    processing: true,
    responsive: true,
    lengthChange: false,
    autoWidth: false,
    ajax: {
      url: `${BACKEND_API_URL}/gallery`,
      dataSrc: function (response) {
        return Array.isArray(response) ? response : response.data || [];
      },
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<img src="${BACKEND_API_URL}/uploads/${row.image}" width="100" />`;
        },
      },
      { data: "imageTitle" },
      { data: "categoryName" },
      {
        data: null,
        render: function (data, type, row) {
          return `
          <button class="btn btn-success btn-sm edit-gallery-btn" data-id="${
            row.id || row._id
          }" data-toggle="modal" data-target="#editCategoryModal">
            Edit
          </button>
          <button class="btn btn-danger btn-sm delete-gallery-btn" data-id="${
            row.id || row._id
          }">
            Delete
          </button>
        `;
        },
      },
    ],
  });

  // Handle Add Category form submission
  $("#addCategoryForm").submit(function (e) {
    e.preventDefault();
    const formData = $(this).serialize();

    $.ajax({
      url: `${BACKEND_API_URL}/category`,
      method: "POST",
      data: formData,
      dataType: "json",
      success: function (res) {
        if (res.success) {
          $("#addCategoryForm")[0].reset();
          $("#addCategoryModal").modal("hide");
          table.ajax.reload();
          showSuccessMessage("Category added successfully!");
        } else {
          showErrorMessage(res.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error:", xhr.responseText);
        showErrorMessage("Failed to add category.");
      },
    });
  });

  // Handle Edit button click
  $(document).on("click", ".edit-btn", function () {
    let categoryId = $(this).data("id");
    let rowData = table.row($(this).closest("tr")).data();
    $("#editCategoryId").val(categoryId);
    $("#editCategoryName").val(rowData.name);
  });

  // Handle Edit Category form submission
  $("#editCategoryForm").on("submit", function (e) {
    e.preventDefault();
    let categoryId = $("#editCategoryId").val();
    let formData = $(this).serialize();

    $.ajax({
      url: `${BACKEND_API_URL}/category/${categoryId}`,
      type: "PUT",
      data: formData,
      dataType: "json",
      success: function (res) {
        if (res.success) {
          $("#editCategoryModal").modal("hide");
          $("#editCategoryForm")[0].reset();
          table.ajax.reload();
          showSuccessMessage("Category updated successfully!");
        } else {
          showErrorMessage(res.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error:", xhr.responseText);
        showErrorMessage("Failed to update category.");
      },
    });
  });

  // Handle Delete button click
  $(document).on("click", ".delete-btn", function () {
    let categoryId = $(this).data("id");

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `${BACKEND_API_URL}/category/${categoryId}`,
          type: "DELETE",
          dataType: "json",
          success: function (res) {
            if (res.success) {
              table.ajax.reload();
              showSuccessMessage("Category has been deleted.");
            } else {
              showErrorMessage(res.message);
            }
          },
          error: function (xhr, status, error) {
            console.error("Error:", xhr.responseText);
            showErrorMessage("Failed to delete category.");
          },
        });
      }
    });
  });

  // Fetch category dropdown on gallery modal open
  $("#addGalleryModal").on("shown.bs.modal", function () {
    $.ajax({
      url: `${BACKEND_API_URL}/category`,
      method: "GET",
      dataType: "json",
      success: function (res) {
        if (res.length > 0) {
          let selectCategory = $("#selectCategory");
          selectCategory.empty();

          res.forEach(function (category) {
            let option = $("<option>").val(category.name).text(category.name);
            selectCategory.append(option);
          });
        } else {
          console.log("No categories found.");
        }
      },
      error: function (xhr) {
        console.error("Error fetching categories:", xhr.responseText);
        showErrorMessage("Failed to load categories.");
      },
    });
  });
  function loadEditCategoryDropdown() {
    $.ajax({
      url: `${BACKEND_API_URL}/category`,
      method: "GET",
      dataType: "json",
      success: function (res) {
        if (res.length > 0) {
          let selectCategory = $("#editSelectCategory");
          selectCategory.empty();

          res.forEach(function (category) {
            let option = $("<option>").val(category.name).text(category.name);
            selectCategory.append(option);
          });
        } else {
          console.log("No categories found.");
        }
      },
      error: function (xhr) {
        console.error("Error fetching categories:", xhr.responseText);
        showErrorMessage("Failed to load categories.");
      },
    });
  }
  loadEditCategoryDropdown();
  // Handle Add Gallery form submission
  $("#addGalleryForm").submit(function (e) {
    e.preventDefault();

    const fileInput = $("#imageFile")[0];
    const categoryName = $("#selectCategory").val();
    const imageTitle = $("#imageTitle").val();

    if (!fileInput.files[0]) {
      showErrorMessage("Please select an image file.");
      return;
    }

    if (!categoryName) {
      showErrorMessage("Please select a category.");
      return;
    }
    if (!imageTitle) {
      showErrorMessage("Image title filed is required.");
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", fileInput.files[0]);
    formData.append("categoryName", categoryName);
    formData.append("imageTitle", imageTitle);

    $.ajax({
      url: `${BACKEND_API_URL}/gallery`,
      method: "POST",
      data: formData,
      dataType: "json",
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.success) {
          $("#addGalleryForm")[0].reset();
          $("#addGalleryModal").modal("hide");
          galleryTable.ajax.reload();
          showSuccessMessage("Image added successfully!");
        } else {
          showErrorMessage(res.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error:", xhr.responseText);
        showErrorMessage("Failed to add image.");
      },
    });
  });

  // handle delete image button click
  $(document).on("click", ".delete-gallery-btn", function () {
    let galleryId = $(this).data("id");

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `${BACKEND_API_URL}/gallery/${galleryId}`,
          type: "DELETE",
          dataType: "json",
          success: function (res) {
            if (res.success) {
              galleryTable.ajax.reload();
              showSuccessMessage("Gallery Image has been deleted.");
            } else {
              showErrorMessage(res.message);
            }
          },
          error: function (xhr, status, error) {
            console.error("Error:", xhr.responseText);
            showErrorMessage("Failed to delete Gallery Image");
          },
        });
      }
    });
  });

  // handle fetch single gallery
  $(document).on("click", ".edit-gallery-btn", function () {
    const galleryId = $(this).data("id");

    $.ajax({
      url: `${BACKEND_API_URL}/gallery/${galleryId}`,
      method: "GET",
      dataType: "json",
      success: function (res) {
        const galleryItem = Array.isArray(res) ? res[0] : res;

        $("#editGalleryId").val(galleryItem.id);
        $("#editImageTitle").val(galleryItem.imageTitle);
        $("#editSelectCategory").val(galleryItem.categoryName);
        $("#currentGalleryImage").attr(
          "src",
          `${BACKEND_API_URL}/uploads/${galleryItem.image}`
        );

        // Show the modal
        $("#editGalleryModal").modal("show");
      },
      error: function (xhr) {
        console.error("Error fetching gallery item:", xhr.responseText);
        showErrorMessage("Failed to fetch gallery item.");
      },
    });
  });
  //handle update gallery
  $("#editGalleryForm").submit(function (e) {
    e.preventDefault();

    const galleryId = $("#editGalleryId").val();
    const formData = new FormData();
    const imageFile = $("#editImageFile")[0].files[0];
    const imageTitle = $("#editImageTitle").val();
    const categoryName = $("#editSelectCategory").val();

    formData.append("imageTitle", imageTitle);
    formData.append("categoryName", categoryName);

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }
    $.ajax({
      url: `${BACKEND_API_URL}/gallery/${galleryId}`,
      method: "PUT",
      data: formData,
      dataType: "json",
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.success) {
          $("#editGalleryModal").modal("hide");
          $("#editGalleryForm")[0].reset();
          galleryTable.ajax.reload();
          showSuccessMessage("Image Updated successfully!");
        } else {
          showErrorMessage(res.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error:", xhr.responseText);
        showErrorMessage("Failed to add image.");
      },
    });
  });
});
