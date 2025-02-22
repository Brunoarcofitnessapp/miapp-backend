module.exports = class APIfeatures {
  //making a class for api features
  constructor(query, querystring) {
    this.query = query;
    this.querystring = querystring;
  }

  filter() {
    //filtering
    const filterobj = { ...this.querystring };
    const excludedfields = ["page", "limit", "sort", "fields"];
    excludedfields.forEach((el) => delete filterobj[el]);

    //advanced filtering
    let querystring = JSON.stringify(filterobj);
    querystring = querystring.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(querystring));

    return this;
  }

  sorting() {
    if (this.querystring.sort) {
      const sortby = this.querystring.sort.split(",").join(" ");
      this.query = this.query.sort(sortby);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  fieldslimiting() {
    //fieldslimiting
    if (this.querystring.fields) {
      const reqfields = this.querystring.fields.split(",").join(" ");
      console.log(reqfields);
      this.query = this.query.select(reqfields);
    }
    return this;
  }

  pagination() {
    const page = this.querystring.page * 1 || 1;
    const limit = this.querystring.limit * 1 || 10;
    const skip = (page - 1) * limit;
    console.log(skip);

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
};
