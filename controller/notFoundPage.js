module.exports.notFoundPage = (req, res) => {
  res.render("notFound", {
    title: "404",
    active: "",
  });
};
