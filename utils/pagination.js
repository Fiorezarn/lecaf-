// utils/pagination.js
const getPagination = (page, size) => {
  const limit = size ? +size : 10; // Default limit to 10 if not provided
  const offset = page ? (page - 1) * limit : 0; // Offset untuk halaman dimulai dari 1

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: datas } = data;
  const currentPage = page ? +page : 1; // Halaman saat ini dimulai dari 1
  const totalPages = Math.ceil(totalItems / limit);

  return {
    code: 200,
    status: "Success",
    totalItems,
    data: datas,
    totalPages,
    currentPage,
  };
};

module.exports = { getPagination, getPagingData };
