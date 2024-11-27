const getPagination = (page, size) => {
  const limit = +size;
  const offset = (page - 1) * limit;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: datas } = data;
  const currentPage = +page;
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
